#!/usr/bin/env python3
"""Collect the static GitHub Pages site in _site; --list makes no changes."""

from __future__ import annotations

import argparse
import hashlib
import importlib.util
from pathlib import Path
import re
import shutil
import subprocess
import sys


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "_site"
sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location("offline_package", ROOT / "scripts/package.py")
offline_package = importlib.util.module_from_spec(spec)
spec.loader.exec_module(offline_package)
ENTRY_RESOURCE = re.compile(
    r'''(?P<prefix>\b(?:src|href)\s*=\s*)(?P<quote>["'])(?P<path>[^"']+\.(?:js|css))(?P=quote)''',
    re.IGNORECASE,
)


def collect_pages_files() -> list[Path]:
    """Use the offline release's reviewed asset selection, without dev files."""
    selected = []
    for source in offline_package.collect_files():
        relative = source.relative_to(ROOT)
        parts = relative.parts
        if (
            relative.as_posix() == "index.html"
            or len(parts) == 1 and source.suffix == ".css"
            or parts[0] == "js" and source.suffix == ".js"
            or parts[0] == "assets"
            or len(parts) == 2 and parts[0] == "docs" and source.suffix == ".md"
        ):
            if any((ROOT / Path(*parts[:index])).is_symlink()
                   for index in range(1, len(parts) + 1)):
                raise ValueError(f"Refusing symlink in Pages source: {relative}")
            selected.append(source)
    return sorted(selected, key=lambda path: path.relative_to(ROOT).as_posix())


def build_site(files: list[Path]) -> None:
    """Replace only _site, rejecting links before removing an existing build."""
    if OUTPUT.is_symlink():
        raise ValueError("Refusing symlink at _site")
    if OUTPUT.exists():
        if not OUTPUT.is_dir():
            raise ValueError("_site exists and is not a directory")
        for existing in OUTPUT.rglob("*"):
            if existing.is_symlink():
                raise ValueError(f"Refusing symlink in _site: {existing.relative_to(OUTPUT)}")
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir()
    for source in files:
        target = OUTPUT / source.relative_to(ROOT)
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)
    entry = OUTPUT / "index.html"
    if entry.is_file():
        versions = {
            source.relative_to(ROOT).as_posix(): hashlib.sha256(
                (OUTPUT / source.relative_to(ROOT)).read_bytes()
            ).hexdigest()[:12]
            for source in files if source.suffix.lower() in {".js", ".css"}
        }

        def version_reference(match):
            reference = match.group("path")
            version = versions.get(reference)
            if version is None:
                return match.group(0)
            quote = match.group("quote")
            return f'{match.group("prefix")}{quote}{reference}?v={version}{quote}'

        # Only the published entry changes; file:// and offline source keep
        # their original paths. Content hashes invalidate stale CDN/browser JS.
        entry.write_text(ENTRY_RESOURCE.sub(version_reference, entry.read_text(encoding="utf-8")),
                         encoding="utf-8")


def main(argv=None) -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--list", action="store_true", help="Review the site without writing _site")
    arguments = parser.parse_args(argv)
    subprocess.run([sys.executable, str(ROOT / "scripts/build_balance.py"), "--check"],
                   cwd=ROOT, check=True)
    files = collect_pages_files()
    if arguments.list:
        for source in files:
            print(source.relative_to(ROOT).as_posix())
        print(f"\n共 {len(files)} 个文件，"
              f"未压缩 {sum(source.stat().st_size for source in files) / 1024 / 1024:.2f} MiB")
        print(f"目标：{OUTPUT}（仅列清单，未写入）")
        return
    build_site(files)
    print(f"已生成：{OUTPUT}（{len(files)} 个静态文件）")


if __name__ == "__main__":
    main()
