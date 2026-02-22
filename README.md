# Omega Codex CLI

Portable skill pack for running Codex CLI headless from multiple agent surfaces (Codex, Cursor, Antigravity, and VS Code tasks).

## Core idea

The shared runtime lives in `.claude/skills/omega-codex-cli/`.

- Main script: `.claude/skills/omega-codex-cli/scripts/ask-codex.mjs`
- Setup check: `.claude/skills/omega-codex-cli/scripts/verify-setup.mjs`
- No MCP required

Other folders (`.agents`, `.agent`, `.cursor`, `.vscode`) just point their host agent to this shared script.

## Quick start

1. Ensure Node.js 18+ is installed.
2. Install Codex CLI if needed:

```bash
npm install -g @openai/codex
```

3. Verify setup:

```bash
node .claude/skills/omega-codex-cli/scripts/verify-setup.mjs
```

4. Run headless Codex:

```bash
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs "Summarize this repository"
```

## Script options

```bash
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs "PROMPT" \
  [--model MODEL] \
  [--json] \
  [--sandbox] \
  [--timeout-ms 120000]
```

- `--model`: forwards to `codex exec --model`
- `--json`: forwards to `codex exec --json` (JSONL event stream)
- `--sandbox`: maps to `--sandbox workspace-write`
- `--timeout-ms`: wrapper-side timeout (exit code `124` on timeout)

## Direct CLI equivalent

```bash
codex exec "PROMPT" --skip-git-repo-check
```

Optional additions: `--model ...`, `--json`, `--sandbox workspace-write`.

## Repo structure

- `.claude/`: commands + shared skill/runtime
- `.agents/`: Codex-specific skill entrypoint
- `.agent/`: Antigravity entrypoint
- `.cursor/rules/`: Cursor routing rules
- `.vscode/tasks.json`: Ask/verify tasks

## License

MIT License (Non-Commercial) in `LICENSE`.
