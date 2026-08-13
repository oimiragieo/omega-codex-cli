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

- `--model MODEL` — see `models.md` for current IDs (`gpt-5.6-sol`, `gpt-5.6-luna`, etc.)
- `--json` — Codex JSONL mode; wrapper prints the final response text when found
- `--sandbox` (workspace-write)
- `--timeout-ms N`

Large prompts (>6 KB) are piped via `codex exec -` to avoid OS command-line length limits.

By default `codex exec` is read-only; `--sandbox` maps to `--sandbox workspace-write`. Prefer that explicit flag over the deprecated `codex exec --full-auto` compatibility path.
