---
description: Brainstorm ideas via omega-codex-cli headless runner
argument-hint: '[challenge or question]'
allowed-tools: Bash, Read
---

1. Build a brainstorming prompt from the user request.
2. Run:

```bash
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs "PROMPT"
```

3. Return stdout to the user.
