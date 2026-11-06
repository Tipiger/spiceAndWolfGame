"""Check that publishing includes playable assets and excludes private sources."""

import contextlib
import hashlib
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
            self.assertEqual({file.name for file in output.iterdir()}, {"index.html", "image-manifest.js", "image-cache-sw.js"})
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

    def test_published_entry_versions_local_scripts_and_styles_without_changing_source(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            source = root / "index.html"
            html = (
                '<link rel="stylesheet" href="style.css">\n'
                "<script defer src='js/app.js'></script>\n"
                '<script src="https://example.com/remote.js"></script>\n'
                '<img src="assets/crest.svg">\n'
            )
            source.write_text(html, encoding="utf-8")
            script = root / "js/app.js"
            script.parent.mkdir()
            script.write_bytes(b"const release = 1;\n")
            stylesheet = root / "style.css"
            stylesheet.write_bytes(b"body { color: green; }\n")
            output = root / "_site"
            with mock.patch.object(pages, "ROOT", root), mock.patch.object(pages, "OUTPUT", output):
                pages.build_site([source, script, stylesheet])
            published = (output / "index.html").read_text(encoding="utf-8")
            for asset in (script, stylesheet):
                version = hashlib.sha256(asset.read_bytes()).hexdigest()[:12]
                self.assertIn(f"{asset.relative_to(root).as_posix()}?v={version}", published)
                self.assertEqual((output / asset.relative_to(root)).read_bytes(), asset.read_bytes())
            self.assertIn('src="https://example.com/remote.js"', published)
            self.assertIn('src="assets/crest.svg"', published)
            self.assertEqual(source.read_text(encoding="utf-8"), html)

    def test_entry_versions_change_only_when_referenced_content_changes(self):
        with tempfile.TemporaryDirectory() as temporary:
            root = Path(temporary)
            source = root / "index.html"
            html = '<link href="style.css"><script src="app.js"></script>'
            source.write_text(html, encoding="utf-8")
            script = root / "app.js"
            script.write_text("const release = 1;", encoding="utf-8")
            stylesheet = root / "style.css"
            stylesheet.write_text("body { color: green; }", encoding="utf-8")
            output = root / "_site"
            with mock.patch.object(pages, "ROOT", root), mock.patch.object(pages, "OUTPUT", output):
                pages.build_site([source, script, stylesheet])
                first = (output / "index.html").read_text(encoding="utf-8")
                pages.build_site([source, script, stylesheet])
                self.assertEqual((output / "index.html").read_text(encoding="utf-8"), first)
                script.write_text("const release = 2;", encoding="utf-8")
                pages.build_site([source, script, stylesheet])
            second = (output / "index.html").read_text(encoding="utf-8")
            first_versions = dict(re.findall(r'([\w./-]+)\?v=([a-f0-9]{12})', first))
            second_versions = dict(re.findall(r'([\w./-]+)\?v=([a-f0-9]{12})', second))
            self.assertNotEqual(first_versions["app.js"], second_versions["app.js"])
            self.assertEqual(first_versions["style.css"], second_versions["style.css"])
            self.assertEqual(source.read_text(encoding="utf-8"), html)

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
