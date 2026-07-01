#!/usr/bin/env python3
"""Validate the static landing page without adding runtime dependencies."""

from __future__ import annotations

import argparse
import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]

EXPECTED_SITE_REPOS = {
    "docker-deploy-starter",
    "browser-extension-starter",
    "discord-bot-starter",
    "telegram-bot-starter",
    "electron-app-starter",
    "npm-package-starter",
    "mcp-server-starter",
    "react-native-starter",
    "python-mcp-server-starter",
    "cloudflare-pages-starter",
    "vscode-extension-starter",
}

HEALTH_AUDIT_REPOS = {
    "starter-series",
    "browser-extension-starter",
    "cloudflare-pages-starter",
    "discord-bot-starter",
    "docker-deploy-starter",
    "electron-app-starter",
    "mcp-server-starter",
    "npm-package-starter",
    "python-mcp-server-starter",
    "react-native-starter",
    "telegram-bot-starter",
    "vscode-extension-starter",
    "ProfileKit",
    "profilekit-mcp",
}

DEPLOY_FILES = {
    "index.html",
    "style.css",
    "app.js",
    "i18n.js",
    "locales/en.json",
    "locales/ko.json",
    "favicon.svg",
    "og-image.png",
    "og-image.svg",
    "robots.txt",
    "sitemap.xml",
}


class SiteParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.i18n_keys: set[str] = set()
        self.detail_keys: set[str] = set()
        self.repo_slugs: set[str] = set()
        self.picker_templates: set[str] = set()
        self.filters: set[str] = set()
        self.categories: set[str] = set()
        self.github_urls: set[str] = set()

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr = {k: v for k, v in attrs if v is not None}
        if "data-i18n" in attr:
            self.i18n_keys.add(attr["data-i18n"])
        if "data-detail" in attr:
            self.detail_keys.add(attr["data-detail"])
        if "data-filter" in attr:
            self.filters.add(attr["data-filter"])
        if "data-category" in attr:
            self.categories.add(attr["data-category"])
        if "data-picker-template" in attr:
            self.picker_templates.add(attr["data-picker-template"])
        for key in ("href", "data-repo", "content"):
            value = attr.get(key, "")
            if value.startswith("https://github.com/starter-series/"):
                self.github_urls.add(value)
                slug = value.removeprefix("https://github.com/starter-series/").split("/")[0]
                if slug:
                    self.repo_slugs.add(slug)


def load_json(path: Path) -> dict[str, str]:
    try:
        with path.open(encoding="utf-8") as fh:
            data = json.load(fh)
    except json.JSONDecodeError as exc:
        raise AssertionError(f"{path.relative_to(ROOT)} is invalid JSON: {exc}") from exc
    if not isinstance(data, dict):
        raise AssertionError(f"{path.relative_to(ROOT)} must contain a JSON object")
    return data


def parse_site() -> SiteParser:
    parser = SiteParser()
    parser.feed((ROOT / "index.html").read_text(encoding="utf-8"))
    return parser


def workflow_repos() -> set[str]:
    workflow = (ROOT / ".github/workflows/org-audit.yml").read_text(encoding="utf-8")
    match = re.search(r'REPOS="([^"]+)"', workflow)
    if not match:
        raise AssertionError("org-audit.yml must define a quoted REPOS list")
    return set(match.group(1).split())


def readme_health_repos() -> set[str]:
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    repos: set[str] = set()
    in_table = False
    for line in readme.splitlines():
        if line.strip() == "| Repo | CI |":
            in_table = True
            continue
        if not in_table:
            continue
        if not line.startswith("|"):
            break
        match = re.search(
            r"https://github\.com/starter-series/([^/]+)/actions/workflows/ci\.yml",
            line,
        )
        if match:
            repos.add(match.group(1))
    return repos


def assert_equal(name: str, actual: set[str], expected: set[str]) -> None:
    missing = sorted(expected - actual)
    extra = sorted(actual - expected)
    if missing or extra:
        detail = []
        if missing:
            detail.append(f"missing: {', '.join(missing)}")
        if extra:
            detail.append(f"extra: {', '.join(extra)}")
        raise AssertionError(f"{name} mismatch ({'; '.join(detail)})")


def validate_site(check_deploy_surface: bool) -> None:
    parser = parse_site()
    locales = {
        "en": load_json(ROOT / "locales/en.json"),
        "ko": load_json(ROOT / "locales/ko.json"),
    }

    locale_key_sets = {lang: set(data) for lang, data in locales.items()}
    assert_equal("ko locale keys", locale_key_sets["ko"], locale_key_sets["en"])

    required_locale_keys = parser.i18n_keys | parser.detail_keys | {"install_copied"}
    for lang, keys in locale_key_sets.items():
        assert_equal(f"{lang} locale coverage", keys & required_locale_keys, required_locale_keys)

    assert_equal("site repo cards", parser.repo_slugs & EXPECTED_SITE_REPOS, EXPECTED_SITE_REPOS)
    assert_equal("org audit repo list", workflow_repos(), HEALTH_AUDIT_REPOS)
    assert_equal("README health table", readme_health_repos(), HEALTH_AUDIT_REPOS)
    assert_equal("goal picker templates", parser.picker_templates - parser.repo_slugs, set())

    usable_filters = parser.filters - {"all"}
    assert_equal("category filters", usable_filters, parser.categories)

    if "every repo in the org" in (ROOT / "README.md").read_text(encoding="utf-8").lower():
        raise AssertionError("README must not claim org-audit covers every repo in the org")

    if "cdn.tailwindcss.com" in (ROOT / "index.html").read_text(encoding="utf-8"):
        raise AssertionError("index.html must use the committed CSS bundle, not Tailwind CDN")

    if check_deploy_surface:
        existing = {str(p.relative_to(ROOT)) for p in ROOT.rglob("*") if p.is_file()}
        assert_equal("deploy surface files", existing & DEPLOY_FILES, DEPLOY_FILES)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--check-deploy-surface", action="store_true")
    args = ap.parse_args()
    try:
        validate_site(args.check_deploy_surface)
    except AssertionError as exc:
        print(f"site validation failed: {exc}", file=sys.stderr)
        return 1
    print("site validation ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
