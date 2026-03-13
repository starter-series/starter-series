<div align="center">

# Starter Series

**AI writes your code. We ship it safely.**

Every starter ships with CI/CD, security audits, and deploy pipelines.<br>
Clone a repo. Write your app. Push to deploy.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**English** | [한국어](README.ko.md)

</div>

## Starters

| Starter | Description | Stack |
|---------|-------------|-------|
| [docker-deploy-starter](https://github.com/starter-series/docker-deploy-starter) | Any language, one Dockerfile, SSH deploy to any VPS | Docker, GHCR, GitHub Actions |
| [mcp-server-starter](https://github.com/starter-series/mcp-server-starter) | TypeScript MCP server with OIDC npm publish | MCP, TypeScript, OIDC |
| [npm-package-starter](https://github.com/starter-series/npm-package-starter) | OIDC trusted publishing, zero secrets, provenance | npm, OIDC, Provenance |
| [browser-extension-starter](https://github.com/starter-series/browser-extension-starter) | MV3 extension with CWS + AMO publishing | Manifest V3, Chrome, Firefox |
| [vscode-extension-starter](https://github.com/starter-series/vscode-extension-starter) | Dual publish to VS Marketplace + Open VSX | VS Code, Vanilla JS |
| [discord-bot-starter](https://github.com/starter-series/discord-bot-starter) | Discord.js v14 with auto-loaded slash commands | Discord.js, Docker, Railway |
| [telegram-bot-starter](https://github.com/starter-series/telegram-bot-starter) | grammY bot with polling + webhook dual mode | grammY, Docker, Railway |
| [electron-app-starter](https://github.com/starter-series/electron-app-starter) | Cross-platform desktop app with code signing + auto-update | Electron, macOS/Win/Linux |
| [react-native-starter](https://github.com/starter-series/react-native-starter) | Expo + EAS Build with App Store + Play Store CI/CD | Expo, iOS, Android |

## What's Included

Every starter comes with:

- **CI/CD** — GitHub Actions pipelines for build, test, lint, and deploy
- **Security** — `npm audit`, secret scanning (gitleaks), license checking
- **Deploy** — Platform-specific publishing (npm, Docker, app stores, extension stores)
- **Dependabot** — Grouped dependency updates with lockfile conflict prevention

## Quick Start

```bash
# 1. Use as template (or clone)
gh repo create my-app --template starter-series/docker-deploy-starter

# 2. Write your app

# 3. Push — CI/CD handles the rest
git push origin main
```

## License

MIT
