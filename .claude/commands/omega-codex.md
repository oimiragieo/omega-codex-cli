---
description: Route a request through omega-codex-cli headless codex runner
argument-hint: '[request]'
allowed-tools: Bash, Read
---

Use this command as a generic entrypoint for analysis or brainstorming.

```bash
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs "PROMPT"
```

Optional flags: `--model MODEL`, `--json`, `--sandbox`, `--timeout-ms N`.
