---
description: Run codex request with workspace-write sandbox via omega-codex-cli
argument-hint: '[prompt]'
allowed-tools: Bash, Read
---

Run:

```bash
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs "PROMPT" --sandbox
```

This maps to `codex exec ... --sandbox workspace-write`.
