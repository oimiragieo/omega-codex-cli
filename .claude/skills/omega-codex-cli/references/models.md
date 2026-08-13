# Codex model IDs

Model availability changes over time. See the official guide for the current list:

- [Codex models](https://developers.openai.com/codex/models)
- [Codex changelog](https://developers.openai.com/codex/changelog)

Verified against OpenAI docs (August 2026). Prefer the GPT-5.6 family for ChatGPT sign-in.

## Recommended models (August 2026)

| Model ID              | When to use                                                                    |
| --------------------- | ------------------------------------------------------------------------------ |
| `gpt-5.6-sol`         | Default for complex coding, computer use, knowledge work, and research         |
| `gpt-5.6-terra`       | Everyday workhorse; strong reasoning at lower cost (prior `gpt-5.5` workflows) |
| `gpt-5.6-luna`        | Faster, lower-cost scans, subagents, and high-volume structured tasks          |
| `gpt-5.3-codex-spark` | ChatGPT Pro only — near-instant text-only iteration (research preview)         |

Omit `--model` to use Codex's recommended default for your account. In `~/.codex/config.toml` you can set `model = "gpt-5.6"` (alias) or a specific ID such as `gpt-5.6-sol`.

## Previous-generation (still listed)

| Model ID       | Notes                                                                  |
| -------------- | ---------------------------------------------------------------------- |
| `gpt-5.5`      | Prior frontier model; prefer `gpt-5.6-sol` / `gpt-5.6-terra`           |
| `gpt-5.4`      | Retires from Codex ChatGPT sign-in on **2026-08-31** → `gpt-5.6-terra` |
| `gpt-5.4-mini` | Retires from Codex ChatGPT sign-in on **2026-08-31** → `gpt-5.6-luna`  |

API-key auth is not affected by the GPT-5.4 ChatGPT retirement — check the [API models page](https://developers.openai.com/api/docs/models) for your auth mode.

## Deprecated for ChatGPT sign-in

OpenAI has deprecated `gpt-5.3-codex` and `gpt-5.2` for users who sign in with ChatGPT. Update scripts and CI that still pin those IDs.

## Headless usage

```bash
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs "Review this module" --model gpt-5.6-sol
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs "Scan for TODOs" --model gpt-5.6-luna
```

Equivalent direct CLI:

```bash
codex exec "Review this module" --skip-git-repo-check --model gpt-5.6-sol
```
