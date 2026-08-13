#!/usr/bin/env node
/**
 * Verify omega-codex-cli headless setup: Node and Codex CLI only. No MCP required.
 * Exit 0 if all OK, 1 otherwise. Read-only.
 * Usage: node verify-setup.mjs
 */
import { execSync } from 'child_process';

const MIN_NODE_MAJOR = 18;

function checkNode() {
  const v = process.version.slice(1).split('.')[0];
  const major = parseInt(v, 10);
  if (major >= MIN_NODE_MAJOR) return { ok: true };
  return { ok: false, message: `Node ${MIN_NODE_MAJOR}+ required; current: ${process.version}` };
}

function parseCodexVersion(output) {
  const match = String(output).match(/(\d+)\.(\d+)\.(\d+)/);
  if (!match) return null;
  return {
    major: Number.parseInt(match[1], 10),
    minor: Number.parseInt(match[2], 10),
    patch: Number.parseInt(match[3], 10),
    raw: match[0],
  };
}

function checkCodexCLI() {
  try {
    const out = execSync('codex --version', { stdio: 'pipe', timeout: 5000, encoding: 'utf8' });
    return { ok: true, how: 'codex', version: parseCodexVersion(out) };
  } catch {
    try {
      const out = execSync('npx -y @openai/codex --version', {
        stdio: 'pipe',
        timeout: 15000,
        encoding: 'utf8',
      });
      return { ok: true, how: 'npx @openai/codex', version: parseCodexVersion(out) };
    } catch {
      return {
        ok: false,
        message:
          'Codex CLI not found. Install: npm install -g @openai/codex or use npx @openai/codex',
      };
    }
  }
}

function main() {
  const report = [];
  let allOk = true;

  const nodeResult = checkNode();
  if (nodeResult.ok) {
    report.push('OK Node: ' + process.version);
  } else {
    report.push('MISSING Node: ' + nodeResult.message);
    allOk = false;
  }

  const codexResult = checkCodexCLI();
  if (codexResult.ok) {
    const versionLabel = codexResult.version ? ` (${codexResult.version.raw})` : '';
    report.push('OK Codex CLI: ' + (codexResult.how || 'found') + versionLabel);
    report.push(
      'Models: see references/models.md — use gpt-5.6-sol by default; update the CLI if newer models are missing.'
    );
    report.push('Tip: run `codex doctor` to check auth, PATH, and available updates.');
  } else {
    report.push('MISSING Codex CLI: ' + codexResult.message);
    allOk = false;
  }

  report.push('Headless mode: no MCP config required. Use scripts/ask-codex.mjs to run codex.');
  report.push('Auth: run `codex login` (or `codex`) once if prompted, then retry.');

  console.log(report.join('\n'));
  process.exit(allOk ? 0 : 1);
}

main();
