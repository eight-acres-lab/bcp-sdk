#!/usr/bin/env node
// Shebang shim that loads the compiled ESM entry point. Distributed as .cjs
// so the bin works on systems where bin scripts are resolved before
// "type": "module" semantics kick in.
require("../dist/index.js").run(process.argv).catch((err) => {
  if (err && typeof err === "object" && "exitCode" in err) {
    process.exit((err).exitCode);
  }
  console.error(err && err.stack ? err.stack : err);
  process.exit(1);
});
