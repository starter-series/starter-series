# Starter Series

Canonical hub for Starter Series. This repo owns the public README, static site
assets, org-audit workflow, and completion/agent-native policy docs.

## Current Cycle Scope

`create-starter` and `shotkit` are handled in separate sessions. Do not edit
those repos from this workspace when working on the current service-completion
cycle. Their public flows remain external dependencies, so claims about their
commands require fresh proof from those sessions.

The current completion baseline is defined in
`docs/service-completion-definition.md`: this repo, the 11 core starters, and
the already-public `ProfileKit` / `profilekit-mcp` pair.

## Project Structure

```
README.md                         # Canonical public inventory and promise
docs/agent-native.md              # Agent-facing surface standard
docs/service-completion-definition.md
.github/workflows/org-audit.yml   # Weekly baseline audit receipt
index.html, style.css, app.js     # Static landing page
locales/                          # English and Korean site strings
scripts/sync-versions.js          # Cross-repo drift report
```

## Commands

```bash
node scripts/sync-versions.js
```

This command is report-only. Exit code 1 means drift exists and must be resolved
or registered as intentional before claiming the cycle is complete.

For markdown-only edits:

```bash
git diff --check
```

## Public Truth Rules

- Public docs must match code, workflows, package metadata, and current repo
  inventory. Do not describe planned tools as complete.
- npm package identities must be unscoped product nouns. Use names like
  `starter-series`, `shotkit`, `iconkit`, or `profilekit-mcp`; do not invent
  scoped npm package names.
- GitHub organization membership is not proof that a repo belongs in the
  completion baseline. Baseline membership must match
  `docs/service-completion-definition.md`.
- `icon-maker`, `rulemeter`, `landing-page`, and `dot-github` are classification
  or cleanup work unless explicitly promoted with evidence.
- Treat this file as the source of truth for coding-agent context. Client-specific
  instruction files for Claude, Copilot, Cursor, Antigravity, Codex, or similar
  tools may be added only as thin pointers back to `AGENTS.md`; they must not add
  independent naming, release, scope, or roadmap rules.

## Do Not Regress

- Do not add a new repo, product layer, design kit, service kit, or generic app
  builder as part of this completion cycle.
- Do not let the README health table, `org-audit.yml`, and completion docs tell
  different stories about the included baseline.
- Do not claim "every repo" has a surface unless local inventory proves it.
- Do not turn org-audit into a security certification claim. It is a public
  receipt, not certification.
