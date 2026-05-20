<div align="center">

# Starter Series

**AI는 코드를 만들어줍니다. 배포는 저희가 합니다.**

AI 보조 개발 프로젝트를 안전하게 출시하기 위한 기본값 템플릿 모음 —<br>
그리고 이 템플릿들을 스캐폴딩하고, 이미 만들어진 레포를 감사(audit)하는 메타 CLI.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[English](README.md) | **한국어**

</div>

## 설치

진입점은 [`create-starter`](https://github.com/starter-series/create-starter)입니다. CLI / MCP 서버 / Claude Code 플러그인 / `.mcpb` 번들 / skill 형태로 제공되며, 아래 스타터들을 스캐폴딩하고 기존 레포의 릴리스 준비도, CD 배선, 보안 상태를 감사합니다.

```bash
# Claude Code 플러그인 (권장)
/plugin marketplace add starter-series/create-starter
/plugin install create-starter@starter-series

# 또는 스타터를 GitHub 템플릿으로 바로 사용
gh repo create my-app --template starter-series/docker-deploy-starter
```

## 스타터 목록

| 스타터 | 설명 | 스택 |
|--------|------|------|
| [docker-deploy-starter](https://github.com/starter-series/docker-deploy-starter) | 언어 무관, Dockerfile 하나로 VPS SSH 배포 | Docker, GHCR, GitHub Actions |
| [mcp-server-starter](https://github.com/starter-series/mcp-server-starter) | TypeScript MCP 서버 + OIDC npm 배포 | MCP, TypeScript, OIDC |
| [python-mcp-server-starter](https://github.com/starter-series/python-mcp-server-starter) | Python MCP 서버 + OIDC PyPI 배포 | MCP, Python, OIDC |
| [npm-package-starter](https://github.com/starter-series/npm-package-starter) | OIDC trusted publishing, 시크릿 제로, provenance | npm, OIDC, Provenance |
| [browser-extension-starter](https://github.com/starter-series/browser-extension-starter) | MV3 확장 + CWS/AMO 자동 배포 | Manifest V3, Chrome, Firefox |
| [vscode-extension-starter](https://github.com/starter-series/vscode-extension-starter) | VS Marketplace + Open VSX 동시 배포 | VS Code, Vanilla JS |
| [discord-bot-starter](https://github.com/starter-series/discord-bot-starter) | Discord.js v14 + 슬래시 커맨드 자동 로딩 | Discord.js, Docker, Railway |
| [telegram-bot-starter](https://github.com/starter-series/telegram-bot-starter) | grammY 봇 + 폴링/웹훅 이중 모드 | grammY, Docker, Railway |
| [electron-app-starter](https://github.com/starter-series/electron-app-starter) | 크로스플랫폼 데스크톱 앱 + 코드사이닝 + 자동 업데이트 | Electron, macOS/Win/Linux |
| [react-native-starter](https://github.com/starter-series/react-native-starter) | Expo + EAS Build + App Store/Play Store CI/CD | Expo, iOS, Android |
| [cloudflare-pages-starter](https://github.com/starter-series/cloudflare-pages-starter) | 정적 사이트 + Cloudflare Pages 배포, 무제한 대역폭 | Cloudflare Pages, Wrangler, GitHub Actions |

## 현재 구현됨 (Currently implemented)

- 위 11개 스타터 — 모두 [github.com/starter-series](https://github.com/starter-series)에 호스팅. 공통: GitHub Actions pinning, gitleaks (SHA256 pin), CodeQL, license check, `--ignore-scripts` 설치, Dependabot grouped, 주간 CI 헬스체크, stale 자동화
- `create-starter` v0.4.0+ — 2가지 모드 제공:
  - **Scaffold (스캐폴딩)** — 위 스타터에서 신규 프로젝트 생성
  - **Audit (감사)** — `audit_release` (CHANGELOG, workflows, git log로 릴리스 준비도 판정), `audit_cd` (npm / PyPI / Open VSX 등 실제 배포 도달 여부 확인), `audit_security` (gitleaks pin, CodeQL, dep-audit, license-check, secret-scanning, push-protection)
- 플랫폼이 지원하는 경우 OIDC trusted publishing 사용 (npm, PyPI) — 장기 시크릿 없음
- 모든 스타터에 English + 한국어 양언어 문서 제공
- Lovable / Bolt / v0 사용자를 위한 "vibe coding 졸업" 5단계 가이드

## 계획됨 (Planned)

- `add_component` — 스캐폴딩 없이 기존 레포에 스타터의 CI/CD 레이어만 lift-in
- 추가 audit 도구: `audit_docs` (README ↔ 코드 drift), `audit_releases` (tag ↔ CHANGELOG ↔ 배포 drift)
- 독립 실행형 `detect_starter` (현재는 scaffold 흐름 안에서만 동작)

## 설계 의도 (Design intent)

- **반복 제거가 목적, 학습 도구 아님.** 매 신규 프로젝트마다 CI/CD를 다시 배선하지 않게 하는 것이 약속입니다. 스타터는 학습 자료가 아닙니다.
- **프로젝트 구조 문제이지 프레임워크 문제가 아닙니다.** CI/CD, 보안 감사, 퍼블리싱은 레포 구조와 워크플로의 문제이지 웹 프레임워크의 문제가 아닙니다. 그래서 배포 타깃(Docker, Cloudflare Pages, 앱 스토어)을 1급 시민으로 다룹니다.
- **스캐폴더 + 감사기.** Greenfield 스캐폴딩은 실제 작업의 일부분일 뿐이며, AI 보조 개발의 대부분은 기존 레포 유지보수입니다. `create-starter`의 audit 모드가 이 더 큰 영역을 다룹니다.
- **가볍게.** Clone → 끝. 필요 없으면 번들러도, 의견 강한 프레임워크도 얹지 않습니다.
- **단일 조직.** 모든 것이 `github.com/starter-series/*` 아래에 있어 안정적이고 브랜드 분리가 가능합니다.

## 비목표 (Non-goals)

- Next.js on Vercel 템플릿 (Vercel은 push 시 자동 배포 — CI 로그 불필요)
- Netlify / Render / Railway 직접 배포 템플릿 (위와 동일한 이유)
- 일반 웹 프레임워크 스타터 (Astro, SvelteKit, Remix 스캐폴드) — 그것은 프레임워크 문제이지 배포 문제가 아닙니다
- 학습 도구나 튜토리얼 시리즈 — 개념적 경로가 필요하면 [graduation-from-vibe-coding](https://github.com/starter-series/create-starter/blob/main/docs/graduation-from-vibe-coding.ko.md)를 참고하세요. 단, 스타터 자체는 사용자가 앱 코드를 작성할 수 있다는 전제로 만들어졌습니다

## 라이선스

MIT
