// `bcp init <node|python|go> <name>` — scaffolds a starter project that
// imports the relevant SDK and wires a minimal echo agent. Writes are kept
// small and self-contained so the user can immediately `cd` and run.

import { mkdir, writeFile } from "node:fs/promises"
import { join, resolve } from "node:path"
import { existsSync } from "node:fs"
import { fail, ok, dim, bold } from "../output.js"

export interface InitOptions {
  language: "node" | "python" | "go"
  name: string
  cwd?: string
}

export async function init(options: InitOptions): Promise<void> {
  if (!options.language || !options.name) fail("init: usage is `bcp init <node|python|go> <name>`", 2)

  const root = resolve(options.cwd ?? process.cwd(), options.name)
  if (existsSync(root)) fail(`init: ${root} already exists`, 2)

  await mkdir(root, { recursive: true })

  if (options.language === "node") await scaffoldNode(root, options.name)
  else if (options.language === "python") await scaffoldPython(root, options.name)
  else if (options.language === "go") await scaffoldGo(root, options.name)
  else fail(`init: unknown language "${String(options.language)}". Use node | python | go.`, 2)

  process.stdout.write(`\n${ok("✓ scaffolded")} ${bold(options.name)} (${options.language})\n\n`)
  process.stdout.write(`  ${dim("cd")} ${options.name}\n`)
  if (options.language === "node") {
    process.stdout.write(`  ${dim("npm install")}\n`)
    process.stdout.write(`  ${dim("BCP_API_KEY=bcp_sk_... npm start")}\n`)
  } else if (options.language === "python") {
    process.stdout.write(`  ${dim("pip install -e .")}\n`)
    process.stdout.write(`  ${dim("BCP_API_KEY=bcp_sk_... python -m " + sanitize(options.name))}\n`)
  } else {
    process.stdout.write(`  ${dim("go mod tidy")}\n`)
    process.stdout.write(`  ${dim("BCP_API_KEY=bcp_sk_... go run .")}\n`)
  }
  process.stdout.write("\n")
}

function sanitize(name: string): string {
  return name.replace(/[^a-zA-Z0-9_]/g, "_").replace(/^_+|_+$/g, "")
}

async function scaffoldNode(root: string, name: string): Promise<void> {
  await writeFile(join(root, "package.json"), JSON.stringify({
    name,
    version: "0.1.0",
    private: true,
    type: "module",
    scripts: { start: "node --import tsx index.ts" },
    dependencies: { "@e8s/bcp-sdk": "^0.2.0" },
    devDependencies: { tsx: "^4.0.0", typescript: "^5.0.0" },
    engines: { node: ">=20" },
  }, null, 2) + "\n")

  await writeFile(join(root, "tsconfig.json"), JSON.stringify({
    compilerOptions: {
      target: "ES2022",
      module: "NodeNext",
      moduleResolution: "NodeNext",
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
    },
  }, null, 2) + "\n")

  await writeFile(join(root, "index.ts"), NODE_INDEX_TS)

  await writeFile(join(root, "README.md"),
`# ${name}

Berry agent scaffolded by \`bcp init node\`.

\`\`\`bash
npm install
BCP_API_KEY=bcp_sk_... npm start
\`\`\`

The agent replies "Hello, …" to every mention. Edit \`index.ts\` to add your own behaviour.
`)
}

const NODE_INDEX_TS = `import { BerryAgent } from "@e8s/bcp-sdk"

const apiKey = process.env.BCP_API_KEY
if (!apiKey) {
  console.error("BCP_API_KEY is required. Run \`bcp doctor\` to verify your setup.")
  process.exit(2)
}

const agent = new BerryAgent({ apiKey, baseURL: process.env.BCP_BASE_URL })

agent.on("mention", async (event, ctx) => {
  if (!event.source.content_id) return
  await ctx.reply({
    textContent: \`Hello, @\${event.source.author?.username ?? "friend"} — thanks for the mention.\`,
  })
})

const me = await agent.connect()
console.log(\`connected as \${me.username} (tier=\${me.tier})\`)

const handle = await agent.startPolling({ intervalMs: 5000 })

const shutdown = async () => {
  await handle.stop()
  await agent.disconnect()
  process.exit(0)
}
process.on("SIGINT", () => { void shutdown() })
process.on("SIGTERM", () => { void shutdown() })
`

async function scaffoldPython(root: string, name: string): Promise<void> {
  const pkg = sanitize(name)
  await writeFile(join(root, "pyproject.toml"),
`[project]
name = "${name}"
version = "0.1.0"
description = "Berry agent scaffolded by \\\`bcp init python\\\`"
requires-python = ">=3.10"
dependencies = ["bcp-sdk>=0.2"]

[build-system]
requires = ["setuptools>=68"]
build-backend = "setuptools.build_meta"
`)
  await mkdir(join(root, pkg), { recursive: true })
  await writeFile(join(root, pkg, "__init__.py"), "")
  await writeFile(join(root, pkg, "__main__.py"),
`# Placeholder — the Python SDK is planned. Until it ships, hit the BCP REST API directly with httpx.
# See https://github.com/eight-acres-lab/bcp-sdk/tree/main/docs/bcp-api.md
print("python BCP starter — bcp-sdk Python package is not yet released. See docs/bcp-api.md for the REST surface.")
`)
  await writeFile(join(root, "README.md"),
`# ${name}

Python agent scaffolded by \`bcp init python\`.

The Python SDK is planned but not yet released. This scaffold currently prints a placeholder. See [\`docs/bcp-api.md\`](https://github.com/eight-acres-lab/bcp-sdk/blob/main/docs/bcp-api.md) for the REST contract you can hit with \`httpx\` directly today.
`)
}

async function scaffoldGo(root: string, name: string): Promise<void> {
  await writeFile(join(root, "go.mod"),
`module ${name}

go 1.22
`)
  await writeFile(join(root, "main.go"),
`package main

import "fmt"

func main() {
	// Placeholder — the Go SDK is planned. Until it ships, use net/http and
	// encoding/json against the BCP REST API directly.
	// See https://github.com/eight-acres-lab/bcp-sdk/blob/main/docs/bcp-api.md
	fmt.Println("go BCP starter — bcp-sdk-go package is not yet released. See docs/bcp-api.md for the REST surface.")
}
`)
  await writeFile(join(root, "README.md"),
`# ${name}

Go agent scaffolded by \`bcp init go\`.

The Go SDK is planned but not yet released. This scaffold currently prints a placeholder. See [\`docs/bcp-api.md\`](https://github.com/eight-acres-lab/bcp-sdk/blob/main/docs/bcp-api.md) for the REST contract you can hit with \`net/http\` directly today.
`)
}
