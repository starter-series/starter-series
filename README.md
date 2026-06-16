<div align="center">

# Starter Series

**AI writes your code. We ship it safely.**

Safe-by-default templates for shipping AI-assisted projects —<br>
plus a meta-CLI that not only scaffolds them but also audits what's already on disk.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

🌐 **[Full site](https://starter-series.github.io/starter-series/)** — landing page in English · 한국어

</div>

## Install

The entry point is [`create-starter`](https://github.com/starter-series/create-starter) — an npx CLI, a Claude Code plugin (with a bundled skill), an MCP server, and a `.mcpb` bundle for Claude Desktop. It scaffolds any starter below and audits an existing repo's release-readiness, CD wiring, and security posture.

Three install channels — pick one:

**npx CLI**

```bash
npx @starter-series/create my-bot --template discord-bot
```

**Claude Code plugin** (recommended; the skill auto-loads with the plugin)

```text
/plugin marketplace add starter-series/create-starter
/plugin install create-starter@starter-series
```

**Claude Desktop (`.mcpb` bundle)** — [download the latest `.mcpb` from GitHub Releases](https://github.com/starter-series/create-starter/releases/latest) and drag it into Claude Desktop.

## Quick start

If you just want to clone a starter as a GitHub template, you don't need create-starter at all:

```bash
# 1. Use as a GitHub template
gh repo create my-app --template starter-series/docker-deploy-starter

# 2. Write your app

# 3. Push — CI/CD handles the rest
git push origin main
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

## Tooling

Reusable capabilities, shipped as installable packages — not clone-templates:

| Tool | What it does | Surfaces |
|------|--------------|----------|
| [create-starter](https://github.com/starter-series/create-starter) | Scaffold any starter; audit an existing repo's release / CD / security posture | npx CLI · MCP server · Claude Code plugin + skill · `.mcpb` |
| [shotkit](https://github.com/starter-series/shotkit) | Capture Chrome Web Store + social promo assets (screenshots, promo tiles, demo screencast, listing copy) from a built browser extension | npx CLI (`--json` agent contract) · Claude Code skill · capture-in-CI workflow |

## Launch & Presence

Profile and promotion tools for the launch side of the ecosystem.

| Tool | What it does | Surfaces |
|------|--------------|----------|
| [ProfileKit](https://github.com/starter-series/ProfileKit) | Build composable SVG cards for GitHub profiles, READMEs, dev blogs, and personal sites | Vercel API · Docker self-host |
| [profilekit-mcp](https://github.com/starter-series/profilekit-mcp) | Render ProfileKit cards from Claude Code, Codex, ChatGPT Apps, or any MCP-capable agent | npm package · MCP stdio |

## Health — receipts, not claims

[![Org audit](https://github.com/starter-series/starter-series/actions/workflows/org-audit.yml/badge.svg)](https://github.com/starter-series/starter-series/actions/workflows/org-audit.yml)
— every Monday, [`org-audit.yml`](.github/workflows/org-audit.yml) runs
`create-starter audit-security` against **every repo in the org** and publishes
the verdicts in the run summary. If any repo drops below the bar, the badge
goes red. We audit ourselves with our own tool, in public.

| Repo | CI |
|------|----|
| browser-extension-starter | [![CI](https://github.com/starter-series/browser-extension-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/starter-series/browser-extension-starter/actions/workflows/ci.yml) |
| cloudflare-pages-starter | [![CI](https://github.com/starter-series/cloudflare-pages-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/starter-series/cloudflare-pages-starter/actions/workflows/ci.yml) |
| discord-bot-starter | [![CI](https://github.com/starter-series/discord-bot-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/starter-series/discord-bot-starter/actions/workflows/ci.yml) |
| docker-deploy-starter | [![CI](https://github.com/starter-series/docker-deploy-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/starter-series/docker-deploy-starter/actions/workflows/ci.yml) |
| electron-app-starter | [![CI](https://github.com/starter-series/electron-app-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/starter-series/electron-app-starter/actions/workflows/ci.yml) |
| mcp-server-starter | [![CI](https://github.com/starter-series/mcp-server-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/starter-series/mcp-server-starter/actions/workflows/ci.yml) |
| npm-package-starter | [![CI](https://github.com/starter-series/npm-package-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/starter-series/npm-package-starter/actions/workflows/ci.yml) |
| python-mcp-server-starter | [![CI](https://github.com/starter-series/python-mcp-server-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/starter-series/python-mcp-server-starter/actions/workflows/ci.yml) |
| react-native-starter | [![CI](https://github.com/starter-series/react-native-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/starter-series/react-native-starter/actions/workflows/ci.yml) |
| telegram-bot-starter | [![CI](https://github.com/starter-series/telegram-bot-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/starter-series/telegram-bot-starter/actions/workflows/ci.yml) |
| vscode-extension-starter | [![CI](https://github.com/starter-series/vscode-extension-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/starter-series/vscode-extension-starter/actions/workflows/ci.yml) |
| create-starter | [![CI](https://github.com/starter-series/create-starter/actions/workflows/ci.yml/badge.svg)](https://github.com/starter-series/create-starter/actions/workflows/ci.yml) |
| shotkit | [![CI](https://github.com/starter-series/shotkit/actions/workflows/ci.yml/badge.svg)](https://github.com/starter-series/shotkit/actions/workflows/ci.yml) |
| ProfileKit | [![CI](https://github.com/starter-series/ProfileKit/actions/workflows/ci.yml/badge.svg)](https://github.com/starter-series/ProfileKit/actions/workflows/ci.yml) |
| profilekit-mcp | [![CI](https://github.com/starter-series/profilekit-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/starter-series/profilekit-mcp/actions/workflows/ci.yml) |

## Currently implemented

- 11 starters above, all under [github.com/starter-series](https://github.com/starter-series). Every starter ships with:
  - **CI/CD pipelines** — GitHub Actions for build, test, lint, and deploy on every PR and push
  - **Security in CI** — `npm audit`, gitleaks (SHA256-pinned), CodeQL, license check, `--ignore-scripts` install
  - **Publish pipelines** — platform-specific publishing to npm, PyPI, Docker / GHCR, VS Marketplace, Open VSX, AMO, Chrome Web Store, App Store, Play Store, GitHub Releases
  - **Weekly CI health check** with **auto-issue on failure** (you get a GitHub issue when scheduled CI breaks)
  - **Stale automation** — inactive issues/PRs are auto-labeled and auto-closed
  - **Grouped Dependabot** — prevents the lockfile-conflict cascade that ungrouped Dependabot produces
- `create-starter` v0.4.0+ with three modes:
  - **Scaffold** — generate a new project from any starter above
  - **Audit** — `audit_release` (ship-ready verdict from CHANGELOG + workflows + git log), `audit_cd` (verify the package actually reached npm / PyPI / Open VSX / VS Marketplace / AMO / GitHub Releases), `audit_security` (gitleaks pin, CodeQL, dep-audit, license, `--ignore-scripts`, Dependabot, secret-scanning, claude-code-security-review, claude-security-guidance)
  - **Add** — `add_component` lifts a starter's CI/CD layer (ci / security / dependabot / maintenance) into an *existing* repo: dry-run plan first, never touches app code or secrets-bearing CD — the remediation half of the audit loop, and its dry-run doubles as a drift report against the starter
- ProfileKit + profilekit-mcp extend the series from project launch into profile branding and agent-driven README composition.
- OIDC trusted publishing where the platform supports it (npm, PyPI) — no long-lived secrets
- Bilingual docs (English + 한국어) on every starter
- 5-step "graduation from vibe coding" guide for users coming from Lovable / Bolt / v0

## Planned

- Additional audit primitives: `audit_docs` (README ↔ code drift), `audit_releases` (tag-vs-CHANGELOG-vs-published drift)
- Standalone `detect_starter` tool (currently only inside scaffold flow)
- `update_component` — refresh previously-lifted components when the starter improves (today: `add_component`'s dry-run plan already reports the drift; `--force` applies the starter's version)

## Design intent

- **Repetition elimination, not pedagogy.** The promise is that you stop redoing CI/CD wiring on every new project. Starters are not learning material.
- **Project-structure problem, framework-agnostic.** CI/CD, security audits, and publishing are about repo shape and workflows — not about your web framework. So starters cover deploy targets (Docker, Cloudflare Pages, app stores) as first-class, not just framework variants.
- **Scaffolder + auditor.** Greenfield scaffolding is a small slice of real work; most AI-assisted development is maintaining an existing repo. `create-starter` adds audit mode to address the larger surface.
- **Lightweight.** Clone → done. No bundlers unless required, no opinionated frameworks layered on.
- **One organization.** Everything lives under `github.com/starter-series/*` for a stable, brand-separable home.
- **Agent-native.** Coding agents are first-class users: every repo ships `AGENTS.md`, every tool ships machine output (`--json`, stable exit codes) + a Claude Code skill, and MCP is used only where the tool's nature fits. The standard: [docs/agent-native.md](docs/agent-native.md).

## Non-goals

- Next.js on Vercel templates (Vercel owns the build pipeline — no GitHub Actions logs to manage).
- Netlify / Render / Railway direct-deploy templates (same reason — the platform owns the pipeline).
- Generic web-framework starters (Astro, SvelteKit, Remix scaffolds) — those are framework concerns, not deploy concerns.
- A learning tool or tutorial series — see [graduation-from-vibe-coding](https://github.com/starter-series/create-starter/blob/main/docs/graduation-from-vibe-coding.md) if you want the conceptual pathway, but the starters themselves assume you can write your app.

## License

MIT
