#!/usr/bin/env node
// Entry point for the `bcp` CLI binary. Loads the compiled ESM and runs.
import { run } from "../dist/index.js"

run(process.argv).catch((err) => {
  if (err && typeof err === "object" && "exitCode" in err) {
    process.exit(err.exitCode)
  }
  console.error(err && err.stack ? err.stack : err)
  process.exit(1)
})
