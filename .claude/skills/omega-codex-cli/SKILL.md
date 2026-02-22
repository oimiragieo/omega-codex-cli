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

- `--model MODEL`
- `--json` (passes through Codex JSONL events)
- `--sandbox` (uses `workspace-write`)
- `--timeout-ms N`

## Setup and troubleshooting

1. Run:

```bash
node .claude/skills/omega-codex-cli/scripts/verify-setup.mjs
```

2. If Codex is missing, install `@openai/codex` globally or use `npx -y @openai/codex`.
3. If auth is required, run `codex login` (or `codex`) once.

See references:

- `references/headless.md`
- `references/installation.md`
- `references/auth.md`
- `references/copy-and-run.md`
