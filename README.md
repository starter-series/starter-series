<div align="center">

# Starter Series

**AI writes your code. We ship it safely.**

Safe-by-default templates for shipping AI-assisted projects —<br>
plus a meta-CLI that scaffolds them AND audits what's already on disk.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**English** | [한국어](README.ko.md)

</div>

## Install

The entry point is [`create-starter`](https://github.com/starter-series/create-starter) — a CLI / MCP server / Claude Code plugin / `.mcpb` bundle / skill that scaffolds any starter below, and audits an existing repo's release-readiness, CD wiring, and security posture.

```bash
# Claude Code plugin (recommended)
/plugin marketplace add starter-series/create-starter
/plugin install create-starter@starter-series

# Or use any starter directly as a GitHub template
gh repo create my-app --template starter-series/docker-deploy-starter
```

## Starters

| Starter | Description | Stack |
|---------|-------------|-------|
| [docker-deploy-starter](https://github.com/starter-series/docker-deploy-starter) | Any language, one Dockerfile, SSH deploy to any VPS | Docker, GHCR, GitHub Actions |
| [mcp-server-starter](https://github.com/starter-series/mcp-server-starter) | TypeScript MCP server with OIDC npm publish | MCP, TypeScript, OIDC |
| [python-mcp-server-starter](https://github.com/starter-series/python-mcp-server-starter) | Python MCP server with OIDC PyPI publish | MCP, Python, OIDC |
| [npm-package-starter](https://github.com/starter-series/npm-package-starter) | OIDC trusted publishing, zero secrets, provenance | npm, OIDC, Provenance |
| [browser-extension-starter](https://github.com/starter-series/browser-extension-starter) | MV3 extension with CWS + AMO publishing | Manifest V3, Chrome, Firefox |
| [vscode-extension-starter](https://github.com/starter-series/vscode-extension-starter) | Dual publish to VS Marketplace + Open VSX | VS Code, Vanilla JS |
| [discord-bot-starter](https://github.com/starter-series/discord-bot-starter) | Discord.js v14 with auto-loaded slash commands | Discord.js, Docker, Railway |
| [telegram-bot-starter](https://github.com/starter-series/telegram-bot-starter) | grammY bot with polling + webhook dual mode | grammY, Docker, Railway |
| [electron-app-starter](https://github.com/starter-series/electron-app-starter) | Cross-platform desktop app with code signing + auto-update | Electron, macOS/Win/Linux |
| [react-native-starter](https://github.com/starter-series/react-native-starter) | Expo + EAS Build with App Store + Play Store CI/CD | Expo, iOS, Android |
| [cloudflare-pages-starter](https://github.com/starter-series/cloudflare-pages-starter) | Static site + Cloudflare Pages deploy, unlimited bandwidth | Cloudflare Pages, Wrangler, GitHub Actions |

## Currently implemented

- 11 starters above, all under [github.com/starter-series](https://github.com/starter-series), each with: pinned GitHub Actions, gitleaks (SHA256-pinned), CodeQL, license check, `--ignore-scripts` install, grouped Dependabot, weekly CI health check, stale automation
- `create-starter` v0.4.0+ with two modes:
  - **Scaffold** — generate a new project from any starter above
  - **Audit** — `audit_release` (ship-ready verdict from CHANGELOG + workflows + git log), `audit_cd` (verify the package actually reached npm / PyPI / Open VSX / etc.), `audit_security` (gitleaks pin, CodeQL, dep-audit, license-check, secret-scanning, push-protection)
- OIDC trusted publishing where the platform supports it (npm, PyPI) — no long-lived secrets
- Bilingual docs (English + 한국어) on every starter
- 5-step "graduation from vibe coding" guide for users coming from Lovable / Bolt / v0

## Planned

- `add_component` — lift a starter's CI/CD layer into an existing repo without re-scaffolding
- Additional audit primitives: `audit_docs` (README ↔ code drift), `audit_releases` (tag-vs-CHANGELOG-vs-published drift)
- Standalone `detect_starter` tool (currently only inside scaffold flow)

## Design intent

- **Repetition elimination, not pedagogy.** The promise is that you stop redoing CI/CD wiring on every new project. Starters are not learning material.
- **Project-structure problem, framework-agnostic.** CI/CD, security audits, and publishing are about repo shape and workflows — not about your web framework. So starters cover deploy targets (Docker, Cloudflare Pages, app stores) as first-class, not just framework variants.
- **Scaffolder + auditor.** Greenfield scaffolding is a small slice of real work; most AI-assisted development is maintaining an existing repo. `create-starter` adds audit mode to address the larger surface.
- **Lightweight.** Clone → done. No bundlers unless required, no opinionated frameworks layered on.
- **One organization.** Everything lives under `github.com/starter-series/*` for a stable, brand-separable home.

## Non-goals

- Next.js on Vercel templates (Vercel auto-deploys on push — no CI logs needed)
- Netlify / Render / Railway direct-deploy templates (same reason)
- Generic web-framework starters (Astro, SvelteKit, Remix scaffolds) — those are framework concerns, not deploy concerns
- A learning tool or tutorial series — see [graduation-from-vibe-coding](https://github.com/starter-series/create-starter/blob/main/docs/graduation-from-vibe-coding.md) if you want the conceptual pathway, but the starters themselves assume you can write your app

## License

MIT
