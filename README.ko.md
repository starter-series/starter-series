<div align="center">

# Starter Series

**AI는 코드를 만들어줍니다. 배포는 저희가 합니다.**

모든 스타터에 CI/CD, 보안 검사, 배포 파이프라인이 내장되어 있습니다.<br>
레포를 Clone하세요. 앱을 만드세요. Push하면 배포됩니다.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[English](README.md) | **한국어**

</div>

## 스타터 목록

| 스타터 | 설명 | 스택 |
|--------|------|------|
| [docker-deploy-starter](https://github.com/starter-series/docker-deploy-starter) | 언어 무관, Dockerfile 하나로 VPS SSH 배포 | Docker, GHCR, GitHub Actions |
| [mcp-server-starter](https://github.com/starter-series/mcp-server-starter) | TypeScript MCP 서버 + OIDC npm 배포 | MCP, TypeScript, OIDC |
| [npm-package-starter](https://github.com/starter-series/npm-package-starter) | OIDC trusted publishing, 시크릿 제로, provenance | npm, OIDC, Provenance |
| [browser-extension-starter](https://github.com/starter-series/browser-extension-starter) | MV3 확장 + CWS/AMO 자동 배포 | Manifest V3, Chrome, Firefox |
| [vscode-extension-starter](https://github.com/starter-series/vscode-extension-starter) | VS Marketplace + Open VSX 동시 배포 | VS Code, Vanilla JS |
| [discord-bot-starter](https://github.com/starter-series/discord-bot-starter) | Discord.js v14 + 슬래시 커맨드 자동 로딩 | Discord.js, Docker, Railway |
| [telegram-bot-starter](https://github.com/starter-series/telegram-bot-starter) | grammY 봇 + 폴링/웹훅 이중 모드 | grammY, Docker, Railway |
| [electron-app-starter](https://github.com/starter-series/electron-app-starter) | 크로스플랫폼 데스크톱 앱 + 코드사이닝 + 자동 업데이트 | Electron, macOS/Win/Linux |
| [react-native-starter](https://github.com/starter-series/react-native-starter) | Expo + EAS Build + App Store/Play Store CI/CD | Expo, iOS, Android |

## 포함 사항

모든 스타터에 공통으로 포함:

- **CI/CD** — GitHub Actions 빌드, 테스트, 린트, 배포 파이프라인
- **보안** — `npm audit`, 시크릿 스캐닝 (gitleaks), 라이선스 검사, CodeQL 정적 분석
- **배포** — 플랫폼별 퍼블리싱 (npm, Docker, 앱 스토어, 확장 스토어)
- **유지보수** — 주간 스케줄 CI 헬스체크 + 실패 시 이슈 자동 생성
- **Stale 관리** — 비활성 이슈/PR 자동 라벨링 및 닫기
- **Dependabot** — 그룹화된 의존성 업데이트 + 잠금파일 충돌 방지

## 빠른 시작

```bash
# 1. 템플릿으로 사용 (또는 클론)
gh repo create my-app --template starter-series/docker-deploy-starter

# 2. 앱 작성

# 3. Push — CI/CD가 나머지를 처리합니다
git push origin main
```

## 라이선스

MIT
