# Headless Codex

Use the wrapper script from project root:

```bash
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs "PROMPT"
```

Direct equivalent:

```bash
codex exec "PROMPT" --skip-git-repo-check
```

Options supported by the wrapper:

- `--model MODEL`
- `--json` (JSONL event output)
- `--sandbox` (workspace-write)
- `--timeout-ms N`
