#!/usr/bin/env python3
"""Zero-dependency structural validator for the VerityStory static site."""
from html.parser import HTMLParser
from pathlib import Path
import re
import sys
from urllib.parse import unquote

ROOT = Path(__file__).resolve().parent.parent

class PageInspector(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids, self.anchor_targets, self.files, self.images = set(), [], [], []
        self.duplicates = set()
        self.has_viewport = False
        self.has_description = False
        self.html_language = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if "id" in a:
            if a["id"] in self.ids:
                self.duplicates.add(a["id"])
            self.ids.add(a["id"])
        if tag == "html":
            self.html_language = bool(a.get("lang"))
        if tag == "meta" and a.get("name") == "viewport":
            self.has_viewport = True
        if tag == "meta" and a.get("name") == "description":
            self.has_description = True
        if tag == "a" and a.get("href", "").startswith("#"):
            self.anchor_targets.append(a["href"][1:])
        for key in ("href", "src"):
            path = a.get(key, "")
            if path.startswith("./") and not path.startswith("./#"):
                self.files.append(unquote(path.removeprefix("./").split("?", 1)[0]))
        if tag == "img":
            self.images.append(a.get("alt", None))

def validate():
    page = (ROOT / "index.html").read_text(encoding="utf-8")
    inspector = PageInspector()
    inspector.feed(page)
    errors = []
    if not inspector.html_language: errors.append("HTML language missing")
    if not inspector.has_viewport: errors.append("Mobile viewport missing")
    if not inspector.has_description: errors.append("Page description missing")
    for item in inspector.duplicates: errors.append(f"Duplicate element id: {item}")
    for item in inspector.anchor_targets:
        if item and item not in inspector.ids: errors.append(f"Broken local anchor: #{item}")
    for item in inspector.files:
        if not (ROOT / item).is_file(): errors.append(f"Missing local resource: {item}")
    for item in inspector.images:
        if item is None or not item.strip(): errors.append("Image without descriptive alt text")
    for required in ["story", "timeline", "episodes", "evidence", "dossier", "theories", "ai", "credits"]:
        if required not in inspector.ids: errors.append(f"Missing required section: {required}")
    if len(re.findall(r'class="chapter"', page)) < 7: errors.append("Seven dossier chapters expected")
    if len(re.findall(r'class="evidence-card"', page)) < 8: errors.append("Eight evidence files expected")
    if len(re.findall(r'class="theory-card"', page)) < 9: errors.append("Nine theory files expected")
    css = (ROOT / "styles.css").read_text(encoding="utf-8")
    if "@media(max-width:600px)" not in css: errors.append("Mobile breakpoint not found")
    if "prefers-reduced-motion" not in css: errors.append("Reduced-motion accessibility preference missing")
    js = (ROOT / "app.js").read_text(encoding="utf-8")
    for feature in ["selectTab", "installFilters", "openSearch", "setMenu"]:
        if feature not in js: errors.append(f"Interactive feature missing: {feature}")
    if errors:
        print("\n".join("FAIL: " + err for err in errors), file=sys.stderr)
        raise SystemExit(1)
    print(f"PASS: {len(inspector.ids)} unique IDs; {len(inspector.anchor_targets)} hash links; {len(inspector.files)} local resource references; mobile and interaction checks.")

if __name__ == "__main__":
    validate()
