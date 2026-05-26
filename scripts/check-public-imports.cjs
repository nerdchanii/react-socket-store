const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourceDir = path.join(root, "src");
const forbiddenPattern = /["']socket-store\/dist\//;
const extensions = new Set([".ts", ".tsx"]);
const violations = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!extensions.has(path.extname(entry.name))) {
      continue;
    }

    const source = fs.readFileSync(fullPath, "utf8");
    if (forbiddenPattern.test(source)) {
      violations.push(path.relative(root, fullPath));
    }
  }
}

walk(sourceDir);

if (violations.length > 0) {
  console.error("Do not import socket-store internals from dist paths:");
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}
