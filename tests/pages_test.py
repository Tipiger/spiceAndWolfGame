"""Check that publishing includes playable assets and excludes private sources."""

import contextlib
import importlib.util
import io
from pathlib import Path
import re
import sys
import tempfile
import unittest
from unittest import mock


ROOT = Path(__file__).resolve().parents[1]
sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location("build_pages", ROOT / "scripts/build_pages.py")
pages = importlib.util.module_from_spec(spec)
spec.loader.exec_module(pages)


class PagesRelease(unittest.TestCase):
    def test_site_manifest_contains_entry_assets_and_source_documents_only(self):
        files = pages.collect_pages_files()
        names = {source.relative_to(ROOT).as_posix() for source in files}
        self.assertIn("index.html", names)
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        for reference in re.findall(r'(?:src|href)="([^"#]+)"', html):
            if "://" not in reference:
                self.assertIn(reference, names)
        for document in (ROOT / "docs").glob("*.md"):
            self.assertIn(document.relative_to(ROOT).as_posix(), names)
        self.assertIn("assets/events/festival.png", names)
        self.assertIn("assets/novel/v1-holo-travel-clothes.png", names)
        for name in names:
            path = Path(name)
            self.assertTrue(
                name == "index.html"
                or len(path.parts) == 1 and path.suffix == ".css"
                or path.parts[0] == "js" and path.suffix == ".js"
                or path.parts[0] == "assets"
                or len(path.parts) == 2 and path.parts[0] == "docs" and path.suffix == ".md",
                name,
            )
            self.assertNotIn("狼与香辛料原作", path.parts)
            self.assertNotIn(path.suffix.lower(), {".zip", ".xlsx"})
            self.assertFalse(any(part.startswith(".") for part in path.parts), name)

    def test_rebuild_removes_stale_output_and_preserves_source(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            source = root / "index.html"
            source.write_text("<title>旅记</title>", encoding="utf-8")
            output = root / "_site"
            output.mkdir()
            (output / "old.zip").write_bytes(b"stale")
            with mock.patch.object(pages, "ROOT", root), mock.patch.object(pages, "OUTPUT", output):
                pages.build_site([source])
            self.assertEqual({file.name for file in output.iterdir()}, {"index.html"})
            self.assertEqual((output / "index.html").read_bytes(), source.read_bytes())
            self.assertTrue(source.exists())

    def test_output_symlinks_are_rejected_without_touching_targets(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            outside = root / "keep"
            outside.mkdir()
            marker = outside / "source.txt"
            marker.write_text("keep", encoding="utf-8")
            output = root / "_site"
            with mock.patch.object(pages, "ROOT", root), mock.patch.object(pages, "OUTPUT", output):
                output.symlink_to(outside, target_is_directory=True)
                with self.assertRaisesRegex(ValueError, "symlink"):
                    pages.build_site([])
                output.unlink()
                output.mkdir()
                (output / "linked").symlink_to(outside, target_is_directory=True)
                with self.assertRaisesRegex(ValueError, "symlink"):
                    pages.build_site([])
                self.assertTrue((output / "linked").is_symlink())
            self.assertEqual(marker.read_text(encoding="utf-8"), "keep")

    def test_list_does_not_replace_existing_output(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            source = root / "index.html"
            source.write_text("entry", encoding="utf-8")
            output = root / "_site"
            output.mkdir()
            marker = output / "keep.txt"
            marker.write_text("keep", encoding="utf-8")
            with mock.patch.object(pages, "ROOT", root), mock.patch.object(pages, "OUTPUT", output), \
                    mock.patch.object(pages, "collect_pages_files", return_value=[source]), \
                    mock.patch.object(pages.subprocess, "run"), \
                    contextlib.redirect_stdout(io.StringIO()) as captured:
                pages.main(["--list"])
            self.assertIn("index.html", captured.getvalue())
            self.assertEqual({file.name for file in output.iterdir()}, {"keep.txt"})
            self.assertEqual(marker.read_text(encoding="utf-8"), "keep")


if __name__ == "__main__":
    unittest.main()
