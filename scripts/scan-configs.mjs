// Supply-chain guard, run before every dev and build.
// Fails if any JS, TS, JSON or CSS file carries the payload shape from the July 2026 incident:
// code hidden after a long run of spaces, the loader strings, or the campaign tag.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.cwd();
const SKIP = new Set(["node_modules", ".next", ".git", "data", "docs", "templates"]);
const EXT = new Set([".js", ".mjs", ".cjs", ".ts", ".tsx", ".json", ".css"]);
const BAD = [
  / {200,}\S/,
  /createRequire/,
  /String\.fromCharCode\(127\)/,
  /global\.[A-Za-z_$][\w$]*\s*=\s*['"]\d-\d+['"]/,
];

let hits = 0;
(function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name) || name.startsWith(".")) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p);
    else if (EXT.has(extname(name)) && name !== "scan-configs.mjs") {
      const text = readFileSync(p, "utf8");
      for (const r of BAD) if (r.test(text)) { console.error(`SUSPICIOUS ${p} matches ${r}`); hits++; }
    }
  }
})(ROOT);

if (hits) {
  console.error(`${hits} suspicious match(es). Do not run dev or build until reviewed.`);
  process.exit(1);
}
console.log("scan: clean");
