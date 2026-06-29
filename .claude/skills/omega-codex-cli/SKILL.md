---
name: omega-codex-cli
description: Use when the user asks to run Codex CLI headless from an agent workflow (analysis, brainstorming, second opinion, scripted CLI output). Trigger on requests like "ask codex", "run codex headless", "analyze with codex", or "brainstorm with codex".
---

# Omega Codex CLI

Use the shared headless wrapper to run Codex from this project without MCP.

## Run

From project root:

```bash
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs "USER_PROMPT"
```

Supported options:

- `--model MODEL` — forwarded to `codex exec --model` (see `references/models.md`)
- `--json` (runs Codex with JSONL events; prints extracted final response text)
- `--sandbox` (uses `workspace-write`)
- `--timeout-ms N`

## Models

For current model IDs and deprecation notes, read `references/models.md`. As of mid-2026, start with `gpt-5.5`; use `gpt-5.4-mini` for fast scans.

## Setup and troubleshooting

1. Run:

```bash
node .claude/skills/omega-codex-cli/scripts/verify-setup.mjs
```

2. If Codex is missing, install `@openai/codex` globally or use `npx -y @openai/codex`.
3. If auth is required, run `codex login` (or `codex`) once.
4. If model selection fails, run `codex doctor` and update the CLI (`npm install -g @openai/codex@latest`).

See references:

- `references/models.md`
- `references/headless.md`
- `references/installation.md`
- `references/auth.md`
- `references/copy-and-run.md`
