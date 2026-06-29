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

- `--model MODEL` — see `models.md` for current IDs (`gpt-5.5`, `gpt-5.4-mini`, etc.)
- `--json` — Codex JSONL mode; wrapper prints the final response text when found
- `--sandbox` (workspace-write)
- `--timeout-ms N`

Large prompts (>6 KB) are piped via `codex exec -` to avoid OS command-line length limits.
