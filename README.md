<div align="center">

# Starter Series

**AI writes your code. We ship it safely.**

Safe-by-default templates for shipping AI-assisted projects.<br>
Start with the deploy target, then keep the first shipping path covered.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

🌐 **[Full site](https://starter-series.github.io/starter-series/)** — landing page in English · 한국어

</div>

## Choose by shipping target

Start from what you are trying to ship, not from a framework list.

| I want to ship... | Use this starter | First path it protects |
|---|---|---|
| A backend, API, worker, or service on a VPS | [docker-deploy-starter](https://github.com/starter-series/docker-deploy-starter) | Docker build, compose check, GHCR deploy, health check, rollback |
| A static website on a global CDN | [cloudflare-pages-starter](https://github.com/starter-series/cloudflare-pages-starter) | Build, Pages deploy preflight, placeholder metadata guard |
| An npm package | [npm-package-starter](https://github.com/starter-series/npm-package-starter) | Test, build, package surface check, OIDC publish path |
| An MCP tool server | [mcp-server-starter](https://github.com/starter-series/mcp-server-starter) or [python-mcp-server-starter](https://github.com/starter-series/python-mcp-server-starter) | MCP smoke, schema validation, package preflight |
| A browser extension | [browser-extension-starter](https://github.com/starter-series/browser-extension-starter) | MV3 validation, permission audit, store build |
| A mobile app | [react-native-starter](https://github.com/starter-series/react-native-starter) | Expo/EAS checks and store-readiness guards |
| A desktop app | [electron-app-starter](https://github.com/starter-series/electron-app-starter) | Lint, tests, package build, signing/update scaffold |
| A chat bot | [discord-bot-starter](https://github.com/starter-series/discord-bot-starter) or [telegram-bot-starter](https://github.com/starter-series/telegram-bot-starter) | Command smoke, lifecycle tests, deploy preflight |
| A VS Code extension | [vscode-extension-starter](https://github.com/starter-series/vscode-extension-starter) | Lint, tests, VSIX build, marketplace publish path |

Every included starter ships a root `AGENTS.md`, so a coding agent can open the
cloned repo and immediately see what to run, what to change, and what not to
break.

## Quick start

Use the closest starter as a GitHub template. No CLI is required for the baseline
path. If the app shape is still undecided, start with Docker deploy:

```bash
# 1. Use as a GitHub template
gh repo create my-app --template starter-series/docker-deploy-starter

# 2. Write your app

# 3. Push — CI/CD handles the rest
git push origin main
```

Companion tooling exists for scaffolding, audits, and release assets, but those
tool packages are in separate proof sessions. The starters below remain directly
usable without any CLI package.

## Local site checks

This repo is the static landing page, so the validation stack has no runtime
dependencies. The npm scripts exist to make local checks match CI:

```bash
npm ci
npx playwright install chromium
npm run lint
npm test
npm run build
npm run test:browser
npm audit --audit-level=high
```

`npm run test:browser` starts its own local `127.0.0.1:4173` server and fails
instead of reusing an already-running process on that port. That keeps the
smoke test pointed at this checkout, not a stale tab from another repo.
On Linux hosts that do not already have browser system packages installed, use
`npx playwright install --with-deps chromium` instead of the shorter install
command above.

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

## Companion tooling

These repos are useful around the starters, but they are not completion evidence
for this cycle. Their package names and release proofs are tracked separately.

| Tool | Current role in this hub | Completion status |
|------|--------------------------|-------------------|
| [create-starter](https://github.com/starter-series/create-starter) | Companion scaffolding and audit tool | Separate proof session |
| [shotkit](https://github.com/starter-series/shotkit) | Companion release-asset tool for browser extensions | Separate proof session |

## Launch & Presence

Profile and promotion tools for the launch side of the ecosystem.

| Tool | What it does | Surfaces |
|------|--------------|----------|
| [ProfileKit](https://github.com/starter-series/ProfileKit) | Build composable SVG cards for GitHub profiles, READMEs, dev blogs, and personal sites | Vercel API · Docker self-host |
| [profilekit-mcp](https://github.com/starter-series/profilekit-mcp) | Render ProfileKit cards from Claude Code, Codex, ChatGPT Apps, or any MCP-capable agent | npm package · MCP stdio |
| Icon Maker (pre-release) | Generate deterministic app, extension, connector, and marketplace icon sets from one config | local CLI (`--json` agent contract) · Claude Code skill; public repo/npm pending |

## Health — receipts, not claims

[![Org audit](https://github.com/starter-series/starter-series/actions/workflows/org-audit.yml/badge.svg)](https://github.com/starter-series/starter-series/actions/workflows/org-audit.yml)
— every Monday, [`org-audit.yml`](.github/workflows/org-audit.yml) clones the
current completion baseline and runs an independent baseline receipt check:
README, `AGENTS.md`, security policy, Dependabot, CI, CodeQL where applicable,
unscoped npm names, and the hub's static-site first action. It also checks
claim-only public surfaces such as the org profile and pre-release Icon Maker
docs without counting them as baseline completion evidence. `create-starter` and
`shotkit` are tracked in separate proof sessions, so this badge is not allowed to
stand in for their release evidence.

Current-cycle completion is defined in
[docs/service-completion-definition.md](docs/service-completion-definition.md).
It is a closing bar for verified first-user paths, not a license to add new
product layers.

| Repo | CI |
|------|----|
| starter-series | [![CI](https://github.com/starter-series/starter-series/actions/workflows/ci.yml/badge.svg)](https://github.com/starter-series/starter-series/actions/workflows/ci.yml) |
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
| ProfileKit | [![CI](https://github.com/starter-series/ProfileKit/actions/workflows/ci.yml/badge.svg)](https://github.com/starter-series/ProfileKit/actions/workflows/ci.yml) |
| profilekit-mcp | [![CI](https://github.com/starter-series/profilekit-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/starter-series/profilekit-mcp/actions/workflows/ci.yml) |

## Currently implemented

- 11 starters above, all under [github.com/starter-series](https://github.com/starter-series). Every starter ships with:
  - **CI/CD pipelines** — GitHub Actions for build, test, lint, and platform-specific deploy or package workflows
  - **Security in CI** — language-appropriate dependency audit, gitleaks (SHA256-pinned), CodeQL, license check, and safe install defaults
  - **Publish pipelines** — platform-specific publishing to npm, PyPI, Docker / GHCR, VS Marketplace, Open VSX, AMO, Chrome Web Store, App Store, Play Store, GitHub Releases
  - **Weekly CI health check** with **auto-issue on failure** (you get a GitHub issue when scheduled CI breaks)
  - **Stale automation** — inactive issues/PRs are auto-labeled and auto-closed
  - **Grouped Dependabot** — prevents the lockfile-conflict cascade that ungrouped Dependabot produces
- `create-starter` and `shotkit` are useful companion tools, but their package
  names and release proofs are tracked outside this completion cycle.
- ProfileKit + profilekit-mcp extend the series from project launch into profile branding and agent-driven README composition.
- OIDC trusted publishing where the platform supports it (npm, PyPI) — no long-lived secrets
- Bilingual docs (English + 한국어) on every starter
- 5-step "graduation from vibe coding" guide for users coming from Lovable / Bolt / v0

## Planned

- Companion-tool follow-up lives in the separate `create-starter` and `shotkit`
  sessions, not in this completion baseline.

## Design intent

- **Repetition elimination, not pedagogy.** The promise is that you stop redoing CI/CD wiring on every new project. Starters are not learning material.
- **Project-structure problem, framework-agnostic.** CI/CD, security audits, and publishing are about repo shape and workflows — not about your web framework. So starters cover deploy targets (Docker, Cloudflare Pages, app stores) as first-class, not just framework variants.
- **Companion tools stay outside the baseline.** Greenfield scaffolding,
  existing-repo audits, and release-asset capture are useful, but they do not
  make a starter complete unless the starter's direct first-user path works.
- **Lightweight.** Clone → done. No bundlers unless required, no opinionated frameworks layered on.
- **One organization.** Everything lives under `github.com/starter-series/*` for a stable, brand-separable home.
- **Agent-native.** Coding agents are first-class users: baseline repos ship
  `AGENTS.md` as the source of truth, client-specific instruction files stay as
  thin pointers, tools that advertise agent use ship machine output (`--json`,
  stable exit codes) plus a skill where that surface exists, and MCP is used only
  where the tool's nature fits. The standard:
  [docs/agent-native.md](docs/agent-native.md).

## Non-goals

- Next.js on Vercel templates (Vercel owns the build pipeline — no GitHub Actions logs to manage).
- Netlify / Render / Railway direct-deploy templates (same reason — the platform owns the pipeline).
- Generic web-framework starters (Astro, SvelteKit, Remix scaffolds) — those are framework concerns, not deploy concerns.
- A learning tool or tutorial series — see [graduation-from-vibe-coding](https://github.com/starter-series/create-starter/blob/main/docs/graduation-from-vibe-coding.md) if you want the conceptual pathway, but the starters themselves assume you can write your app.

## License

MIT
