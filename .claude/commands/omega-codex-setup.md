---
description: Verify omega-codex-cli setup (Node + Codex CLI)
allowed-tools: Bash, Read
---

Run from project root:

```bash
node .claude/skills/omega-codex-cli/scripts/verify-setup.mjs
```

If setup reports missing Codex CLI, install with:

```bash
npm install -g @openai/codex
```

If authentication is needed, run `codex login`.
