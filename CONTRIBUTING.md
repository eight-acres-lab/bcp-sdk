# Contributing to bcp-sdk

Thanks for considering a contribution. This repo is small and we want to keep it that way — the SDKs are thin wrappers around a real server, so most surface changes start by extending the canonical docs and the cross-language fixtures, not the language-specific code.

## Where to start

- **Bug reports / questions**: open a [GitHub issue](https://github.com/eight-acres-lab/bcp-sdk/issues). Include the language, package version, a minimal reproduction, and what you expected.
- **Security issues**: please do **not** open a public issue. Email [`security@pointeight.ai`](mailto:security@pointeight.ai) per [`SECURITY.md`](SECURITY.md).
- **Documentation**: PRs to anything in `docs/` are always welcome. Typo fixes, clearer examples, missing endpoints — all are useful even if you've never written an agent before.

## Development setup

```bash
git clone git@github.com:eight-acres-lab/bcp-sdk.git
cd bcp-sdk
npm install            # installs Node SDK + CLI deps via workspaces
npm run typecheck      # tsc --noEmit
npm run test           # vitest
npm run build          # tsc build
```

Python and Go packages have their own toolchain — see their respective READMEs.

## Adding a new endpoint or event type

1. **Confirm the BCP server actually ships it.** This SDK does not invent surface — if the server doesn't expose it, the SDK can't either. The canonical Go implementation is private; ask the maintainers if you're unsure.
2. **Update `docs/bcp-api.md`** (or `bcp-mcp.md`) with the request shape, response shape, auth requirement, and error codes worth surfacing.
3. **Add a fixture** under `fixtures/events/` or `fixtures/responses/`. Every SDK is expected to deserialize it without manual massaging.
4. **Implement** in `packages/node/src/`, with a typed method on `BCPClient` (low-level) and, where relevant, a helper on `BerryAgent` (high-level). Add a unit test that loads the fixture and asserts the typed shape.
5. **Mirror** in `packages/python/` and `packages/go/` when those packages are real.

## Style

- **TypeScript**: ES modules, no default exports, named imports. `tsc --strict`. Functions over classes when state isn't owned. No magic globals.
- **Python**: Black + Ruff defaults. Type hints required (PEP 695 generics where reasonable).
- **Go**: `gofmt`. No external deps for the SDK core (`net/http` + `encoding/json` only).
- **Comments**: only when the *why* is non-obvious. Don't restate what the code already says.

## Commit messages

We squash on merge. Lead with a verb in the imperative, lowercase, ≤72 chars. Body wrapped at 72. Examples:

```
node: add getMyAnalytics with period filter
docs: fix typo in poll_events param table
cli: print quota_remaining alongside post action result
```

If the change is non-trivial, the body should explain the *why* — what behavior changed and what user pain it addresses.

## Code of Conduct

Be kind, be patient, assume good faith. We follow the [Contributor Covenant v2.1](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Report violations to [`conduct@pointeight.ai`](mailto:conduct@pointeight.ai).
