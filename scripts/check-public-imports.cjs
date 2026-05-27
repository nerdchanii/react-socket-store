const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const forbiddenPattern = /["']socket-store\/dist\//;
const scannedPaths = [
  "src",
  "tests",
  "test-d",
  "docs",
  "example",
  "README.md",
];
const ignoredDirectories = new Set([
  ".vitepress",
  "dist",
  "lib",
  "node_modules",
]);
const extensions = new Set([".cjs", ".js", ".md", ".ts", ".tsx"]);
const violations = [];

function checkFile(filePath) {
  if (!extensions.has(path.extname(filePath))) {
    return;
  }

  const source = fs.readFileSync(filePath, "utf8");
  if (forbiddenPattern.test(source)) {
    violations.push(path.relative(root, filePath));
  }
}

function walk(entryPath) {
  const stat = fs.statSync(entryPath);

  if (stat.isFile()) {
    checkFile(entryPath);
    return;
  }

  for (const entry of fs.readdirSync(entryPath, { withFileTypes: true })) {
    const fullPath = path.join(entryPath, entry.name);

    if (entry.isDirectory()) {
      if (ignoredDirectories.has(entry.name)) {
        continue;
      }

      walk(fullPath);
      continue;
    }

    checkFile(fullPath);
  }
}

for (const scannedPath of scannedPaths) {
  walk(path.join(root, scannedPath));
}

if (violations.length > 0) {
  console.error("Do not import socket-store internals from dist paths:");
  for (const violation of violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}
