// Normalizes PARTICIPANTS_JSON into a strict one-line JSON array.
//
// Accepts any of these pasted as the GitHub secret value:
//   - the whole participants.js content (comments + "window.PARTICIPANTS = [...];")
//   - a bare JS-style array:  [ { name: "Diogo", github: "diogo" } ]
//   - strict JSON:            [{"name":"Diogo","github":"diogo"}]
//
// Prints canonical JSON to stdout. Exits non-zero with a readable error if the
// input cannot be parsed, so workflows fail loudly instead of deploying garbage.
//
// Used by .github/workflows/deploy.yml and .github/workflows/fetch-pr-data.yml.

const vm = require("vm");

function stripComments(src) {
  let out = "";
  let inString = false;
  let quote = "";
  let inLine = false;
  let inBlock = false;
  let prev = "";
  for (const ch of src) {
    if (inLine) {
      if (ch === "\n") { inLine = false; out += ch; }
      continue;
    }
    if (inBlock) {
      if (prev === "*" && ch === "/") { inBlock = false; prev = ""; } else { prev = ch; }
      continue;
    }
    if (inString) {
      out += ch;
      if (prev !== "\\" && ch === quote) inString = false;
      prev = ch;
      continue;
    }
    if (prev === "/" && ch === "/") { out = out.slice(0, -1); inLine = true; prev = ""; continue; }
    if (prev === "/" && ch === "*") { out = out.slice(0, -1); inBlock = true; prev = ""; continue; }
    if (ch === '"' || ch === "'") { inString = true; quote = ch; }
    out += ch;
    prev = ch;
  }
  return out;
}

function parseParticipants(raw) {
  let text = stripComments(String(raw)).trim();

  if (!text) throw new Error("value is empty.");

  const assignMatch = text.match(/window\.PARTICIPANTS\s*=/i);
  if (assignMatch) {
    text = text.slice(assignMatch.index).replace(/^window\.PARTICIPANTS\s*=\s*/i, "").trim();
  } else {
    const firstBracket = text.indexOf("[");
    if (firstBracket > 0) text = text.slice(firstBracket);
  }
  text = text.replace(/;\s*$/, "").trim();

  if (!text.startsWith("[")) {
    throw new Error('expected the value to contain the participants array, e.g. [{ name: "Alice", github: "alice-gh" }].');
  }

  let parsed;
  try {
    parsed = vm.runInNewContext(`(${text})`, {}, { timeout: 1000 });
  } catch (e) {
    throw new Error(`could not parse array literal - ${e.message}`);
  }

  if (!Array.isArray(parsed)) throw new Error("value is not an array.");

  return parsed.map((p, i) => {
    if (!p || typeof p !== "object" || Array.isArray(p)) {
      throw new Error(`entry ${i} is not an object.`);
    }
    if (typeof p.name !== "string" || !p.name.trim()) {
      throw new Error(`entry ${i} is missing a "name" string.`);
    }
    if (p.github !== null && p.github !== undefined && typeof p.github !== "string") {
      throw new Error(`entry ${i} (${p.name}) has an invalid "github" value - use a string or null.`);
    }
    const out = { name: p.name.trim(), github: p.github === undefined ? null : p.github };
    if (p.role !== undefined) out.role = p.role;
    return out;
  });
}

let raw = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  try {
    process.stdout.write(JSON.stringify(parseParticipants(raw)));
  } catch (e) {
    console.error(`PARTICIPANTS_JSON: ${e.message}`);
    process.exit(1);
  }
});