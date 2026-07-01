# Agent-native standard

Starter Series treats coding agents as first-class users: the first reader of a
fresh clone may be a human, an agent, or both. The product surface is not tied
to one app. It is a portable repo context package: one source of truth, with
thin adapters for agent clients that support their own project-instruction
files.

The baseline standard, in increasing order of capability:

1. **`AGENTS.md` at the repo root** — what the repo is, the commands that
   matter, the invariants an agent must not regress. *Applies to every included
   baseline repo.*
2. **Thin client adapters where supported** — files such as Claude, Copilot, or
   Cursor project instructions may exist, but they must point back to
   `AGENTS.md` and must not introduce independent strategy, naming, release, or
   scope rules.
3. **A "run this tool" block in AGENTS.md** — the exact invocation and output
   contract, so any shell-having agent (Claude Code, Codex, Cursor, Gemini
   CLI, …) can use the tool without reading docs. *Applies to repos that ship
   a tool.*
4. **Machine output + stable exit codes** on every CLI — `--json` printing
   exactly one parseable object to stdout (logs to stderr), exit codes
   `0` ok / `1` result failure / `2` usage failure.
5. **A skill wrapper** for agent clients that support packaged skills, when
   that surface actually ships. Skills are adapters, not the source of truth.
6. **MCP only where the tool's nature fits** — fast, structured, path-scoped
   queries may earn an MCP tool. Heavy, file-producing build tools should prefer
   a `--json` CLI plus a skill so they do not spend per-session context on large
   binary or file outputs.

## Coverage today

| Included baseline | 1. AGENTS.md | 2. thin adapters | 3. run-block | 4. `--json` / exit codes | 5. skill | 6. MCP |
|---|---|---|---|---|---|---|
| starter-series hub | ✅ | ✅ Claude/Copilot/Cursor pointers | n/a (policy/docs/site hub) | n/a | n/a | n/a |
| 11 starters | ✅ (AGENTS.md ships in each template) | ✅ Claude/Copilot/Cursor pointers | n/a (templates, not tools) | n/a | n/a | n/a |
| ProfileKit | ✅ | ✅ Claude/Copilot/Cursor pointers | n/a (service/API surface) | n/a | n/a | n/a |
| profilekit-mcp | ✅ | ✅ Claude/Copilot/Cursor pointers | ✅ | package/build contract | n/a | ✅ stdio server |

## Adapter rule

Adapter files are allowed only to improve auto-loading in a specific client. They
must be short and must defer to the root `AGENTS.md`. If an adapter contradicts
`AGENTS.md`, `docs/service-completion-definition.md`, package metadata, or CI,
the adapter is wrong.

The adapter may say:

```text
Read AGENTS.md first. Treat it as the source of truth for commands, invariants,
public naming, release constraints, and completion scope.
```

The adapter must not invent:

- a new package name,
- a new completion baseline,
- a new roadmap item,
- a new supported agent client,
- a new release or store-readiness claim.

The hub audit checks baseline adapter presence and verifies that each adapter
defers to `AGENTS.md`, stays labeled as a thin client adapter, and remains small
enough to function as a pointer instead of a second policy file.

## Companion tools

These repos are intentionally outside the current completion baseline. Their
agent-native surfaces require proof in their own sessions before this hub can
use them as completion evidence.

| Repo | Current classification |
|---|---|
| create-starter | external proof session |
| shotkit | external proof session |
| icon-maker | pre-release/local tool |

## Rollout rule

A new capability repo must ship levels 1, 3, and 4 from day one when it is a
tool repo, and level 6 only when the surface-by-nature test passes. Starters ship
level 1 and keep it accurate. Level 2 adapters are optional, but once added they
must stay thin. `AGENTS.md` is part of the template's product surface, since the
cloned repo's first reader is usually an agent. Cleanup-only repos stay out of
the baseline until they are classified and promoted with evidence.
