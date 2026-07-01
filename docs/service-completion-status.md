# Service completion status

Timestamp: 2026-06-30 17:03 KST
Last updated: 2026-07-01 13:12 KST

This status file tracks evidence against
`docs/service-completion-definition.md`. It is not a completion claim yet.

## Baseline inventory

| Status | Repos |
|---|---|
| Included baseline | `starter-series`, `browser-extension-starter`, `cloudflare-pages-starter`, `discord-bot-starter`, `docker-deploy-starter`, `electron-app-starter`, `mcp-server-starter`, `npm-package-starter`, `python-mcp-server-starter`, `react-native-starter`, `telegram-bot-starter`, `vscode-extension-starter`, `ProfileKit`, `profilekit-mcp` |
| External dependency | `create-starter`, `shotkit` |
| Cleanup/classification only | `landing-page`, `dot-github`, `icon-maker`, `rulemeter` |

## Evidence captured

| Gate | Evidence | Result |
|---|---|---|
| Baseline `AGENTS.md` coverage | Local inventory check found `AGENTS.md` in `starter-series`, all 11 core starters, `ProfileKit`, and `profilekit-mcp`. | Pass for included baseline. |
| README claim narrowing | README now says starters ship build/test/lint plus platform-specific deploy or package workflows, and language-appropriate security audits. | Pass for the overclaim identified in the definition pass. |
| Static site first action | Replaced the first visible site command with direct GitHub template use and removed proof-report/plugin/MCPB commands from the baseline hero/install path. | Pass: the public site no longer depends on `create-starter` for the baseline first action. |
| OG/social preview first action | Updated `og-image.svg`, regenerated `og-image.png`, and searched public files for stale `proof-report` / scoped install commands. | Pass: social preview now shows the direct GitHub template path. |
| Browser extension starter first-user path | Ran `npm audit --audit-level=high`, `npm test`, `npm run lint`, `npm run lint:css`, and `npm run build:chrome` after dependency alignment and lockfile audit fix. | Pass: audit found 0 vulnerabilities; 80 tests passed; JS/CSS lint and Chrome zip build completed. |
| Cloudflare Pages starter local path | Ran `npm test`, `npm run build`, and `npm run deploy:preflight`. | Partial: 52 tests and build passed; deploy preflight correctly blocked placeholder project metadata. |
| Discord bot starter first-user path | Ran `npm run preflight` and `npm run lint` after dependency/workflow alignment. | Pass: smoke/build and 82 tests passed; lint completed. |
| Docker deploy starter first-user path | Ran `npm test` and `npm run compose:check`. | Pass: 17 tests passed; compose config smoke completed. |
| Electron app starter first-user path | Ran `npm run lint`, `npm test`, and `npm run build` after dependency alignment. | Pass: 84 tests passed; local Electron directory package built without publish. |
| ProfileKit first-user path | Ran `npm test` and `npm run check`. | Pass: 197 tests passed; syntax check completed. |
| profilekit-mcp first-user path | Ran `npm test` and `npm run build` after dependency alignment. | Pass: 16 tests passed; TypeScript build completed. |
| npm package starter first-user path | Ran `npm test`, `npm run build`, and `npm run pack:check` after dependency/workflow alignment. | Pass: 136 tests passed; package surface and tarball checks completed. |
| TypeScript MCP starter first-user path | Ran `npm test`, `npm run smoke:mcp`, and `npm run pack:check` after dependency alignment. | Pass: 45 tests passed; MCP smoke and package surface checks completed. |
| Python MCP starter first-user path | Temporary venv in `/tmp`; installed `.[dev]`; ran `python -m pytest`, `python -m ruff check .`, `python -m ruff format --check .`, `python -m mypy src/`, `python -m build`, and `python scripts/smoke_stdio.py`. | Pass: 44 tests passed; ruff, format check, mypy, build, and stdio smoke passed. |
| React Native starter first-user path | Ran `npm ci`, `npm run lint`, `npm test`, `npm run build`, `npm run check:expo`, and wrapped `npm run check:store-ready` as an expected placeholder guard after dependency alignment. | Partial: lint, 36 tests, web export, and Expo dependency check passed; store-readiness guard correctly blocked placeholder app identifiers. `npm audit --audit-level=high` passed, with moderate findings remaining. |
| Telegram bot starter first-user path | Added timer fallback helper, then ran focused timer/lifecycle tests plus `npm run preflight`, `npm run lint`, and `npm audit --audit-level=high`. | Pass: 94 tests passed, coverage thresholds passed, syntax check and lint completed. High audit passed, with low/moderate findings remaining. |
| VS Code extension starter first-user path | Ran `npm run lint`, `npm test`, and `npm run build` after dependency alignment. | Pass: 40 tests passed; VSIX package built. |
| Markdown/file hygiene | `git diff --check` across all touched repos. | Pass. |
| Cross-repo drift | Added baseline-aware `sync-versions.js`, aligned baseline dependencies/workflow Node versions, registered explicit runtime exceptions, then ran `node scripts/sync-versions.js`. | Pass: current completion baseline is in sync or intentionally diverged. |
| Independent org-audit path | Added `scripts/audit-baseline.js` and rewired `org-audit.yml` to clone the current completion baseline plus claim-only public surfaces for drift guards, without depending on `create-starter` or `shotkit`; ran `node scripts/audit-baseline.js`. | Pass: all included baseline repos passed; public profile and pre-release `icon-maker` claims stayed aligned. |
| First-click polish and public claim lock | Added a favicon, moved hero CTAs to starter selection/default template paths, added per-starter template commands inside the modal, added a goal-based starter picker, synchronized closed modal `aria-hidden`/`inert`, gated Plausible to production hostname, and aligned `dot-github`/`icon-maker` public wording with separate-proof/pre-release status. | Pass pending browser QA; claim guard passes locally through `node scripts/audit-baseline.js`. |
| Public surface split | Converted `landing-page` into a legacy redirect notice pointing to `starter-series/starter-series`; deleted its stale org-audit workflow and old public site assets/docs; ran `npm run lint`, `npm test`, `npm run build`, `npm run test:browser`, and `git diff --check`. | Pass: landing-page no longer advertises `create-starter` / `shotkit` flows and browser smoke passed on desktop/mobile Chromium. |
| Cleanup-only repo classification | `landing-page`, `dot-github`, `icon-maker`, and `rulemeter` remain outside the completion baseline. `landing-page` is now a redirect/archive candidate; the others are not included in health or completion claims. | Pass for current baseline scope. |
| Store/deploy placeholder guard fixtures | Ran `node --test tests/deploy-preflight.test.js` in `cloudflare-pages-starter` and `npx jest --runInBand tests/store-readiness.test.js --coverage=false` in `react-native-starter`. | Pass: both templates reject starter placeholder metadata and accept customized production metadata fixtures. |
| Agent-native claims | Updated `docs/agent-native.md` to remove unsupported adoption claims, split included baseline coverage from companion tools, and define thin client adapters as pointers back to `AGENTS.md`. Added Claude, GitHub Copilot/VS Code, and Cursor adapters across the included baseline. | Pass: `create-starter`, `shotkit`, and `icon-maker` are no longer presented as baseline completion evidence; baseline adapter drift is checked by `node scripts/audit-baseline.js`. |
| Static site production CSS | Removed the Tailwind CDN from `index.html`, moved the needed utility subset into `style.css`, and re-ran the picker smoke path on desktop and mobile. | Pass: browser console had 0 errors/warnings and mobile goal cards had no horizontal overflow. |
| External npm package identity | Updated `create-starter` package metadata/bin/docs to npm package `starter-series` and `shotkit` metadata/docs/manifest tool identity to `shotkit`. `org-audit` now clones those repos only for package-name drift guards. | Pass: package names are unscoped product nouns and scoped-name searches found no scoped create/shotkit npm package strings in those repos. |

## Current blockers

None for the current completion baseline. `create-starter` and `shotkit` remain
external release-proof items, with package-name drift now guarded.

## Known non-blocking risks

| Risk | Current decision |
|---|---|
| Moderate npm audit findings remain in some Node-heavy templates. | Current CI gates use `npm audit --audit-level=high`; high/critical findings block completion, moderate findings stay follow-up unless the security policy is raised. |
| `create-starter` and `shotkit` release proof is external. | They are excluded from baseline evidence and no longer drive the first action. Package naming is locally guarded; publish, deprecation, and release proof still belong to their own sessions. |

## First-user path matrix

| Repo | Current proof |
|---|---|
| `starter-series` | `git diff --check`, baseline `sync-versions.js`, locale JSON validation, independent baseline audit, and browser picker smoke passed. |
| `browser-extension-starter` | Passed local test, JS/CSS lint, and Chrome zip build. Store capture remains tied to external `shotkit` proof. |
| `cloudflare-pages-starter` | Tests and build passed; deploy preflight blocked default placeholder metadata as designed. |
| `discord-bot-starter` | Passed local preflight and lint. |
| `docker-deploy-starter` | Passed local tests and compose config smoke. |
| `electron-app-starter` | Passed local lint, tests, and unsigned directory build. |
| `mcp-server-starter` | Passed local test, MCP smoke, and pack check. |
| `npm-package-starter` | Passed local test, build/package surface check, and pack check. |
| `python-mcp-server-starter` | Passed local first-user path in temporary Python 3.12 venv. |
| `react-native-starter` | Lint, tests, web export, and Expo dependency check passed after fresh `npm ci`; store readiness blocked placeholder identifiers as designed. |
| `telegram-bot-starter` | Passed local preflight, lint, and high-severity audit after timer fallback fix. |
| `vscode-extension-starter` | Passed local lint, tests, and VSIX package build. |
| `ProfileKit` | Passed local test and syntax check. |
| `profilekit-mcp` | Passed local test and TypeScript build. |
