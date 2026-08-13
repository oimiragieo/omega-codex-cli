# Auth

Interactive / local: if Codex commands fail due to authentication, run:

```bash
codex login
```

Or open interactive CLI once:

```bash
codex
```

Then retry `ask-codex.mjs`. Check status with `codex login status` (exit `0` when credentials are present) or `codex doctor`.

## Headless / CI API key

For non-interactive `codex exec` (what this wrapper runs), prefer an inline API key:

```bash
CODEX_API_KEY=<api-key> node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs "PROMPT"
```

`CODEX_API_KEY` is supported for `codex exec` only. Do **not** export `OPENAI_API_KEY` or `CODEX_API_KEY` as a job-wide environment variable in workflows that also run untrusted/repo-controlled scripts — set the key only on the Codex step.

On GitHub Actions, OpenAI recommends [`openai/codex-action`](https://github.com/openai/codex-action) instead of installing the CLI and passing keys into a shell step.
