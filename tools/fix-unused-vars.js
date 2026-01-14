const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runEslintJson() {
  try {
    const out = execSync('npx eslint "src/**/*.{js,jsx}" -f json', { encoding: 'utf8' });
    return JSON.parse(out);
  } catch (err) {
    // eslint may exit non-zero; try to parse stdout if present
    const out = err.stdout || err.message;
    try {
      return JSON.parse(out);
    } catch (e) {
      console.error('Failed to parse eslint output', e);
      return [];
    }
  }
}

function prefixIdentifierInLine(filePath, lineNumber, identifier) {
  const abs = path.resolve(filePath);
  const content = fs.readFileSync(abs, 'utf8');
  const lines = content.split(/\r?\n/);
  const idx = lineNumber - 1;
  if (idx < 0 || idx >= lines.length) return false;

  const line = lines[idx];
  // Replace only whole-word occurrences on this line with underscored name
  const re = new RegExp('\\b' + identifier.replace(/[$^\\.*+?()[\]{}|]/g, '\\$&') + '\\b', 'g');
  if (!re.test(line)) return false;

  lines[idx] = line.replace(re, `_${identifier}`);
  fs.writeFileSync(abs, lines.join('\n'), 'utf8');
  return true;
}

function fix() {
  const results = runEslintJson();
  const modified = new Set();
  for (const fileResult of results) {
    const file = fileResult.filePath || fileResult.file;
    for (const msg of fileResult.messages || []) {
      if (msg.ruleId !== 'unused-imports/no-unused-vars') continue;
      const m = msg.message.match(/'([^']+)' is assigned a value but never used/);
      if (!m) continue;
      const id = m[1];
      const fixed = prefixIdentifierInLine(file, msg.line, id);
      if (fixed) modified.add(file);
    }
  }

  console.log('Modified files:', Array.from(modified));
}

fix();
