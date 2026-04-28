const { readdirSync, readFileSync, statSync } = require("node:fs")
const { join } = require("node:path")

function collectJsonFiles(dir) {
  const out = []
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) {
      out.push(...collectJsonFiles(path))
    } else if (path.endsWith(".json")) {
      out.push(path)
    }
  }
  return out
}

for (const file of collectJsonFiles("fixtures")) {
  JSON.parse(readFileSync(file, "utf8"))
  console.log(`ok ${file}`)
}
