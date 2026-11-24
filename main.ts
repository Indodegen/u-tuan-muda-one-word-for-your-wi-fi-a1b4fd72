import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const entryPath = join(dirname(fileURLToPath(import.meta.url)), "entry.txt");
const text = readFileSync(entryPath, "utf8");

function fail(message) {
  console.error("invalid entry: " + message);
  process.exit(1);
}

if (text.length === 0) fail("entry is empty");
if (text !== text.trim()) fail("entry has leading or trailing whitespace");
if (/\s/.test(text)) fail("entry must be exactly one word (no whitespace inside)");
const codePoints = [...text];
if (codePoints.length < 1 || codePoints.length > 20) fail("entry must be 1-20 characters, got " + codePoints.length);
for (const ch of text) {
  const code = ch.codePointAt(0);
  if (code <= 0x1f || code === 0x7f) fail("entry contains a control character");
}
if (/[\u200B\u200C\u200D\uFEFF\uFFFD]/.test(text)) fail("entry contains a forbidden invisible character");
if (!/\p{L}/u.test(text)) fail("entry must contain a letter");
const firstChar = codePoints[0];
if (!/^\p{L}$/u.test(firstChar)) fail("entry must start with a letter, got '" + firstChar + "'");

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "output";
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), text, "utf8");
console.log("wrote entry: " + text);
