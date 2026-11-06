#!/usr/bin/env python3
"""Build the offline release; use --list to review its contents without writing."""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path, PurePosixPath
import re
import stat
import subprocess
import tempfile
import zipfile


ROOT = Path(__file__).resolve().parents[1]
ARCHIVE_ROOT = "狼与香辛料-行商旅记"
BLOCKED_PARTS = {
    ".git", ".DS_Store", "node_modules", "releases", "__pycache__",
    "狼与香辛料原作",
}
MEDIA_EXTENSIONS = r"jpg|jpeg|png|gif|webp|avif|svg|ico|woff2?|ttf|otf|mp3|ogg|wav|mp4|webm"
LOCAL_ASSET = re.compile(r"(?<![\w./:-])assets/[\w./-]+")
BARE_MEDIA = re.compile(r"['\"]([\w.-]+\.(?:" + MEDIA_EXTENSIONS + r"))['\"]", re.I)
REQUIRED = {
    "index.html", "style.css", "calendar.css", "cargo.css", "goods-catalog.css",
    "package.json", "README.md", "启动游戏.command", "scripts/serve.cjs",
    "scripts/package.py", "js/app.js", "js/data.js", "js/engine.js", "js/money.js",
    "js/calendar.js", "js/calendar-ui.js", "js/icons.js", "js/goods-catalog.js",
    "js/cargo-ui.js", "js/map-art.js", "js/content.js", "js/balance.generated.js",
    "js/story-ui.js", "design/数值策划.xlsx", "scripts/build_balance.py", "AGENTS.md",
}


def permitted(relative: PurePosixPath) -> bool:
    return relative.parts[:2] != ("design", "previews") \
        and not any(part in BLOCKED_PARTS or part.startswith(".") for part in relative.parts) \
        and relative.suffix.lower() not in {".pyc", ".pyo", ".zip"}


def files_in(directory: Path):
    """Prune excluded trees before walking, including the original book library."""
    for current, directories, filenames in os.walk(directory, followlinks=False):
        directories[:] = sorted(
            name for name in directories
            if permitted((Path(current) / name).relative_to(ROOT))
            and not (Path(current) / name).is_symlink()
        )
        for name in sorted(filenames):
            path = Path(current) / name
            if permitted(path.relative_to(ROOT)) and path.is_file() and not path.is_symlink():
                yield path


def release_label() -> str:
    version = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))["version"]
    match = re.fullmatch(r"(\d+)\.(\d+)\.(\d+)([-+][A-Za-z0-9.+-]+)?", version)
    if not match:
        raise ValueError(f"Invalid package.json version: {version!r}")
    # Omit a zero patch in the player-facing release name.
    return ".".join(match.groups()[:2]) if match[3] == "0" and not match[4] else version


def collect_files(*, include_image_sources: bool = True) -> list[Path]:
    selected = {
        path for path in ROOT.iterdir()
        if path.is_file() and not path.is_symlink()
        and (path.suffix.lower() in {".html", ".css", ".command"}
             or path.name in {"package.json", "package-lock.json", "README.md", "AGENTS.md"})
        and permitted(path.relative_to(ROOT))
    }
    runtime = {path for path in selected if path.suffix.lower() in {".html", ".css"}}
    javascript = {path for path in files_in(ROOT / "js") if path.suffix == ".js"}
    runtime.update(javascript)
    selected.update(javascript)
    for folder in ("docs", "tests", "scripts", "design"):
        selected.update(files_in(ROOT / folder))

    all_assets = list(files_in(ROOT / "assets"))
    by_name: dict[str, list[Path]] = {}
    for asset in all_assets:
        by_name.setdefault(asset.name, []).append(asset)
    for source in sorted(runtime):
        content = source.read_text(encoding="utf-8")
        for reference in LOCAL_ASSET.findall(content):
            relative = PurePosixPath(reference)
            if relative.parts[:2] != ("assets", "runtime"):
                raise ValueError(f"Runtime must reference assets/runtime: {reference} ({source.name})")
            # Dynamic novel paths end at the directory; their file names are
            # declared separately in content.js and resolved by BARE_MEDIA below.
            if reference.endswith("/"):
                continue
            asset = ROOT / relative
            if not permitted(relative) or asset not in all_assets:
                raise ValueError(f"Missing or excluded runtime asset: {reference} ({source.name})")
            selected.add(asset)
        for filename in BARE_MEDIA.findall(content):
            candidates = by_name.get(filename, [])
            if len(candidates) != 1:
                raise ValueError(f"Runtime asset name must resolve once: {filename} ({source.name})")
            if candidates[0].relative_to(ROOT).parts[:2] != ("assets", "runtime"):
                raise ValueError(f"Runtime must reference assets/runtime: {filename} ({source.name})")
            selected.add(candidates[0])

    # The offline release remains a complete editable project. Pages requests
    # only runtime exports so original PNG/JPEG files are never preloaded there.
    if include_image_sources:
        selected.update(files_in(ROOT / "assets/source"))
        selected.add(ROOT / "assets/README.md")

    relative_names = {path.relative_to(ROOT).as_posix() for path in selected}
    missing = REQUIRED - relative_names
    if missing:
        raise ValueError("Required files missing: " + ", ".join(sorted(missing)))
    if not any(name.startswith("tests/") for name in relative_names):
        raise ValueError("No tests included")
    if not any(name.startswith("docs/") for name in relative_names):
        raise ValueError("No documentation included")
    return sorted(selected, key=lambda path: path.relative_to(ROOT).as_posix())


def member_name(path: Path) -> str:
    return f"{ARCHIVE_ROOT}/{path.relative_to(ROOT).as_posix()}"


def verify_archive(path: Path, files: list[Path]) -> None:
    expected = {member_name(source) for source in files}
    with zipfile.ZipFile(path) as archive:
        names = archive.namelist()
        if len(names) != len(expected) or set(names) != expected:
            raise ValueError("Archive contents differ from the reviewed file list")
        for name in names:
            relative = PurePosixPath(name)
            if relative.parts[0] != ARCHIVE_ROOT or not permitted(relative):
                raise ValueError(f"Forbidden archive entry: {name}")
        missing = {f"{ARCHIVE_ROOT}/{name}" for name in REQUIRED} - set(names)
        if missing:
            raise ValueError("Required archive entries missing: " + ", ".join(sorted(missing)))
        broken = archive.testzip()
        if broken is not None:
            raise ValueError(f"CRC validation failed: {broken}")
        launcher = archive.getinfo(f"{ARCHIVE_ROOT}/启动游戏.command")
        source_mode = stat.S_IMODE((ROOT / "启动游戏.command").stat().st_mode)
        archive_mode = stat.S_IMODE(launcher.external_attr >> 16)
        if launcher.create_system != 3 or archive_mode != source_mode or not archive_mode & 0o111:
            raise ValueError("The macOS launcher lost its Unix executable permissions")


def build_archive(destination: Path, files: list[Path]) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile(prefix=".行商旅记-", suffix=".tmp",
                                     dir=destination.parent, delete=False) as temporary:
        temporary_path = Path(temporary.name)
    try:
        with zipfile.ZipFile(temporary_path, "w", compression=zipfile.ZIP_DEFLATED,
                             compresslevel=9) as archive:
            for source in files:
                # A fixed ZIP timestamp and sorted paths make unchanged releases
                # reproducible. Unix modes, especially the launcher, are retained.
                info = zipfile.ZipInfo(member_name(source), date_time=(1980, 1, 1, 0, 0, 0))
                info.create_system = 3
                info.external_attr = (stat.S_IFREG | stat.S_IMODE(source.stat().st_mode)) << 16
                archive.writestr(info, source.read_bytes(), compress_type=zipfile.ZIP_DEFLATED,
                                 compresslevel=9)
        verify_archive(temporary_path, files)
        os.replace(temporary_path, destination)
    finally:
        temporary_path.unlink(missing_ok=True)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--list", action="store_true", help="List selected files without creating a ZIP")
    arguments = parser.parse_args()
    subprocess.run(["python3", str(ROOT / "scripts/build_balance.py"), "--check"], cwd=ROOT, check=True)
    files = collect_files()
    destination = ROOT / "releases" / f"行商旅记-v{release_label()}.zip"
    if arguments.list:
        for path in files:
            print(member_name(path))
        total_bytes = sum(path.stat().st_size for path in files)
        print(f"\n共 {len(files)} 个文件，未压缩 {total_bytes / 1024 / 1024:.2f} MiB")
        print(f"目标：{destination}（仅列清单，未创建压缩包）")
        return
    build_archive(destination, files)
    print(f"已生成：{destination}")
    print(f"{len(files)} 个文件；CRC、必需文件、书库排除和启动器执行权限验证通过。")


if __name__ == "__main__":
    main()
