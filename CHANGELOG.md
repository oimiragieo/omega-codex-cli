# Changelog

## [Unreleased]

- **Models**: Added `references/models.md` with current Codex model IDs (`gpt-5.5`, `gpt-5.4-mini`, etc.) and deprecation notes; updated README, SKILL, and headless docs.
- **ask-codex**: `--json` now extracts final response text via `format-output.mjs` (falls back to raw JSONL); large prompts use `codex exec -` with stdin piping.
- **verify-setup**: Reports parsed Codex CLI version and points to `codex doctor` for auth/update checks.
- **Tests**: Added `format-output.test.mjs`, large-prompt stdin routing, stdin byte-limit rejection, and JSON extraction integration coverage.
- **Docs**: Reconciled Copilot CLI reference (separate from this wrapper); removed erroneous unreleased changelog entries about Claude model validation.

- **Code cleanup**: Removed `shell-escape.mjs` and `tests/shell-escape.test.mjs` — dead code never imported by `ask-codex.mjs`.
- **New scripts**: `parse-args.mjs` (pure arg parser, exported for testing) and `format-output.mjs` (pure JSON extractor, exported for testing). Both split from `ask-codex.mjs` to enable isolated unit testing without spawning processes.
- **Tests**: Added `tests/ask-codex.integration.test.mjs` to verify end-to-end `ask-codex.mjs` behavior with a stub Codex CLI (flag forwarding, JSON envelope behavior, warning on invalid JSON, and non-zero exit propagation).
- **Tooling**: Updated `npm test` to run all `tests/*.test.mjs`; added `test:ci` and `changelog:check` scripts.
- **CI**: Added `scripts/check-changelog.mjs` to enforce changelog policy on every push/PR.

- **ask-codex hardening**: Removed shell-based Windows invocation; now uses direct process spawning with Windows/non-Windows executable fallback (`codex` then `npx @openai/codex`).
- **New flags**: Added `--sandbox`, `--timeout-ms`, and `--help` support in `ask-codex.mjs`.
- **Validation**: Added strict CLI option parsing with clear errors for unknown options and invalid/missing values.
- **Tests**: Added `tests/ask-codex.test.mjs` for argument parsing and command construction; `npm test` now runs both test suites.
- **Docs sync**: Updated README and headless skill docs to reflect supported flags and runtime behavior.
- **Reliability docs**: Added explicit failure-handling guidance for host shell runtime errors (for example `@lydell/node-pty` on Windows) and documented troubleshooting steps in `references/installation.md`.
- **Input safety**: Added stdin size guard in `ask-codex.mjs` (default 50 MB, configurable via `ASK_CODEX_MAX_STDIN_BYTES`) to prevent unbounded memory use.
- **Timeout behavior**: Hardened Windows timeout termination path to wait for `taskkill` completion before finalizing process result; timeout remains exit code `124`.
- **Skill docs**: Reduced `.agents/skills/omega-codex-cli/SKILL.md` duplication by delegating to canonical `.claude/skills/omega-codex-cli/SKILL.md`.

## 2.0.0 — Portable headless skill (no MCP)

- **Headless-only**: Portable `.claude` skill that runs the Codex CLI in headless mode via scripts. No MCP server or MCP configuration required.
- **Scripts**: Added `ask-codex.mjs` (prompt, `--model`, `--json`) and `verify-setup.mjs` (Node + Codex CLI check).
- **Commands**: /analyze, /sandbox, /brainstorm, /omega-codex, /omega-codex-setup—all invoke the headless script or verify-setup from the project root.
- **References**: installation, auth, headless, copy-and-run, cursor, codex, antigravity, vscode, copilot-cli.
- **Copy-and-run**: Documented what to copy (`.claude` and optionally `.cursor`, `.agents`, `.agent`, `.vscode`) and that paths are relative to the project root.
