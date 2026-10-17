import fs from "fs";
import path from "path";

const root = path.join(import.meta.dirname, "..", "src");
const map = [
  ["#4A1025", "wedding-ink-soft"],
  ["#6E1F3D", "wedding-wine-deep"],
  ["#5C0A20", "wedding-wine-deep"],
  ["#8A2648", "wedding-wine"],
  ["#7A1538", "wedding-wine"],
  ["#AD2E58", "wedding-wine-accent"],
  ["#9B1B4A", "wedding-wine-accent"],
  ["#4A0E17", "wedding-wine-deep"],
  ["#ED1E79", "wedding-rose"],
  ["#F7338B", "wedding-rose-bright"],
  ["#FFD6E0", "wedding-rose-light"],
  ["#FFF0F4", "wedding-ivory"],
  ["#FFE0EA", "wedding-ivory-deep"],
  ["#C9A962", "wedding-gold"],
  ["#D4AF37", "wedding-gold-accent"],
  ["#E8D5A8", "wedding-gold-soft"],
  ["#401820", "wedding-ink"],
  ["#2A050B", "wedding-ink"],
  ["#804058", "wedding-muted"],
  ["#6B2440", "wedding-muted"],
  ["#5C3040", "wedding-ink-soft"],
  ["#4A1025", "wedding-ink-soft"],
  ["#FAF7F2", "wedding-on-dark"],
  ["#FFFBFC", "wedding-on-dark"],
  ["#B8BCC8", "wedding-silver"],
];

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
  if (f.endsWith("theme.js")) continue;
  let s = fs.readFileSync(f, "utf8");
  let changed = false;
  for (const [hex, tok] of map) {
    for (const h of [hex, hex.toLowerCase()]) {
      const from = `[${h}]`;
      const to = tok;
      if (s.includes(from)) {
        s = s.split(from).join(to);
        changed = true;
      }
    }
  }
  if (changed) {
    fs.writeFileSync(f, s);
    updated += 1;
  }
}
console.log(`Updated ${updated} files`);
