# Repo Audit — starter-series (hub)

> 멀티에이전트 딥 감사 (audit-repo-ultra): A~E 5개 차원 감사자 병렬 + 규약 사이드바 → 발견·점수 적대 검증 → 킬러 리스크 3렌즈 토너먼트 → completeness critic + 확인 에이전트. 22 에이전트 / 265 tool call / ~1.15M subagent tokens.
> 레포 유형: **tool-with-code / hybrid** — 정적 바이링궐 랜딩 페이지 허브(index.html/style.css/app.js/i18n.js/locales) + 빌드·검증 스크립트(scripts/) + 테스트(node --test, playwright) + CI 워크플로. 공개 표면 = git 추적 34개 파일. **A~E 5개 차원 채점, 제외 없음.** 규약은 점수 무관 사이드바.
> 감사 대상 실경로: `starter-series/starter-series` (상위 `IdeaProjects/starter-series`는 git 레포가 아닌 워크스페이스 컨테이너 — 이 구분이 C 차원 재현성 판정의 핵심).
> 기준: base `audit-repo.md`(점수 앵커·차원 정의·카브아웃·산출 형식의 단일 기준). 규약 = 점수 없는 사이드바(prior run이 "F"로 채점한 것을 이번엔 base대로 비채점 처리 — 방법론 정정).

## 한 줄 평결 · 종합 점수

**종합 3.0 / 5** (A~E 5개 차원 평균, 제외 없음)

기술적 위생(안전한 프론트엔드·SHA핀 gitleaks·최소권한 CI·정합 게이트)은 실제로 견고하지만, **공개 산문의 신뢰성 서약("receipts, not claims" · 현재형 10개 스토어 퍼블리시 단정)이 레포 내 어떤 아티팩트로도 입증되지 않고 레포 자신의 status.md·오너 완결 게이트와 충돌한다.** 핵심 약점은 코드 품질이 아니라 *반-과장 서약을 스스로 과장으로 위반하는 재귀적 신뢰 실패*다. 여기에 **Pages 배포가 내부 자기비판 문서를 그대로 공개**하는 신규 결함이 겹친다. 진짜 비밀키·법적 실명·외부인 PII 유출은 트리·69커밋 히스토리 전체에서 0건.

## 차원별 점수 (Verify 조정 반영 최종)

| 차원 | 제안 | 최종 | 근거 요약 |
|---|:--:|:--:|---|
| A. 오리엔테이션/접근성 | 3 | **3** | README 3줄 헤더·"Choose by shipping target" 결과물 우선 표(README:20-31)·i18n 완전 대칭(en/ko 각 100키)·인페이지 앵커 전부 resolve로 5분 오리엔테이션은 성립. 그러나 전 콘텐츠가 `.reveal{opacity:0}`(style.css:470)로 JS IntersectionObserver에만 의존, `<noscript>` 0건, opacity:1 리셋은 prefers-reduced-motion 미디어쿼리 안에만(style.css:493) → JS 미실행+기본 모션에서 랜딩이 백지. 4점을 막는 실질 갭. |
| B. 내용/설계의 실질 | 3 | **3** | 포지셔닝 논증(반복제거 vs 교육 / 배포타깃 1급 / Vercel·Netlify Non-goal 근거, README:170-189)은 방어 가능. 그러나 그 논증을 뒷받침하는 실증이 전부 레포 밖 형제 스타터에 있어 이 레포 단독으로는 검증 불가. 명확한 갭. (검증 과정에서 1개 중대 오탐 삭제·1개 강등.) |
| C. 엄밀성/취약점 | 2 → | **3** | 자기표면 규율은 견고(validate-site.py 크로스-서피스 불변식 CI 강제, node --test·playwright, anti-'every repo' 오버클레임 가드, hub 자체 npm test/build 실행). 그러나 형제 완결 수치(status.md의 80/197 tests)가 clean clone에서 재현 불가 + "receipt" 명령이 단독 클론에서 exit 1. 제안 2는 2개 기둥이 반박되어 과함, 인상 챌린저의 4는 잔존 중대 감안 시 과함 → 3. |
| D. 코드/아티팩트 보안·품질 | 3 | **3** | 진짜 XSS 안전(innerHTML/eval/insertAdjacentHTML 전무, textContent/createElement/DocumentFragment만), gitleaks SHA256 체크섬 검증(ci.yml:51), 최소권한, actor-게이트 auto-merge는 실질 강점. 그러나 dependabot npm 사각지대+거짓 주석, 1st-party actions 가변 태그 핀, gitleaks "every commit" 과장. |
| E. 문서화·위생 | 3 | **3** | README 헤더·MIT·죽은 링크 0·로케일 패리티·node_modules 미커밋은 견고. 그러나 **pages.yml `path: .`가 내부 운영·자기비판 문서(status.md/AGENTS.md/CLAUDE.md)를 공개 게시**(gap phase 확정 중대), validate-site 배포-서피스 가드는 구조적으로 여분 파일을 못 잡음, test-results/ 미-gitignore, dependabot 거짓 주석. |

## 잘한 점 TOP 3 (파일 근거)

1. **Safe-by-default 프론트엔드 + 공급망 위생 (실측 강점).** `app.js`·`i18n.js`가 `textContent`/`createElement`/`DocumentFragment`만 사용하고 개행 분할조차 `createTextNode`+`createElement('br')`로 처리(i18n.js:37-44) — `innerHTML`/`eval`/`insertAdjacentHTML`/`document.write` 전무(직접 grep 0건). `ci.yml:50-53`은 gitleaks 다운로드를 `sha256sum -c`로 검증 후 실행하고 `contents:read` 최소권한이다.
2. **크로스-서피스 정합의 기계 강제 + 자기표면 테스트.** `scripts/validate-site.py`가 로케일 키 대칭·사이트 카드↔README 헬스표↔org-audit REPOS 일치·Tailwind-CDN 금지·README가 "every repo in the org"를 주장하면 실패시키는 anti-오버클레임 가드를 CI 게이트로 강제한다. `tests/app-dom.test.mjs`(node --test)가 i18n 대칭·모달 포커스 복귀·정확한 gh-template 문자열 같은 진짜 불변식을 검증한다.
3. **비자명한 auto-merge 공격 방어 + 청결한 유출 자세.** `dependabot-auto-merge.yml`은 "메인테이너가 dependabot 브랜치에 푸시 → 사람 편집 자동머지" 공격을 `github.actor` 게이트로 막고 근거를 주석에 명시하며, minor/patch만 자동머지·major는 수동. 트리·69커밋 히스토리·dangling·stash 전체에서 비밀키·토큰·법적 실명(Jiyeon/Yoon)·외부인 PII 0건(메인 루프 직접 재검증).

## 보완 우선순위 TOP 5 (영향×노력 정렬, 심각도)

1. **[중대] 현재형 능력·퍼블리시 단정이 레포 내 증거를 앞선다 — `README.md:113,147-159`.** "Health — receipts, not claims" 배너 아래 "Currently implemented"가 11개 스타터의 10개 스토어 퍼블리시·CodeQL·보안 CI를 현재형 완료로 단정하나, (a) 스타터 코드는 이 레포에 0개, (b) 유일한 in-repo "receipt"(`scripts/audit-baseline.js`)는 파일 존재·정규식 매칭만 수행(test/build/publish 미실행 — grep로 `child_process` 0건 확인), (c) 레포 자신의 `docs/service-completion-status.md`가 퍼블리시는 미입증이라 자백("built without publish", "tied to external shotkit proof"), (d) 오너 완결 게이트 #5("no release/store-readiness claim without a matching workflow")와 배치. **이것이 킬러 리스크.** 조치: "Currently implemented"를 in-repo로 검증되는 것에 한정하거나 각 능력을 입증 워크플로에 링크하고 status.md와 정합. (노력: 낮음 — 산문)
2. **[중대] Pages가 저장소 전체를 게시해 내부 자기비판 문서가 공개된다 — `pages.yml:26` `path: .` + `validate-site.py:182`.** `_config.yml`·`.nojekyll`·exclude 없이 트리 전체를 업로드해 `docs/service-completion-status.md`("overclaim identified"·"Partial" 판정)·`AGENTS.md`·`CLAUDE.md`·비공개 org 인벤토리(rulemeter/icon-maker/dot-github)가 `starter-series.github.io/.../docs/...md`로 raw 공개된다. 배포-서피스 가드는 `existing & DEPLOY_FILES`(교집합)라 여분 파일을 **구조적으로 절대 못 잡는다**(차집합이어야 함). 조치: `DEPLOY_FILES`만 dist/로 스테이징해 업로드 + `--check-deploy-surface`가 예상 외 파일에 실패하도록. (노력: 낮음~중간)
3. **[중대] 형제 완결 수치가 재현 불가능한 서사 — `docs/service-completion-status.md:25-37`.** "80/197/136 tests passed"가 captured evidence로 제시되나 이를 재생성하는 in-repo 아티팩트/CI가 없다(`org-audit.yml:44-48`은 npm test/build를 hub에만 실행, 13개 형제는 `:53` 파일 스캔만). 외부인은 대상 레포 부재로 첫 걸음에서 막힌다. 조치: 형제 테스트를 재실행하는 CI 잡을 커밋하거나, 수치를 명시적으로 "특정 시점 수동 로그"로 재프레이밍. (노력: 중간)
4. **[사소] JS 미실행 시 랜딩 백지 — `index.html` + `style.css:470,493`.** 전 콘텐츠가 `.reveal{opacity:0}`이고 `.visible`은 JS IntersectionObserver만 부여(app.js:259-267), opacity:1 리셋은 `@media(prefers-reduced-motion:reduce)` 안에만, `<noscript>` 0건 → JS-off + 기본 모션 방문자·일부 비-JS 프리뷰가 백지를 본다. 조치: `.reveal` 기본값을 visible로 두고 JS가 `<html>`에 `.js`를 붙일 때만 숨김-후-리빌로 전환하거나 `<noscript>` 리셋 추가. (노력: 낮음) *(감사자·반박자는 중대로 봤으나 영향 코호트가 no-JS 소수·대다수 크롤러가 JS 실행이라 메인 루프가 사소로 하향.)*
5. **[사소] 의존성·핀 위생 갭 — `.github/dependabot.yml:3-4`, `SECURITY.md:17`.** 주석이 "static site (no package.json)"·"pinned GitHub Actions SHAs"라 단언하나 devDeps(@playwright/test·jsdom) 있는 package.json 실존 + 1st-party actions는 가변 `@v6/@v5` 태그(3rd-party만 SHA 핀). npm 생태계 dependabot 블록 부재로 자동 갱신 경로 없음(npm audit 차단만). `SECURITY.md:17` "gitleaks scans every commit"은 실제 `ci.yml:53` 워크트리 스냅샷(`--source .`) 스캔과 불일치. 조치: `package-ecosystem: npm` 추가+주석 정정, (선택) actions SHA 핀, SECURITY.md 문구 정정. (노력: 낮음)

**치명 결함 부재 판단 근거:** 치명(공개 즉시 신뢰를 붕괴시키는) 결함은 없다. (a) 비밀키·토큰·법적 실명·외부인 PII 유출이 트리·69커밋 히스토리·dangling·stash 전체에서 0건(직접 재검증), (b) 위험한 코드 싱크(innerHTML/eval/injection) 없음, (c) 과대주장·과다게시는 산문/설정 수정으로 회복 가능하며 status.md가 갭을 부분 자기공개. gap phase가 치명으로 제안한 커밋-메타데이터 gmail은 오너 승인 별칭의 자가공개 주소로 판정되어 위반이 아님(아래 검증 로그·사이드바 참조).

## 규약 사이드바 (점수 무관 — 위반/관찰만)

- **[Status 불일치] `README.md:113,147-159`** — "Currently implemented"의 현재형 10-스토어 퍼블리시 단정이 status.md의 미입증 자백·오너 완결 게이트 #5와 충돌 (= 킬러 리스크 본체).
- **[Status 불일치] `README.md:113,130-146`** — "receipts, not claims" 프레이밍의 백킹 아티팩트가 전부 레포 밖 형제 스타터에 있고, 유일 in-repo status 문서는 오너 자기서사.
- **[디스클레이머 첫 줄 아님] `docs/service-completion-status.md:6-7`** — "not a completion claim yet" 고지가 H1+타임스탬프 2줄 뒤에 위치(존재하나 첫 줄 아님). 사소.
- **[Co-Author 트레일러] `2cd1fc0`, `ca8c1c2`** — dependabot 커밋 2건에 GitHub 웹-머지가 생성한 `Co-authored-by: heznpc <heznpc@gmail.com>` 트레일러 존재. 오너 무-트레일러 규약과 스침. 봇 커밋 본문·승인 별칭뿐이라 유출 아님. 사소.
- **[사설 이메일 표면 — 위반 아님/관찰]** `heznpc@gmail.com`이 `SECURITY.md:8` 보안 연락처 + 63개 커밋 author 메타데이터에 노출. 그러나 이는 **오너가 스스로 SECURITY.md에 게재한 승인 별칭 역할 이메일**이며, 헌법 PII 조항은 *외부인* name/email/company와 *법적 실명*을 대상으로 한다(heznpc는 오너 승인 유일 공개 정체성). 위반 아님. 관찰: 향후 커밋에 noreply 별칭(`heznpc@users.noreply.github.com`, 현재 1건만) 사용 시 메타데이터 노출 최소화 가능 — 단 히스토리 재작성은 비가역 작업이라 권고 대상 아님.

## 킬러 리스크 (1개)

**`README.md` — 프로젝트의 헤드라인 차별점인 반-과장 서약을 프로젝트 자신이 과장으로 위반(재귀적 신뢰 실패).** 이 레포는 `package.json` name이 `starter-series-landing-page`인 정적 랜딩 페이지일 뿐인데(스타터·Dockerfile·CodeQL·publish 워크플로 in-repo 0건), `README.md:113`은 섹션을 "Health — receipts, not claims"로 명명하고 `README.md:147-159`는 11개 스타터 전부의 10개 스토어 퍼블리시·CodeQL·보안 CI를 현재형 완료로 단정한다. 그러나 README가 리시트로 가리키는 유일한 in-repo 아티팩트 `scripts/audit-baseline.js`는 파일 존재·정규식 매칭 전용(test/build/publish 미실행, 메인 루프 grep 재확인)이고, 그 명령을 진짜 단독 clean clone에서 실행하면 검증 root가 부모 워크스페이스(`../..`)를 가리켜 14개 형제 baseline이 전부 "missing directory"로 exit 1 — 리시트가 자기붕괴한다. 결정적으로 레포 내부만으로도 반증되는 모순이 있다: `SECURITY.md:17` "gitleaks scans every commit" vs `ci.yml:53` 워크트리 스냅샷 스캔(`--source .`), 그리고 status.md 자신이 퍼블리시 미입증을 자백. "receipts, not claims" 배너를 믿고 검증하려는 리뷰어가 정확히 이 지점에서 신뢰를 가장 크게 잃는다.

**기각한 후보:**
- **(유출/PII/비밀키) — 자기부정.** 트리·전체 히스토리에 비밀키·토큰·법적 실명·외부인 PII 0건. 유일 개인 흔적 `heznpc@gmail.com`은 오너가 SECURITY.md에 자가공개한 승인 별칭. 킬러 부재.
- **(재현성/데이터 도달성) clean-clone exit 1** — 실측 확인된 진짜 결함이나, 킬러(주장 무결성)의 *부분집합·증상*이다("검증 코드가 레포 경계 밖을 가리킨다"의 발현). 킬러가 이 손해를 엄격히 포함 + 레포 내부만으로 반증되는 자기모순까지 포함하므로 블라스트 반경이 더 넓은 킬러를 지명.
- **(pages.yml 내부문서 과다게시)** — 실재하는 중대 결함이나 국소적·수정 용이한 위생 사안이자 킬러(과장)를 공개 표면으로 실어나르는 *전달 메커니즘*. 단일 최대 킥은 근본 신뢰 실패인 킬러. (TOP 5 #2로 별도 반영.)

---

## 검증 로그 (ultra 전용)

**반박으로 죽은 finding (3건 삭제):**
- **B [중대] "감사 도구가 전부 레포 밖(root=../..)을 가리켜 내부 검증 전무"** → 오탐 삭제. `--root`는 파라미터화(audit-baseline.js:49-52 기본값일 뿐), org-audit이 GitHub에서 형제를 clone, `validate-site.py`는 `ROOT=parents[1]`로 *이 레포 자체*를 검증(메인 루프 확인). 내부 검증 경로가 실재하므로 "전무"는 과장.
- **C [중대] "audit-baseline은 존재 검사뿐 → receipt에 3점 상한 적용"** → 오탐 삭제. README:116-123이 이를 명시적으로 "inventory/presence receipt"로 좁히고 릴리즈 증거 대체 불가를 고지, 능력 증명은 별도 게이트+라이브 CI 배지로 라우팅. 정직하게 스코프된 리시트를 은폐된 능력주장으로 오독.
- **C [중대] "org-audit이 hub만 test → 전 baseline 건강 인상과 불일치"** → 오탐 삭제. README:116-123이 org-audit 범위를 정확히 서술(파일 존재 스캔), 스타터 능력은 README:130-145 라이브 per-repo CI 배지가 증거 매개. org-audit을 능력 인증으로 오인.

**반박으로 강등된 finding (4건):**
- B [중대→사소] graduation 가이드 자기모순 — 실재하나 line 161에 인라인 링크 없음·개념 가이드는 working-flow 주장보다 약함.
- C [중대→사소] AGENTS.md sync-versions ../.. 재현 — 기계적 사실이나 sync-versions는 내부 유지보수 툴(외부 경로 아님)이고 audit-baseline 의존을 오귀속.
- D [중대→사소] dependabot npm 사각지대 — 실재하나 devDeps 한정+npm audit 보상제어 존재로 프로덕션 취약점 아님.
- E [중대→사소] dependabot 거짓 주석 — 동일(위생 갭으로 유지, 심각도 하향).

**점수 조정 이력 (제안 → 최종):**
- A 3 → 3 (챌린저 미발동; noscript 중대 kept, TOP-5에선 사소로 표기)
- B 3 → 3 (조정 없음; 중대 1 삭제·1 강등되었으나 핵심 실질 갭 유지)
- C **2 → 3** (인상 챌린저 4 제안 → 메인 루프 3으로 종합: 2점 기둥 2개가 반박돼 2는 과함, 그러나 인상 챌린저의 "실행하니 14개 PASS"는 *이 체크아웃이 형제를 가진 부모 워크스페이스에 중첩*된 로컬 산물이며 진짜 단독 clone은 exit 1 — 재현성 갭 실재. 잔존 status.md 중대까지 감안하면 4는 과함)
- D 3 → 3 (챌린저 미발동; 중대 1 강등, 갭 명확하나 비치명)
- E 3 → 3 (챌린저 미발동; 중대 1 강등 + gap phase의 pages 과다게시 중대 추가로 3 유지)
- 대칭 적용: C(제안 2 ≤2)에만 인상 챌린저 발동. ≥4 제안 차원 없어 인하 챌린저 미발동.

**Gap phase 결과 (2건 확인 → 1건 메인 루프 재판정):**
- **[치명 제안 → 위반 아님으로 하향]** 커밋 메타데이터 `heznpc@gmail.com`(author 63/committer 45). gap-confirm은 헌법 PII 조항을 "사설 이메일 일반 금지"로 확대해석해 치명 지정. 메인 루프 재판정: 헌법 문언은 *외부인* PII와 *법적 실명*이 대상이고, 해당 주소는 오너가 `SECURITY.md:8`에 자가공개한 승인 별칭 역할 이메일이라 유출·위반 아님(킬러 PII 렌즈도 독립적으로 "없음" 판정). 히스토리 재작성은 비가역 작업이라 권고하지 않음 → 사이드바 관찰로만 기록.
- **[중대 확정]** `pages.yml path: .` 내부 자기비판 문서 공개 게시 → TOP 5 #2로 반영. git-tracked 확인(docs/service-completion-status.md·AGENTS.md·CLAUDE.md 전부 배포 대상), status.md 자기비판 문구 실측.
- gap이 훑고 clean으로 판정한 영역(전 ref 비밀키/PII 스캔, dangling/stash, 브랜치/태그, 서브모듈, 대용량 바이너리, dependabot-auto-merge 인젝션 표면, index.html 인라인 스크립트)은 실질 결함 없음 — 커버리지 정상.

**prior run 대비:** 직전 ultra run은 A~E 평균 3.4(A4 B3 C3 D3 E4; 규약을 "F"로 잘못 채점). 이번 3.0은 (1) 규약 비채점 정정, (2) A를 4→3(neuf noscript 백지 결함 신규 발견), (3) E를 4→3(pages 내부문서 과다게시 신규 확정)로 낮췄다 — 점수 하락은 노이즈가 아니라 더 깊은 커버리지에 근거.

**방법론 (투명 고지 — 커버리지 축소 아님):** Workflow `args` 대신 스카우트 사실(중첩 실경로·유형·34파일 공개표면)을 각 에이전트 프롬프트 문자열에 직접 주입해 prior run의 args-미주입 실패를 회피 — 전 에이전트가 정확한 중첩 경로를 대상으로 감사. 점수·킬러를 좌우한 모든 핵심 주장을 메인 루프가 직접 재검증(audit-baseline 존재검사 전용·pages `path: .`·validate-site 교집합 가드·dependabot·XSS 싱크 0·비밀키/실명 0·org-audit hub-only test·gitleaks --source .·noscript/reveal·author 이메일 카운트). 5개 차원+규약 전부 감사, 샘플링·재시도 생략 없음. null 반환 에이전트 없음.

*Read-only audit. 대상 레포 파일 수정·삭제 없음. 유일한 쓰기 = 본 리포트 저장.*
*Agents: 22 · Tool calls: 265 · Subagent tokens: ~1.15M.*
