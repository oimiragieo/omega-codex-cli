/**
 * Unit tests for format-output.mjs JSONL extraction.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { extractFinalMessageFromJsonl } from '../.claude/skills/omega-codex-cli/scripts/format-output.mjs';
import { formatCodexStdout } from '../.claude/skills/omega-codex-cli/scripts/ask-codex.mjs';

describe('extractFinalMessageFromJsonl', () => {
  it('reads top-level text field', () => {
    const stdout = '{"type":"message","text":"hello"}\n';
    assert.equal(extractFinalMessageFromJsonl(stdout), 'hello');
  });

  it('reads nested response.text', () => {
    const stdout = '{"response":{"text":"nested"}}\n';
    assert.equal(extractFinalMessageFromJsonl(stdout), 'nested');
  });

  it('returns the last text-bearing event', () => {
    const stdout = ['{"text":"first"}', '{"text":"second"}', '{"type":"done"}'].join('\n');
    assert.equal(extractFinalMessageFromJsonl(stdout), 'second');
  });

  it('returns empty string when no text is found', () => {
    assert.equal(extractFinalMessageFromJsonl('{"type":"done"}\n'), '');
  });
});

describe('formatCodexStdout', () => {
  it('passes through plain text when --json is false', () => {
    assert.equal(formatCodexStdout('plain output', false), 'plain output');
  });

  it('extracts final text when --json is true', () => {
    const stdout = '{"type":"message","text":"final answer"}\n';
    assert.equal(formatCodexStdout(stdout, true), 'final answer');
  });

  it('falls back to raw stdout when extraction finds nothing', () => {
    const stdout = '{"type":"done"}\n';
    assert.equal(formatCodexStdout(stdout, true), stdout);
  });
});
