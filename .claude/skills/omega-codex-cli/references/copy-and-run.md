# Copy and run

To reuse in another project, copy at least:

- `.claude/`

Optional surface adapters:

- `.agents/` for Codex
- `.agent/` for Antigravity
- `.cursor/` for Cursor
- `.vscode/` for VS Code tasks

Then run setup from the target project root:

```bash
node .claude/skills/omega-codex-cli/scripts/verify-setup.mjs
```
