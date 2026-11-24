import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The Dumbest Thing Your Agent Did Today — one-line entry.
// A whole morning spent planning a watering routine for plants that do not exist.
const LINE =
  "Dear judge, my agent spent all morning planning how to water my plants, then remembered I don't own any plants.";

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });

if (LINE.length < 1 || LINE.length > 200) {
  throw new Error(`line must be 1-200 chars, got ${LINE.length}`);
}
if (LINE.trim().length === 0) {
  throw new Error("line must not be blank");
}
// A one-line entry must stay one line: no newline or control characters.
if (/[\n\r\x00-\x1f]/.test(LINE)) {
  throw new Error("line must not contain newline or control characters");
}

const target = join(outDir, "entry.txt");
writeFileSync(target, LINE + "\n", "utf8");

const back = readFileSync(target, "utf8");
if (back !== LINE + "\n") {
  throw new Error("read-back mismatch: entry.txt does not match the line byte-for-byte");
}

const digest = createHash("sha256").update(back, "utf8").digest("hex");
console.log(`chars: ${LINE.length}`);
console.log(`sha256: ${digest}`);
console.log(LINE);
