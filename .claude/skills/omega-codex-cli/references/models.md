# Codex model IDs

Model availability changes over time. See the official guide for the current list:

- [Codex models](https://developers.openai.com/codex/models)
- [Codex changelog](https://developers.openai.com/codex/changelog)

## Recommended models (June 2026)

| Model ID              | When to use                                                            |
| --------------------- | ---------------------------------------------------------------------- |
| `gpt-5.5`             | Default for complex coding, computer use, knowledge work, and research |
| `gpt-5.4`             | Fallback when `gpt-5.5` is not yet in your account                     |
| `gpt-5.4-mini`        | Faster, lower-cost scans, subagents, and large-file review             |
| `gpt-5.3-codex-spark` | ChatGPT Pro only — near-instant text-only iteration (research preview) |

Omit `--model` to use Codex's recommended default for your account.

## Deprecated for ChatGPT sign-in

OpenAI has deprecated `gpt-5.3-codex` and `gpt-5.2` for users who sign in with ChatGPT. Update scripts and CI that still pin those IDs.

API-key workflows may still access some deprecated models — check the [API models page](https://developers.openai.com/api/docs/models) for your auth mode.

## Headless usage

```bash
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs "Review this module" --model gpt-5.5
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs "Scan for TODOs" --model gpt-5.4-mini
```

Equivalent direct CLI:

```bash
codex exec "Review this module" --skip-git-repo-check --model gpt-5.5
```
