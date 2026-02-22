/**
 * Unit tests for ask-codex.mjs arg parsing and command construction.
 * Run from repo root: node --test tests/ask-codex.test.mjs
 */
import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  assertNonEmptyPrompt,
  parseCliArgs,
} from '../.claude/skills/omega-codex-cli/scripts/parse-args.mjs';
import {
  buildCodexArgs,
  getExecutables,
} from '../.claude/skills/omega-codex-cli/scripts/ask-codex.mjs';

describe('parseCliArgs', () => {
  it('parses prompt and options', () => {
    const opts = parseCliArgs(['review this', '--model', 'gpt-5', '--json', '--sandbox']);
    assert.strictEqual(opts.prompt, 'review this');
    assert.strictEqual(opts.model, 'gpt-5');
    assert.strictEqual(opts.outputJson, true);
    assert.strictEqual(opts.sandbox, true);
  });

  it('parses timeout and help flags', () => {
    const opts = parseCliArgs(['--timeout-ms', '5000', '--help']);
    assert.strictEqual(opts.timeoutMs, 5000);
    assert.strictEqual(opts.help, true);
  });

  it('supports prompt after -- sentinel', () => {
    const opts = parseCliArgs(['--model', 'o3', '--', '--not-a-flag', 'value']);
    assert.strictEqual(opts.model, 'o3');
    assert.strictEqual(opts.prompt, '--not-a-flag value');
  });

  it('throws on unknown option', () => {
    assert.throws(() => parseCliArgs(['--nope']), /Unknown option/);
  });

  it('throws on invalid timeout', () => {
    assert.throws(() => parseCliArgs(['--timeout-ms', '0']), /Invalid value for --timeout-ms/);
  });

  it('throws when --model is missing value', () => {
    assert.throws(() => parseCliArgs(['--model']), /Missing value for --model/);
  });
});

describe('assertNonEmptyPrompt', () => {
  it('throws for empty prompt', () => {
    assert.throws(() => assertNonEmptyPrompt('  '), /Prompt is required/);
  });

  it('accepts non-empty prompt', () => {
    assert.doesNotThrow(() => assertNonEmptyPrompt('ok'));
  });
});

describe('buildCodexArgs', () => {
  it('constructs minimal args when only prompt provided', () => {
    const args = buildCodexArgs({ prompt: 'hi', model: '', outputJson: false, sandbox: false });
    assert.deepStrictEqual(args, ['exec', 'hi', '--skip-git-repo-check']);
  });

  it('constructs required args and optional flags', () => {
    const args = buildCodexArgs({
      prompt: 'analyze file',
      model: 'gpt-5',
      outputJson: true,
      sandbox: true,
    });
    assert.deepStrictEqual(args, [
      'exec',
      'analyze file',
      '--skip-git-repo-check',
      '--sandbox',
      'workspace-write',
      '--model',
      'gpt-5',
      '--json',
    ]);
  });
});

describe('getExecutables', () => {
  it('returns Windows-first candidates', () => {
    const candidates = getExecutables(['exec', 'x'], true);
    assert.strictEqual(candidates[0].executable, 'cmd.exe');
    assert.deepStrictEqual(candidates[0].args.slice(0, 4), ['/d', '/s', '/c', 'codex']);
    assert.strictEqual(candidates[1].executable, 'cmd.exe');
    assert.deepStrictEqual(candidates[1].args.slice(0, 6), [
      '/d',
      '/s',
      '/c',
      'npx',
      '-y',
      '@openai/codex',
    ]);
  });

  it('returns non-Windows candidates', () => {
    const candidates = getExecutables(['exec', 'x'], false);
    assert.strictEqual(candidates[0].executable, 'codex');
    assert.strictEqual(candidates[1].executable, 'npx');
  });
});
