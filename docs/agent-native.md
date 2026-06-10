# Agent-native standard

Every starter-series repo treats coding agents as first-class users — in 2026,
half the "developers" cloning a starter or running a tool are agents. The
standard, in increasing order of capability:

1. **`AGENTS.md` at the repo root** — what the repo is, the commands that
   matter, the invariants an agent must not regress. *Applies to every repo.*
2. **A "run this tool" block in AGENTS.md** — the exact invocation and output
   contract, so any shell-having agent (Claude Code, Codex, Cursor, Gemini
   CLI, …) can use the tool without reading docs. *Applies to repos that ship
   a tool.*
3. **Machine output + stable exit codes** on every CLI — `--json` printing
   exactly one parseable object to stdout (logs to stderr), exit codes
   `0` ok / `1` result failure / `2` usage failure.
4. **A Claude Code skill** wrapping the tool (Agent Skills format — the same
   folder drops into Codex/Cursor/Gemini skill dirs), listed in the
   `starter-series` plugin marketplace.
5. **MCP only where the tool's nature fits** — fast, structured, path-scoped
   queries earn an MCP tool (create-starter's audits and `add_component`).
   Heavy, file-producing build tools do **not** (shotkit dropped MCP by
   design: a `--json` CLI + skill serves agents without per-session context
   cost).

## Coverage today

| Repo | 1. AGENTS.md | 2. run-block | 3. `--json` / exit codes | 4. skill | 5. MCP |
|---|---|---|---|---|---|
| create-starter | ✅ | ✅ | ✅ (structured MCP output, CLI exit contract) | ✅ `create`, `deploy-setup` | ✅ 7 tools |
| shotkit | ✅ | ✅ | ✅ (`--json`, 0/1/2) | ✅ `capture` | — by design |
| 11 starters | ✅ (AGENTS.md ships in each template) | n/a (templates, not tools) | n/a | n/a | n/a |

## Rollout rule

A new capability repo must ship levels 1–4 from day one, and level 5 only when
the surface-by-nature test passes. Starters ship level 1 and keep it accurate —
`AGENTS.md` is part of the template's product surface, since the cloned repo's
first reader is usually an agent.
