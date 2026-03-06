# Omega Codex CLI

> Portable headless skill for running OpenAI Codex CLI from Claude Code, Cursor, Antigravity, and VS Code — no MCP server required.

A zero-dependency Node.js wrapper that lets any agent platform invoke **Codex CLI** in non-interactive mode. Copy one folder into your project, run one verification step, and every supported agent surface can call Codex headlessly for analysis, brainstorming, and sandboxed workspace operations.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [CLI Reference](#cli-reference)
- [Configuration](#configuration)
- [Integration Guides](#integration-guides)
- [Deploying to Another Project](#deploying-to-another-project)
- [Usage Examples](#usage-examples)
- [Slash Commands](#slash-commands)
- [Development](#development)
- [Repository Structure](#repository-structure)
- [Resources](#resources)
- [License](#license)

---

## Features

- **Headless execution** — runs `codex exec "…" --skip-git-repo-check` non-interactively
- **Cross-platform** — Windows (`cmd.exe` wrapper) and Unix/macOS (direct spawn) handled automatically
- **Automatic fallback** — tries global `codex` binary, falls back to `npx -y @openai/codex` if not found
- **Model selection** — pass any Codex-compatible model ID via `--model`
- **JSON output** — JSONL event stream extraction for automation pipelines
- **Sandbox mode** — enables `--sandbox workspace-write` for safe file mutation
- **Timeout control** — wrapper-side `--timeout-ms` with exit code `124` on expiry
- **Stdin support** — pipe large prompts from files or other commands (50 MB default limit)
- **Zero runtime dependencies** — pure Node.js stdlib; no `npm install` needed to run
- **Multi-surface** — same script shared by Claude Code, Cursor, Antigravity, and VS Code

---

## Prerequisites

| Requirement | Minimum version | Install                          |
| ----------- | --------------- | -------------------------------- |
| Node.js     | 18+             | [nodejs.org](https://nodejs.org) |
| Codex CLI   | latest          | `npm install -g @openai/codex`   |

Codex CLI requires a one-time sign-in. Run `codex` (or `codex login`) in a terminal and complete the authentication flow; credentials are cached and reused by all subsequent headless calls.

---

## Installation

### 1. Install Codex CLI

```bash
npm install -g @openai/codex
```

Or use without a global install — the wrapper automatically falls back to `npx -y @openai/codex`.

### 2. One-time authentication

```bash
codex
# or
codex login
# Complete the sign-in prompt. This only needs to happen once.
```

### 3. Copy the skill into your project

```bash
# From the omega-codex-cli repo root:
cp -r .claude /path/to/your-project/
```

The `.claude` folder is the **only required piece**. All other folders (`.agents`, `.agent`, `.cursor`, `.vscode`) are optional integration shims for specific platforms.

### 4. Verify the setup

```bash
cd /path/to/your-project
node .claude/skills/omega-codex-cli/scripts/verify-setup.mjs
```

Expected output when everything is ready:

```
OK  Node: v20.11.1
OK  Codex CLI: found
Headless mode ready. Use scripts/ask-codex.mjs to run Codex.
```

---

## Quick Start

From your **project root** (the directory containing `.claude`):

```bash
# Ask Codex a question
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs "Summarize this repository in three bullet points"

# Review a file
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs "Review src/index.js for potential bugs"

# Generate ideas
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs "Brainstorm 5 ways to improve CLI onboarding"

# Run with sandbox file-write access
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs "Fix the linting errors in this file" --sandbox
```

---

## CLI Reference

### Syntax

```
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs "PROMPT" [OPTIONS]
```

The `PROMPT` argument is required unless you are piping input from stdin.

### Options

| Option         | Short | Type                | Default       | Description                                                                                            |
| -------------- | ----- | ------------------- | ------------- | ------------------------------------------------------------------------------------------------------ |
| `PROMPT`       | —     | string (positional) | required      | The question or task for Codex.                                                                        |
| `--model`      | `-m`  | string              | Codex default | Model to use. Forwarded directly to `codex exec --model`.                                              |
| `--json`       | —     | boolean             | `false`       | Enable JSONL event stream output. The wrapper extracts the final response text automatically.          |
| `--sandbox`    | —     | boolean             | `false`       | Enable workspace-write sandbox mode (`--sandbox workspace-write`). Allows Codex to write files safely. |
| `--timeout-ms` | —     | integer             | `0` (none)    | Abort after N milliseconds. Exit code `124` on timeout. Must be a positive integer.                    |
| `--help`       | `-h`  | boolean             | `false`       | Print usage and exit.                                                                                  |
| `--`           | —     | sentinel            | —             | Everything after `--` is treated as part of the prompt. Useful when the prompt starts with `-`.        |

### Input methods

```bash
# Positional argument (most common)
node ask-codex.mjs "Your prompt here"

# Stdin pipe
echo "Your prompt" | node ask-codex.mjs

# Pipe a file for review
cat src/main.js | node ask-codex.mjs "Review this code for security issues"

# Prompt containing flag-like text
node ask-codex.mjs -- --this-is-not-a-flag but-it-is-the-prompt
```

### Direct CLI equivalent

The wrapper runs the following under the hood:

```bash
codex exec "PROMPT" --skip-git-repo-check
# With optional additions:
#   --model gpt-5-mini
#   --model gpt-5.3-codex
#   --json
#   --sandbox workspace-write
```

### Exit codes

| Code  | Meaning                                                 |
| ----- | ------------------------------------------------------- |
| `0`   | Success                                                 |
| `1`   | Error (CLI not found, invalid arguments, parse failure) |
| `2+`  | Codex CLI exit code propagated                          |
| `124` | Timeout (`--timeout-ms` exceeded)                       |

---

## Configuration

### Environment variables

| Variable                    | Default            | Description                                                                                                                                          |
| --------------------------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ASK_CODEX_MAX_STDIN_BYTES` | `52428800` (50 MB) | Maximum bytes accepted from stdin. Prompts exceeding this limit are rejected with exit code `1`. Set to a higher value when piping very large files. |

---

## Integration Guides

### Claude Code

Claude Code automatically discovers `.claude/skills/`. Use the built-in slash commands:

```
/analyze    Review this README for completeness
/brainstorm 5 ideas for improving developer onboarding
/sandbox    Fix the imports in this file
/omega-codex-setup
```

Or invoke the script directly from a Claude Code task prompt:

```bash
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs "YOUR PROMPT"
```

### Cursor IDE

Cursor reads `.claude/skills/` automatically. The `.cursor/rules/` files additionally route natural-language requests through the headless script.

1. Copy `.claude/` and `.cursor/` into your project.
2. In the Cursor agent, say: **"ask Codex to review this file"** — Cursor routes the request to `ask-codex.mjs`.

### Codex CLI (native)

Codex discovers skills under `.agents/skills/`. When used as a skill host, Codex delegates tasks directly to the wrapper.

1. Copy `.claude/` and `.agents/` into your project.
2. Codex automatically routes "ask Codex" tasks through the registered skill.

### GitHub Copilot CLI

Use Copilot CLI headlessly and optionally select a backend model via `COPILOT_MODEL`:

```bash
copilot -p "Review this function for bugs"

# Select a specific model
COPILOT_MODEL="gpt-5" copilot -p "Review this function for bugs"

# Use the latest code-specialized model
COPILOT_MODEL="gpt-5.3-codex" copilot -p "Review this function for bugs"

# PowerShell
$env:COPILOT_MODEL="gpt-5"; copilot -p "Review this function"
$env:COPILOT_MODEL="gpt-5.3-codex"; copilot -p "Review this function"
```

See [references/copilot-cli.md](.claude/skills/omega-codex-cli/references/copilot-cli.md) for the full Copilot CLI reference.

### Antigravity IDE

Antigravity discovers skills under `.agent/skills/`.

1. Copy `.claude/` and `.agent/` into your project.
2. Use natural language in the Antigravity agent: **"use Codex to analyze the auth module"** — Antigravity runs `ask-codex.mjs`.

### VS Code

Two tasks are included in `.vscode/tasks.json`:

1. Copy `.claude/` and `.vscode/` into your project.
2. Open the Command Palette → **Tasks: Run Task**.
3. Select **Ask Codex** — enter a prompt when prompted. Output appears in the integrated terminal.
4. Select **Omega Codex: Verify setup** to check Node and CLI availability.

---

## Deploying to Another Project

### Minimum (required for all platforms)

```bash
cp -r omega-codex-cli/.claude /path/to/target-project/
```

This alone is sufficient for **Claude Code**, **Cursor**, and **GitHub Copilot CLI**.

### Full suite (optional, platform-specific)

```bash
# Codex CLI skill host
cp -r omega-codex-cli/.agents /path/to/target-project/

# Antigravity IDE
cp -r omega-codex-cli/.agent /path/to/target-project/

# VS Code tasks
cp -r omega-codex-cli/.vscode /path/to/target-project/
```

After copying, run the verification script from the target project root:

```bash
cd /path/to/target-project
node .claude/skills/omega-codex-cli/scripts/verify-setup.mjs
```

---

## Usage Examples

### Analysis and code review

```bash
# Summarize a project
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs \
  "List the main purpose of this project and its top-level folders in 3 short bullet points."

# Review a specific file
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs \
  "Review src/auth.js for security vulnerabilities and suggest fixes."

# Explain a concept
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs \
  "Explain the tradeoffs between REST and GraphQL for a real-time dashboard."
```

### Brainstorming

```bash
# General brainstorm
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs \
  "Brainstorm 5 ways to improve a CLI tool's first-run experience. One sentence each."

# Specific challenge
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs \
  "Generate 3 API design patterns for high-throughput event ingestion."
```

### Sandbox mode (file writes)

```bash
# Allow Codex to write to the workspace
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs \
  "Fix the ESLint errors in src/utils.js" \
  --sandbox

# Generate and save a test file
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs \
  "Create a Jest test file for the UserService class" \
  --sandbox
```

### Model selection

```bash
# Use a specific model
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs \
  "Summarize this diff" \
  --model gpt-5-mini

# Use gpt-5
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs \
  "Deep architectural review" \
  --model gpt-5

# Use the latest code-specialized model (March 2026)
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs \
  "Deep architectural review" \
  --model gpt-5.3-codex
```

### JSON output for automation

```bash
# Returns JSONL event stream, wrapper extracts final response
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs \
  "Extract all exported function names from this module" \
  --json

# Parse the output
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs \
  "Summarize in one sentence" \
  --json | jq -r '.'
```

### Stdin input

```bash
# Pipe a file for review
cat README.md | node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs \
  "What sections are missing from this README?"

# Generate a commit message from a diff
git diff --cached | node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs \
  "Write a concise conventional commit message for these changes."
```

### Timeout for CI/CD

```bash
# Fail fast after 30 seconds
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs \
  "Validate this config file" \
  --timeout-ms 30000

# Check exit code
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs "..." --timeout-ms 10000
if [ $? -eq 124 ]; then echo "Codex timed out"; fi
```

### Combining options

```bash
node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs \
  "Analyze this codebase and list the top 3 security risks" \
  --model gpt-5.3-codex \
  --json \
  --timeout-ms 60000
```

### GitHub Actions CI/CD integration

```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'

- name: Install Codex CLI
  run: npm install -g @openai/codex

- name: Authenticate Codex CLI
  run: codex login
  env:
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}

- name: Verify setup
  run: node .claude/skills/omega-codex-cli/scripts/verify-setup.mjs

- name: Run AI code review
  run: |
    node .claude/skills/omega-codex-cli/scripts/ask-codex.mjs \
      "Review the PR diff for security issues and breaking changes" \
      --model gpt-5.3-codex \
      --json
```

---

## Slash Commands

When using **Claude Code**, the following slash commands are available:

| Command                                          | Description                                                                       |
| ------------------------------------------------ | --------------------------------------------------------------------------------- |
| `/analyze [prompt or @file …]`                   | Analyze files or answer questions with Codex. Supports `@file` references.        |
| `/brainstorm [challenge] [methodology] [domain]` | Generate ideas. Optionally specify a method (SCAMPER, design thinking) or domain. |
| `/sandbox [prompt or @file …]`                   | Run Codex with workspace-write sandbox enabled.                                   |
| `/omega-codex [request]`                         | Flexible entry point: routes to analysis or brainstorm as appropriate.            |
| `/omega-codex-setup`                             | Verify Node.js and Codex CLI are installed and authenticated.                     |

---

## Development

### Running tests

```bash
npm test
```

Tests are written for the Node.js native test runner (`node:test`). Coverage includes:

- **Unit tests** (`tests/ask-codex.test.mjs`) — argument parsing, command construction, platform-specific executable selection, unknown option rejection.
- **Integration tests** (`tests/ask-codex.integration.test.mjs`) — end-to-end spawning with a stub Codex CLI, timeout handling (exit code `124`), stdin forwarding, JSON envelope extraction, non-zero exit propagation.

### CI gate

```bash
npm run test:ci
# Runs: tests + eslint + prettier check + changelog format check
```

### Linting and formatting

```bash
npm run lint:fix      # ESLint with auto-fix
npm run format        # Prettier (in-place)
npm run format:check  # Prettier (check only, used in CI)
```

### GitHub Actions

The CI workflow runs on push and pull requests against Node.js **20**.

### Changelog policy

Every pull request must add at least one entry under `## [Unreleased]` in `CHANGELOG.md`. CI enforces this:

```bash
npm run changelog:check
```

---

## Repository Structure

```
omega-codex-cli/
├── .claude/                                  # Required — shared skill runtime
│   ├── commands/                             # Claude Code slash commands
│   │   ├── analyze.md
│   │   ├── brainstorm.md
│   │   ├── sandbox.md
│   │   ├── omega-codex.md
│   │   └── omega-codex-setup.md
│   └── skills/omega-codex-cli/
│       ├── SKILL.md                          # Skill definition and trigger rules
│       ├── scripts/
│       │   ├── ask-codex.mjs                 # Main headless wrapper
│       │   ├── parse-args.mjs                # Pure CLI argument parser (exported)
│       │   ├── format-output.mjs             # JSONL response extractor (exported)
│       │   └── verify-setup.mjs              # Node + CLI pre-flight check
│       └── references/                       # Reference documentation
│           ├── headless.md                   # Full headless CLI guide
│           ├── installation.md               # Node + Codex CLI setup
│           ├── auth.md                       # Authentication troubleshooting
│           ├── copy-and-run.md               # Portability guide
│           ├── codex.md                      # Codex CLI integration
│           ├── cursor.md                     # Cursor IDE integration
│           ├── antigravity.md                # Antigravity IDE integration
│           ├── copilot-cli.md                # GitHub Copilot CLI guide
│           └── vscode.md                     # VS Code tasks guide
├── .agents/skills/omega-codex-cli/           # Codex CLI skill entrypoint
├── .agent/skills/omega-codex-cli/            # Antigravity IDE skill entrypoint
├── .cursor/rules/                            # Cursor routing rules
│   ├── omega-codex-cli.mdc
│   └── omega-codex-tools.mdc
├── .vscode/tasks.json                        # VS Code Ask/Verify tasks
├── tests/
│   ├── ask-codex.test.mjs                    # Unit tests
│   └── ask-codex.integration.test.mjs        # Integration tests
├── scripts/
│   └── check-changelog.mjs                   # CI changelog validator
├── package.json
├── CHANGELOG.md
├── LICENSE
└── README.md
```

---

## Resources

- [Codex — Agent Skills](https://developers.openai.com/codex/skills/)
- [Claude Code — Extend Claude with skills](https://code.claude.com/docs/en/skills)
- [Cursor — Agent Skills](https://cursor.com/docs/context/skills)
- [GitHub Copilot — About Agent Skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills)
- [VS Code — Use Agent Skills](https://code.visualstudio.com/docs/copilot/customization/agent-skills)

---

## License

[MIT License (Non-Commercial)](LICENSE). Commercial use requires prior written permission from the copyright holder.

**Disclaimer:** Unofficial, third-party tool. Not affiliated with, endorsed by, or sponsored by OpenAI.
