# Service completion definition

This document defines what "complete enough to leave the Starter Series alone"
means for the current cycle.

It is a closing bar, not a roadmap. Passing it must reduce open surface area.
It must not create a new repo, product layer, design kit, service kit, or
general app builder.

## Scope for this cycle

`create-starter` and `shotkit` are external tools for this completion baseline.
Their package names are guarded here because they affect public command truth,
but their release proof still belongs to their own sessions. Public docs cannot
claim their flows are working unless those sessions produce fresh evidence.

The minimum viable closing target is narrower than the full local folder. It is:
the canonical hub, the 11 core starters, and the already-public ProfileKit /
profilekit-mcp pair. Everything else is a classification or cleanup decision,
not a new completion promise.

| Group | Repos | Completion role |
|---|---|---|
| Canonical hub | `starter-series` | Public README, site assets, health table, and completion docs agree on the same included baseline. |
| Core starters | `browser-extension-starter`, `cloudflare-pages-starter`, `discord-bot-starter`, `docker-deploy-starter`, `electron-app-starter`, `mcp-server-starter`, `npm-package-starter`, `python-mcp-server-starter`, `react-native-starter`, `telegram-bot-starter`, `vscode-extension-starter` | Each starter proves clone/install/test/build/deploy-preflight or package-preflight for the first user path it advertises. |
| Launch and presence baseline | `ProfileKit`, `profilekit-mcp` | Each already-public tool proves its install, smoke, package, and agent-facing command path. |
| Public-surface cleanup | `landing-page`, `dot-github` | Decide whether each is canonical, redirect/archive candidate, or profile-only. These repos are not completion baseline unless promoted with evidence. |
| Pre-release cleanup | `icon-maker` | Keep it labeled pre-release/local unless a separate package and public command proof exists. It is not part of the current completion baseline. |
| Proof support cleanup | `rulemeter` | Either classify it as support-only with matching docs and CI evidence, or keep it outside the public Starter Series promise. |
| External dependencies | `create-starter`, `shotkit` | Package names are guarded as unscoped product nouns. Public release claims are allowed only when their separate sessions provide current proof. |

## Owner constraints

- GitHub organization is the brand home. npm package names are unscoped product
  nouns: `starter-series`, `shotkit`, `iconkit`, `profilekit-mcp`, and similar.
- One repo has one public responsibility. A repo can be a starter, a tool, a
  service, a public surface, or a support utility; it should not drift between
  those roles.
- This cycle ships no new repos and no new product category. Design-system,
  app-builder, product-contract, and service-completion-harness ideas are out of
  scope until there is separate demand evidence.
- Pre-release tools may appear only as pre-release/local surfaces. They do not
  belong in health or completion claims until their package, command, and CI
  evidence exists.
- Public docs use only verified facts from code, workflows, releases, or
  owner-approved strategy text.

## Current README and code gaps to keep closed

These are blockers because they can mislead the first user or the next agent.

| Gap | Verified local signal | Required closure |
|---|---|---|
| Static site first action depends on excluded work | The public site must not advertise `create-starter` commands as the baseline first action while `create-starter` is excluded. | The first visible action must be direct GitHub template use, or a clearly labeled external-tool path. |
| Org audit badge depends on excluded tool behavior | `org-audit.yml` must not call `create-starter` or include `create-starter` / `shotkit` in the baseline receipt. | Keep org-audit as an independent baseline inventory receipt for included repos only. It may clone external tool repos only for package-name drift guards. |
| Public surface split can regress | `starter-series` is the canonical public site; `landing-page` must not drift back into a second official site. | Keep `landing-page` as a redirect/archive candidate unless it is explicitly promoted with fresh completion evidence. |

## Completion gates

### 1. Inventory truth

Completion requires a single repo inventory table in the canonical public docs.
The table must classify every local repo as included, external dependency,
support-only, or out of scope. The README health table, `org-audit.yml` repo
list, and this completion document must agree for the included baseline.
External dependencies and cleanup-only repos may be listed separately, but they
cannot silently count as green service evidence.

### 2. First-user path proof

Each included repo needs one repeatable command sequence that proves the action a
user would try first.

| Repo type | First user action | Required evidence |
|---|---|---|
| Starter template | Clone from template, install, test, build, then run deploy or package preflight. | Fresh local command log plus CI workflow that runs the same core checks. |
| npm/package tool | Install or pack the package, run the CLI smoke path, and verify the JSON/exit-code contract when advertised. | `npm test`, build if present, `npm pack --dry-run --json`, and install-smoke where available. |
| Service/API | Run tests, start or import the service, hit the smallest public endpoint or render path. | Unit test output plus one smoke proof for the public endpoint/render path. |
| Canonical static surface | Build or lint the site, run browser smoke, verify links to canonical repos. | Static test output and browser smoke output. |
| Profile-only repo | Rendered README/profile text matches the canonical brand and repo inventory. | Diff review plus link check where practical. |

### 3. Public command truth

Every command shown before the first scroll of a README must be runnable from a
clean environment or visibly labeled as pending/pre-release. For package-based
commands, completion evidence must include the install name, package name,
binary name, version, and pack/publish proof used for that claim.

### 4. Agent-native truth

Any repo that an agent is expected to touch must have a root `AGENTS.md` with:

- what the repo owns,
- commands for test/build/lint/smoke,
- invariants the agent must not regress,
- public naming and release constraints.

Client-specific instruction files may be added for agent apps or IDEs that
auto-load them, but they must remain thin adapters that point back to `AGENTS.md`.
They must not add independent strategy, package naming, release, roadmap, or
completion-scope rules.

Tool repos that advertise agent use must additionally prove `--json` output,
stable exit codes, and skill/plugin packaging only if those surfaces actually
exist.

### 5. Security and release baseline

Each included active repo must have a documented security/release baseline
appropriate to its type:

- CI for tests/build/lint where applicable,
- CodeQL or a documented exception,
- dependency automation where dependencies exist,
- secret scanning or gitleaks where code accepts user/config input,
- package preflight for npm/PyPI/extension/app artifacts,
- no release or store-readiness claim without a matching workflow or manual
  checklist.

### 6. Closure artifact

Completion is not a feeling. It requires a checked-in status artifact, for
example `docs/service-completion-status.md`, with:

- timestamp of the pass,
- repo inventory,
- command evidence per repo,
- external blockers from `create-starter` and `shotkit`,
- unresolved exceptions with an owner decision: fix now, defer, or remove from
  public promise.

## Done means

The Starter Series can be considered complete for this cycle when:

1. Included repo list is frozen.
2. No new repo or product layer is added.
3. Public README, site, health table, and org-audit scope agree.
4. Every included repo has a first-user path proof.
5. npm identities are unscoped product nouns where a package is published or
   prepared for publication.
6. `create-starter` and `shotkit` are either proven by their own sessions or
   removed from the current first-user promise.
7. `icon-maker`, `rulemeter`, `landing-page`, and `dot-github` are classified
   without expanding the completion baseline.
8. A final status artifact records the evidence and remaining exceptions.
