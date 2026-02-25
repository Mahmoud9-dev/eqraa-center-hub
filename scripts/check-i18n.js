#!/usr/bin/env node
/**
 * i18n hardcoded-string guard
 *
 * Scans app/, src/views/, and src/components/ for JSX text nodes that appear
 * to contain Arabic characters, flagging likely untranslated UI strings.
 *
 * Usage:
 *   node scripts/check-i18n.js
 *   node scripts/check-i18n.js --strict   # exit 1 if any issues found
 *
 * False-positive exclusions:
 *   - Lines containing useLanguage, tFunc, t.    (already translated)
 *   - Import statements
 *   - Comments
 *   - Data files (translations.ts, i18n/ directory)
 *   - Supabase CHECK constraint strings in constants.ts
 *   - Lines marked with //  i18n-ignore
 */

import { readdir, readFile } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

const SCAN_DIRS = ['app', 'src/views', 'src/components'];
const EXTENSIONS = new Set(['.tsx', '.ts', '.jsx', '.js']);

const EXCLUDE_PATHS = [
  'src/lib/translations.ts',
  'src/lib/i18n',
  'src/lib/constants.ts',
  'src/integrations',
  'node_modules',
  '.next',
];

const ARABIC_REGEX = /[\u0600-\u06FF\u0750-\u077F]/;

/**
 * Lines that are considered safe even if they contain Arabic:
 *   - The line is an import statement
 *   - The line is a comment
 *   - The line contains a tFunc call or t. access (already going through i18n)
 *   - The line has the i18n-ignore annotation
 *   - The line is data (e.g. inside a const string assignment in a data file)
 */
function isSafe(line) {
  const trimmed = line.trim();
  if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) return true;
  if (trimmed.startsWith('import ')) return true;
  if (trimmed.includes('tFunc(')) return true;
  if (trimmed.includes('t.')) return true;
  if (trimmed.includes('// i18n-ignore')) return true;
  // DB constant references (value in Arabic but kept canonical)
  if (trimmed.includes('ATTENDANCE_STATUS') || trimmed.includes('NOTE_TYPES')) return true;
  return false;
}

async function* walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (EXCLUDE_PATHS.some((ex) => full.includes(ex))) continue;
    if (entry.isDirectory()) {
      yield* walk(full);
    } else if (EXTENSIONS.has(extname(entry.name))) {
      yield full;
    }
  }
}

async function audit() {
  const isStrict = process.argv.includes('--strict');
  const issues = [];

  for (const scanDir of SCAN_DIRS) {
    const absDir = join(ROOT, scanDir);
    try {
      for await (const file of walk(absDir)) {
        const rel = file.replace(ROOT + '/', '');
        const content = await readFile(file, 'utf-8');
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
          if (ARABIC_REGEX.test(line) && !isSafe(line)) {
            issues.push({ file: rel, line: idx + 1, text: line.trim() });
          }
        });
      }
    } catch {
      // directory may not exist in all environments
    }
  }

  if (issues.length === 0) {
    console.log('✅ i18n audit: no hardcoded Arabic strings found.');
    return;
  }

  console.warn(`\n⚠️  i18n audit: ${issues.length} potential hardcoded Arabic string(s) found:\n`);
  for (const { file, line, text } of issues) {
    console.warn(`  ${file}:${line}`);
    console.warn(`    ${text.slice(0, 120)}\n`);
  }

  if (isStrict) {
    process.exit(1);
  }
}

audit().catch((err) => {
  console.error('i18n audit error:', err);
  process.exit(1);
});
