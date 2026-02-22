#!/usr/bin/env node
/**
 * Minimal changelog policy check for CI:
 * - CHANGELOG.md must exist
 * - must contain an [Unreleased] section
 * - [Unreleased] must contain at least one bullet item
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';

const CHANGELOG_PATH = path.resolve('CHANGELOG.md');

function fail(message) {
  console.error(`CHANGELOG CHECK FAILED: ${message}`);
  process.exit(1);
}

let content = '';
try {
  content = readFileSync(CHANGELOG_PATH, 'utf8');
} catch {
  fail('CHANGELOG.md is missing.');
}

if (!/\n## \[Unreleased\]/.test(content)) {
  fail('Missing "## [Unreleased]" section.');
}

const unreleasedMatch = content.match(/## \[Unreleased\]([\s\S]*?)(\n## |\s*$)/);
if (!unreleasedMatch) {
  fail('Could not parse the [Unreleased] section.');
}

const unreleasedBody = unreleasedMatch[1];
if (!/^\s*-\s+/m.test(unreleasedBody)) {
  fail('The [Unreleased] section must include at least one bullet item.');
}

console.log('CHANGELOG check passed.');
