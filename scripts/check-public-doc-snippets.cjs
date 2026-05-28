const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = path.resolve(__dirname, "..");
const outDir = path.join(root, ".tmp", "public-doc-snippets");
const docs = ["README.md", "docs/public"];
const fencePattern = /^```(ts|tsx|typescript)\s*\n([\s\S]*?)^```/gm;

const packageValues = [
  "SocketProvider",
  "SocketStore",
  "createMessageHandler",
  "useListen",
  "useSend",
  "useSocket",
  "useSocketStoreRef",
];
const packageTypes = [
  "DefaultSchema",
  "ISocketStore",
  "SocketSchema",
  "SocketStoreLike",
  "TopicKey",
  "TopicPayload",
  "TopicState",
];

function walk(entry) {
  const stat = fs.statSync(entry);
  if (stat.isFile()) return [entry];
  return fs.readdirSync(entry, { withFileTypes: true }).flatMap((item) => {
    const next = path.join(entry, item.name);
    return item.isDirectory() ? walk(next) : [next];
  });
}

function lineOf(source, index) {
  return source.slice(0, index).split("\n").length;
}

function has(source, name) {
  return new RegExp(`\\b${name}\\b`).test(source);
}

function declares(source, name) {
  return new RegExp(
    `\\b(const|let|var|function|class|type|interface)\\s+${name}\\b`
  ).test(source);
}

function imports(source, name) {
  return new RegExp(`import[\\s\\S]*?\\b${name}\\b[\\s\\S]*?from\\s+["']`).test(
    source
  );
}

function importBlock(values, types) {
  if (values.length === 0 && types.length === 0) return "";
  const names = [
    ...values.map((name) => `  ${name},`),
    ...types.map((name) => `  type ${name},`),
  ].join("\n");
  return `import {\n${names}\n} from "react-socket-store";`;
}

function normalize(source) {
  const code = source
    .replace(/^import\s+[\s\S]*?\s+from\s+["']\.\.?.*?["'];\n/gm, "")
    .replace("// TypeScript error:", "// @ts-expect-error")
    .replace(
      /^function (useSocket|useListen|useSend|useSocketStoreRef)</gm,
      "declare function $1<"
    );
  const importsToAdd = [];
  const valueImports = packageValues.filter(
    (name) => has(code, name) && !declares(code, name) && !imports(code, name)
  );
  const typeImports = packageTypes.filter(
    (name) => has(code, name) && !declares(code, name) && !imports(code, name)
  );
  importsToAdd.push(importBlock(valueImports, typeImports));

  const reactValues = ["useEffect", "useState"].filter(
    (name) => has(code, name) && !imports(code, name)
  );
  const reactTypes = ["FormEvent", "ReactNode"].filter(
    (name) => has(code, name) && !imports(code, name)
  );
  if (reactValues.length > 0 || reactTypes.length > 0) {
    const names = [
      ...reactValues.map((name) => `  ${name},`),
      ...reactTypes.map((name) => `  type ${name},`),
    ].join("\n");
    importsToAdd.push(`import {\n${names}\n} from "react";`);
  }

  const declarations = [];
  if (has(code, "useLoaderData") && !declares(code, "useLoaderData")) {
    declarations.push(
      "declare function useLoaderData<T extends (...args: never[]) => unknown>(): Awaited<ReturnType<T>>;"
    );
  }
  if (has(code, "getInitialMessages") && !declares(code, "getInitialMessages")) {
    declarations.push("declare function getInitialMessages(): Promise<string[]>;");
  }
  for (const name of ["ChatIsland", "ChatClient", "ChatRouteClient", "ChatThread"]) {
    if (has(code, name) && !declares(code, name)) {
      declarations.push(`declare const ${name}: (props: any) => JSX.Element;`);
    }
  }
  if (
    has(code, "store") &&
    !declares(code, "store") &&
    !/\{\s*store\s*\}/.test(code) &&
    !/store\s*:/.test(code)
  ) {
    declarations.push("declare const store: ISocketStore<any>;");
  }
  if (
    has(code, "initialMessages") &&
    !declares(code, "initialMessages") &&
    !/\{\s*initialMessages\s*\}/.test(code)
  ) {
    declarations.push("declare const initialMessages: string[];");
  }
  if (has(code, "Message") && !declares(code, "Message")) {
    declarations.push("type Message = { id: string; text: string };");
  }
  if (has(code, "ChatSchema") && !declares(code, "ChatSchema")) {
    declarations.push(
      "type ChatSchema = { talk: { state: string[]; payload: string } };"
    );
  }
  if (has(code, "talkHandler") && !declares(code, "talkHandler")) {
    declarations.push(
      "declare const talkHandler: ReturnType<typeof createMessageHandler<string[], string>>;"
    );
  }

  const body = [...declarations, code].filter(Boolean).join("\n\n");
  const generatedImports = importsToAdd.join("\n\n");
  if (
    has(body, "ISocketStore") &&
    !imports(code, "ISocketStore") &&
    !imports(generatedImports, "ISocketStore")
  ) {
    importsToAdd.push('import type { ISocketStore } from "react-socket-store";');
  }
  if (
    has(body, "createMessageHandler") &&
    !declares(body, "createMessageHandler") &&
    !imports(code, "createMessageHandler") &&
    !imports(generatedImports, "createMessageHandler")
  ) {
    importsToAdd.push('import { createMessageHandler } from "react-socket-store";');
  }
  return [...importsToAdd, body].filter(Boolean).join("\n\n");
}

function snippets() {
  return docs
    .flatMap((entry) => walk(path.join(root, entry)))
    .filter((file) => path.extname(file) === ".md")
    .flatMap((file) => {
      const source = fs.readFileSync(file, "utf8");
      return [...source.matchAll(fencePattern)].map((match) => ({
        code: match[2],
        ext: match[1] === "tsx" ? "tsx" : "ts",
        line: lineOf(source, match.index),
        path: path.relative(root, file),
      }));
    });
}

fs.rmSync(outDir, { force: true, recursive: true });
fs.mkdirSync(outDir, { recursive: true });

const extracted = snippets();
extracted.forEach((snippet, index) => {
  const name = `snippet-${String(index + 1).padStart(2, "0")}.${snippet.ext}`;
  fs.writeFileSync(
    path.join(outDir, name),
    `// Extracted from ${snippet.path}:${snippet.line}\n${normalize(snippet.code)}`
  );
});

fs.writeFileSync(
  path.join(outDir, "react-router.d.ts"),
  'declare module "react-router" { export function useLoaderData<T extends (...args: never[]) => unknown>(): Awaited<ReturnType<T>>; }\n'
);
fs.writeFileSync(
  path.join(outDir, "tsconfig.json"),
  JSON.stringify({
    extends: "../../tsconfig.json",
    compilerOptions: {
      noEmit: true,
      noUnusedLocals: false,
      noUnusedParameters: false,
      baseUrl: "../..",
      paths: { "react-socket-store": ["src"] },
    },
    include: ["*.ts", "*.tsx", "../../src"],
  })
);

const result = spawnSync(
  path.join(
    root,
    "node_modules",
    ".bin",
    process.platform === "win32" ? "tsc.cmd" : "tsc"
  ),
  ["-p", path.join(outDir, "tsconfig.json")],
  { cwd: root, encoding: "utf8", shell: process.platform === "win32" }
);

if (result.status !== 0) {
  process.stdout.write(result.stdout);
  process.stderr.write(result.stderr);
  process.exit(result.status ?? 1);
}

console.log(`Verified ${extracted.length} public TypeScript/TSX documentation snippets.`);
