import fs from "fs";
import path from "path";

const root = path.join(import.meta.dirname, "..", "src");

function walk(dir, out) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (/\.(jsx?|tsx?|css)$/.test(ent.name)) out.push(p);
  }
}

const files = [];
walk(root, files);
let updated = 0;
for (const f of files) {
  let s = fs.readFileSync(f, "utf8");
  const next = s.replace(/--wedding-/g, "-wedding-");
  if (next !== s) {
    fs.writeFileSync(f, next);
    updated += 1;
  }
}
console.log(`Fixed ${updated} files`);
