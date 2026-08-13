# Installation

1. Install Node.js 18+.
2. Install Codex CLI (any one of):

```bash
# npm (also what this wrapper falls back to via npx)
npm install -g @openai/codex

# Official installer (macOS / Linux)
curl -fsSL https://chatgpt.com/codex/install.sh | sh

# Homebrew
brew install --cask codex
```

Windows PowerShell installer: `irm https://chatgpt.com/codex/install.ps1 | iex`

3. Verify:

```bash
node .claude/skills/omega-codex-cli/scripts/verify-setup.mjs
```

4. If prompted, authenticate with:

```bash
codex login
```

5. Keep the CLI current (`npm` package `@openai/codex`, currently tracked against 0.147.x docs):

```bash
npm install -g @openai/codex@latest
# or
codex update
```
