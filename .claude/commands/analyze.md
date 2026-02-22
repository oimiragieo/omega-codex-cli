---
description: Analyze files or questions via omega-codex-cli headless runner
argument-hint: '[prompt or @file ...]'
allowed-tools: Bash, Read
---

1. Build a prompt from the user request, including relevant file references.
2. Run:

```bash
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs "PROMPT"
```

3. Return stdout to the user.

If no argument is provided, ask what to analyze.
