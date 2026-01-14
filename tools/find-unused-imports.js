const fs = require("fs");
const path = require("path");
const glob = require("glob");

function listFiles() {
  return glob.sync("src/**/*.js", { nodir: true });
}

function parseImports(content) {
  const imports = [];
  const importRegex = /^import\s+([^;]+)\s+from\s+['"]([^'"]+)['"];?/gm;
  let m;
  while ((m = importRegex.exec(content))) {
    const clause = m[1].trim();
    const source = m[2];
    imports.push({ clause, source, index: m.index });
  }
  return imports;
}

function extractIdentifiers(clause) {
  clause = clause.trim();
  if (clause.startsWith("* as ")) {
    const id = clause.replace(/\* as\s+/, "").trim();
    return [id];
  }
  const parts = clause
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  const ids = [];
  // default import + named
  if (parts.length === 1 && parts[0].startsWith("{")) {
    // only named
  } else if (parts.length >= 1 && !parts[0].startsWith("{")) {
    // default import present
    ids.push(parts[0]);
  }
  // find named imports
  const namedMatch = clause.match(/\{([^}]+)\}/);
  if (namedMatch) {
    const names = namedMatch[1]
      .split(",")
      .map((s) => s.split("as")[0].trim())
      .filter(Boolean);
    ids.push(...names);
  }
  return ids;
}

function detect() {
  const files = listFiles();
  const results = [];
  for (const file of files) {
    const content = fs.readFileSync(file, "utf8");
    const imports = parseImports(content);
    const unused = [];
    for (const imp of imports) {
      // skip side effect imports
      if (!imp.clause || imp.clause === "") continue;
      const ids = extractIdentifiers(imp.clause);
      if (ids.length === 0) continue;
      let usedAny = false;
      for (const id of ids) {
        const re = new RegExp(
          "\\b" + id.replace(/[$^\\.*+?()[\]{}|]/g, "\\$&") + "\\b",
          "g",
        );
        // search in content after the import statement
        const after = content.slice(imp.index + 1);
        if (re.test(after)) {
          usedAny = true;
          break;
        }
      }
      if (!usedAny) {
        unused.push({ clause: imp.clause, source: imp.source, ids });
      }
    }
    if (unused.length) {
      results.push({ file, unused });
    }
  }
  return results;
}

const res = detect();
console.log(JSON.stringify(res, null, 2));
