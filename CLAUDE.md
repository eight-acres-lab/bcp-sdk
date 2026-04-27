# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository status

This repository is currently in the planning stage for the Berry Communication Protocol SDK family. The only implemented artifacts are the top-level `README.md` and the detailed implementation plan in `docs/superpowers/plans/2026-04-27-bcp-sdk.md`.

Do not assume package directories or build tooling exist until the implementation plan tasks have created them.

## Product direction

`bcp-sdk` is the official SDK family for Vbox's Berry Communication Protocol (BCP). It should help developers build self-hosted Berry agents without manually wiring BCP HTTP requests, event polling, ACK handling, action payloads, quota errors, or media uploads.

Initial target packages:

- Node.js / TypeScript: `@vbox/bcp-sdk` — first implementation priority.
- Python: `bcp-sdk` — second implementation priority.
- Go: `github.com/point-eight/bcp-sdk-go` — third implementation priority.

The SDK should expose two layers in each language:

- Low-level client: typed REST wrapper around BCP endpoints.
- High-level `BerryAgent`: polling runtime with event handler registration and convenience context helpers.

## BCP protocol facts to preserve

The SDK must match current BCP server behavior documented in the README and implementation plan:

- Public BCP routes are under `/bcp/v1`.
- `POST /bcp/v1/berry/connect` accepts `{ "api_key": "bcp_sk_xxx" }` in the JSON body.
- Authenticated routes use `Authorization: Bearer bcp_sk_xxx`.
- Event polling uses `GET /bcp/v1/berry/events`.
- Event ACK uses `POST /bcp/v1/events/{event_id}/ack`.
- Actions use `POST /bcp/v1/actions/{action_type}`.
- Context APIs are under `/bcp/v1/context/*`.
- Media upload is a raw-byte upload flow using SHA-256 and a separate upload endpoint.
- First release is polling-first. Webhook helpers and MCP compatibility are follow-up layers.

## Planned architecture

The intended repository shape is a monorepo:

```txt
packages/node/      TypeScript SDK
packages/python/    Python SDK
packages/go/        Go SDK
fixtures/           Shared protocol JSON fixtures
scripts/            Repository utility scripts
docs/               Planning and API documentation
```

Shared fixtures should define canonical BCP events and responses so TypeScript, Python, and Go tests stay aligned. Avoid diverging behavior between packages unless it is purely idiomatic naming for the language.

## Development commands

Current repository state:

```bash
# Inspect pending changes
git status --short

# Read the implementation plan
less docs/superpowers/plans/2026-04-27-bcp-sdk.md
```

The following commands become available as the implementation plan creates package directories:

```bash
# Validate shared JSON fixtures
node scripts/check-fixtures.js

# TypeScript SDK
cd packages/node && npm install
cd packages/node && npm test
cd packages/node && npm run typecheck
cd packages/node && npm run build
cd packages/node && npm test -- client.test.ts

# Python SDK
cd packages/python && python -m pip install -e '.[test]'
cd packages/python && pytest
cd packages/python && pytest tests/test_client.py -q

# Go SDK
cd packages/go && go test ./...
cd packages/go && go test ./... -run TestConnectSendsAPIKeyInBody
```

There is no root-level build, lint, or test command yet.

## Implementation plan

Use `docs/superpowers/plans/2026-04-27-bcp-sdk.md` as the source of truth for initial implementation sequencing. It breaks the work into:

1. Shared protocol fixtures.
2. TypeScript package skeleton, HTTP/error handling, `BCPClient`, `BerryAgent`, media/webhook helpers, and examples.
3. Python async client, agent runtime, and media helper.
4. Go client, agent runtime, and media helper.
5. Final API surface and release checklist docs.

When implementing, keep each package's public API aligned with the plan and README examples.

## Important non-goals for the first release

- Do not implement full proto code generation before the polling SDK works.
- Do not build webhook hosting infrastructure in the SDK.
- Do not add a local database or durable job queue to the SDK.
- Do not reimplement Vbox safety, quota, recommendation, or persona logic client-side.
- Do not expose internal BCP server APIs as public SDK APIs.
