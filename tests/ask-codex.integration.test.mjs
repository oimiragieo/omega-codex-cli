/**
 * Integration tests for ask-codex.mjs.
 * Creates a stub codex executable and runs the wrapper end-to-end.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const SCRIPT_PATH = path.resolve('.claude/skills/omega-codex-cli/scripts/ask-codex.mjs');

function makeCodexStubDir() {
  const dir = mkdtempSync(path.join(tmpdir(), 'codex-stub-'));
  const stubJsPath = path.join(dir, 'codex-stub.mjs');
  const shimPath = path.join(dir, process.platform === 'win32' ? 'codex.cmd' : 'codex');

  writeFileSync(
    stubJsPath,
    `#!/usr/bin/env node
const mode = process.env.CODEX_STUB_MODE || 'echo';
const args = process.argv.slice(2);
if (mode === 'jsonl') {
  process.stdout.write('{"type":"message","text":"stub response"}\\n');
} else if (mode === 'error') {
  process.stderr.write('stub failure');
  process.exit(2);
} else if (mode === 'sleep') {
  setTimeout(() => {
    process.stdout.write('done');
  }, Number.parseInt(process.env.CODEX_STUB_SLEEP_MS || '1000', 10));
} else {
  process.stdout.write(JSON.stringify({ args }));
}
`
  );

  if (process.platform === 'win32') {
    writeFileSync(shimPath, `@echo off\r\n"${process.execPath}" "${stubJsPath}" %*\r\n`);
  } else {
    writeFileSync(shimPath, `#!/usr/bin/env bash\n"${process.execPath}" "${stubJsPath}" "$@"\n`);
    chmodSync(shimPath, 0o755);
  }

  return dir;
}

function runAskCodex(args, mode, extraEnv = {}) {
  const stubDir = makeCodexStubDir();
  const env = {
    ...process.env,
    CODEX_STUB_MODE: mode,
    ...extraEnv,
    PATH: `${stubDir}${path.delimiter}${process.env.PATH || ''}`,
  };

  const result = spawnSync(process.execPath, [SCRIPT_PATH, ...args], {
    cwd: path.resolve('.'),
    env,
    encoding: 'utf8',
    timeout: 10000,
  });

  rmSync(stubDir, { recursive: true, force: true });
  return result;
}

describe('ask-codex integration', () => {
  it('forwards prompt and required flags to codex', () => {
    const result = runAskCodex(['hello world'], 'echo');

    assert.equal(result.status, 0);
    const parsed = JSON.parse(result.stdout);
    assert.deepEqual(parsed.args, ['exec', 'hello world', '--skip-git-repo-check']);
  });

  it('forwards --json flag to codex', () => {
    const result = runAskCodex(['--json', 'prompt text'], 'echo');

    assert.equal(result.status, 0);
    const parsed = JSON.parse(result.stdout);
    assert.deepEqual(parsed.args, ['exec', 'prompt text', '--skip-git-repo-check', '--json']);
  });

  it('passes through JSONL output in --json mode', () => {
    const result = runAskCodex(['--json', 'prompt text'], 'jsonl');

    assert.equal(result.status, 0);
    assert.match(result.stdout, /stub response/);
  });

  it('propagates codex non-zero exit and stderr', () => {
    const result = runAskCodex(['prompt text'], 'error');

    assert.equal(result.status, 2);
    assert.match(result.stderr, /stub failure/);
  });

  it('reads prompt from stdin when no arg provided', () => {
    const stubDir = makeCodexStubDir();
    const env = {
      ...process.env,
      CODEX_STUB_MODE: 'echo',
      PATH: `${stubDir}${path.delimiter}${process.env.PATH || ''}`,
    };

    const result = spawnSync(process.execPath, [SCRIPT_PATH], {
      cwd: path.resolve('.'),
      env,
      encoding: 'utf8',
      input: 'prompt from stdin',
      timeout: 10000,
    });

    rmSync(stubDir, { recursive: true, force: true });

    assert.equal(result.status, 0);
    const parsed = JSON.parse(result.stdout);
    assert.deepEqual(parsed.args, ['exec', 'prompt from stdin', '--skip-git-repo-check']);
  });

  it('returns 124 when codex request times out', () => {
    const start = Date.now();
    const result = runAskCodex(['--timeout-ms', '50', 'prompt text'], 'sleep', {
      CODEX_STUB_SLEEP_MS: '2000',
    });

    assert.equal(result.status, 124);
    assert.match(result.stderr, /timed out/i);
    assert.ok(Date.now() - start < 1500);
  });
});
