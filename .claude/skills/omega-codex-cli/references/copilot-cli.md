# GitHub Copilot CLI (separate from this wrapper)

This repo's scripts invoke **OpenAI Codex CLI**, not GitHub Copilot CLI. Keep Copilot usage independent from `ask-codex.mjs`.

If you also use Copilot CLI headlessly in the same project, select its backend model with `COPILOT_MODEL`:

```bash
copilot -p "Review this function for bugs"

# Example explicit model (verify against your Copilot account)
COPILOT_MODEL="gpt-5.5" copilot -p "Review this function for bugs"
```

PowerShell:

```powershell
$env:COPILOT_MODEL="gpt-5.5"; copilot -p "Review this function"
```

See [GitHub Copilot CLI documentation](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) for current model names and auth.
