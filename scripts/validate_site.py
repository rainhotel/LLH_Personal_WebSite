from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parents[1]
HTML_FILE = ROOT / "index.html"
JS_FILE = ROOT / "script.js"
VOID_TAGS = {
    "area", "base", "br", "col", "embed", "hr", "img", "input", "link",
    "meta", "param", "source", "track", "wbr",
}


class SiteValidator(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.stack: list[str] = []
        self.ids: set[str] = set()
        self.fragments: list[str] = []
        self.errors: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = dict(attrs)
        element_id = values.get("id")
        if element_id:
            if element_id in self.ids:
                self.errors.append(f"duplicate id: {element_id}")
            self.ids.add(element_id)

        href = values.get("href")
        if href and href.startswith("#") and href != "#":
            self.fragments.append(href[1:])

        for attribute in ("src", "href"):
            value = values.get(attribute)
            if not value or value.startswith(("#", "https://", "http://", "mailto:", "tel:", "data:")):
                continue
            local_path = value.split("#", 1)[0].split("?", 1)[0]
            if local_path and not (ROOT / local_path).exists():
                self.errors.append(f"missing local asset: {value}")

        if tag not in VOID_TAGS:
            self.stack.append(tag)

    def handle_endtag(self, tag: str) -> None:
        if tag in VOID_TAGS:
            return
        if not self.stack:
            self.errors.append(f"unexpected closing tag: </{tag}>")
            return
        if self.stack[-1] != tag:
            self.errors.append(f"mismatched closing tag: </{tag}> while expecting </{self.stack[-1]}>")
            return
        self.stack.pop()


def main() -> int:
    parser = SiteValidator()
    html = HTML_FILE.read_text(encoding="utf-8")
    parser.feed(html)
    parser.close()

    for fragment in parser.fragments:
        if fragment not in parser.ids:
            parser.errors.append(f"broken in-page link: #{fragment}")

    source = JS_FILE.read_text(encoding="utf-8")
    declared_projects = set(re.findall(r"^    ([a-z][a-z0-9_-]*): \\{", source, re.MULTILINE))
    linked_projects = set(re.findall(r'data-open-project="([^"]+)"', html))
    for project in sorted(linked_projects - declared_projects):
        parser.errors.append(f"project dialog has no data entry: {project}")

    required_ids = {"top", "about", "work", "opensource", "engineering", "contact", "project-grid", "project-dialog"}
    for required_id in sorted(required_ids - parser.ids):
        parser.errors.append(f"required section or control missing: {required_id}")

    if parser.stack:
        parser.errors.append("unclosed HTML tags: " + ", ".join(parser.stack))

    if parser.errors:
        print("\n".join(f"ERROR: {error}" for error in parser.errors))
        return 1

    print(f"Validated {len(parser.ids)} unique IDs, {len(parser.fragments)} in-page links, and {len(linked_projects)} project dialogs.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
