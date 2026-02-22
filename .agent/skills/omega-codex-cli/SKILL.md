---
name: omega-codex-cli
description: Use when Antigravity should run Codex CLI headless for analysis or brainstorming tasks.
---

# Omega Codex CLI (Antigravity entry)

Run from project root:

```bash
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs "USER_PROMPT"
```

Use `--model`, `--json`, `--sandbox`, and `--timeout-ms` as needed.
If setup fails, run:

```bash
node .claude/skills/omega-codex-cli/scripts/verify-setup.mjs
```
