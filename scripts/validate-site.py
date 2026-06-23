#!/usr/bin/env python3
"""Validate that this legacy repo remains a redirect notice."""

from __future__ import annotations

import argparse
import sys
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
CANONICAL_URL = "https://starter-series.github.io/starter-series/"
FORBIDDEN_STRINGS = (
    "npx starter-series proof-report",
    "/plugin install create-starter",
    "/plugin marketplace add starter-series/create-starter",
    "@starter-series",
    "shotkit",
)
DEPLOY_FILES = {
    "index.html",
    "robots.txt",
}
LEGACY_SITE_FILES = {
    "app.js",
    "i18n.js",
    "style.css",
    "locales/en.json",
    "locales/ko.json",
    "og-image.svg",
    "og-image.png",
}


class RedirectParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.canonical: str | None = None
        self.robots: str | None = None
        self.links: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr = {k: v for k, v in attrs if v is not None}
        if tag == "link" and attr.get("rel") == "canonical":
            self.canonical = attr.get("href")
        if tag == "meta" and attr.get("name") == "robots":
            self.robots = attr.get("content")
        if tag == "a" and attr.get("href"):
            self.links.add(attr["href"])


def assert_redirect_notice(check_deploy_surface: bool) -> None:
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    parser = RedirectParser()
    parser.feed(html)

    if parser.canonical != CANONICAL_URL:
        raise AssertionError("canonical link must point to starter-series/starter-series")
    if parser.robots != "noindex,follow":
        raise AssertionError("legacy page must be noindex,follow")
    if CANONICAL_URL not in parser.links:
        raise AssertionError("legacy page must link to the canonical site")

    lowered = html.lower()
    for forbidden in FORBIDDEN_STRINGS:
        if forbidden.lower() in lowered:
            raise AssertionError(f"legacy page must not advertise {forbidden}")

    if check_deploy_surface:
        existing = {str(p.relative_to(ROOT)) for p in ROOT.rglob("*") if p.is_file()}
        missing = sorted(DEPLOY_FILES - existing)
        if missing:
            raise AssertionError(f"deploy surface missing: {', '.join(missing)}")
        legacy = sorted(existing & LEGACY_SITE_FILES)
        if legacy:
            raise AssertionError(f"legacy landing-page assets still present: {', '.join(legacy)}")


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check-deploy-surface", action="store_true")
    args = ap.parse_args()
    try:
        assert_redirect_notice(args.check_deploy_surface)
    except AssertionError as exc:
        print(f"site validation failed: {exc}", file=sys.stderr)
        return 1
    print("redirect validation ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
