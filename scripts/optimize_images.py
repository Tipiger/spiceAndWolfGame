#!/usr/bin/env python3
"""Export reviewed image sources to WebP; --check needs only Python's stdlib."""

import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile


ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "scripts/image-exports.json"


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def asset_path(name, area):
    path = ROOT / name
    path.resolve().relative_to(ROOT / "assets" / area)
    if path.is_symlink():
        raise ValueError(f"Not an export asset: {name}")
    return path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Check source and output hashes without encoding")
    args = parser.parse_args()
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    images = manifest["images"]
    for entry in images:
        source, output = asset_path(entry["source"], "source"), asset_path(entry["output"], "runtime")
        if source.suffix.lower() not in {".png", ".jpg", ".jpeg"} or output.suffix != ".webp" or output.stem != source.stem:
            raise ValueError(f"Invalid export pair: {entry}")
    if args.check:
        for entry in images:
            for field in ("source", "output"):
                path = asset_path(entry[field], "source" if field == "source" else "runtime")
                if not path.is_file() or digest(path) != entry[field + "Sha256"]:
                    raise ValueError(f"Image export is missing or stale: {entry[field]}; run npm run images")
        print(f"{len(images)} 张原始图片与 WebP 导出校验通过。")
        return
    encoder = shutil.which("cwebp")
    if not encoder:
        raise SystemExit("重新导出图片需要安装 libwebp 的 cwebp；游玩、校验和发布不需要安装。")
    manifest["encoder"] = "cwebp " + subprocess.check_output([encoder, "-version"], text=True).strip()
    with tempfile.TemporaryDirectory(prefix="sw-image-exports-") as temporary:
        staged = []
        for index, entry in enumerate(images):
            source, output = asset_path(entry["source"], "source"), asset_path(entry["output"], "runtime")
            encoded = Path(temporary) / f"{index}.webp"
            subprocess.run([encoder, "-quiet", *manifest["options"], str(source), "-o", str(encoded)], check=True)
            entry["sourceSha256"] = digest(source)
            entry["outputSha256"] = digest(encoded)
            staged.append((encoded, output))
        # Finish every encode before replacing the reviewed runtime exports.
        for encoded, output in staged:
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_bytes(encoded.read_bytes())
    with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=MANIFEST.parent,
                                     suffix=".tmp", delete=False) as temporary:
        json.dump(manifest, temporary, ensure_ascii=False, indent=2)
        temporary.write("\n")
    os.replace(temporary.name, MANIFEST)
    print(f"已导出 {len(images)} 张 WebP，原始图片保持不变。")


if __name__ == "__main__":
    main()
