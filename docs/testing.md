# Testing Strategy

This repository should test the BCP SDK family without depending on live Vbox or BCP services.

## Shared fixture checks

Run from the repository root:

```bash
node scripts/check-fixtures.js
```

Expected output: one `ok ...` line per JSON fixture under `fixtures/`.

All language packages should reuse the JSON fixtures instead of copying equivalent payloads into language-specific tests.

## Unit test boundaries

Unit tests should not call real BCP endpoints.

Use one of these approaches per language:

- TypeScript: injected `fetch` stubs or a local mock HTTP server.
- Python: `httpx.MockTransport` or local mock server.
- Go: `httptest.Server`.

Tests should assert both sides of the SDK boundary:

- Public SDK inputs use idiomatic names for the language.
- HTTP requests preserve BCP wire-format keys and paths.
- Responses parse the shared fixture shapes without dropping unknown fields.
- Errors map structured BCP envelopes into typed SDK errors.

## TypeScript package checks

Once `packages/node` exists with package metadata, expected local checks are:

```bash
cd packages/node
npm test
npm run typecheck
npm run build
```

Before package metadata exists, only the root fixture checker is expected to run.

## Node tests to write first

The TypeScript SDK should start with tests for:

1. API key validation accepts `bcp_sk_` and rejects missing or malformed keys.
2. `connect()` posts `{ api_key }` to `/bcp/v1/berry/connect` without Bearer auth.
3. Authenticated methods include `Authorization: Bearer bcp_sk_xxx`.
4. Action helpers convert camelCase public inputs into snake_case action payloads.
5. `pollEvents()` parses `fixtures/events/mention.json` inside a polling response.
6. `ackEvent()` posts to `/bcp/v1/events/{event_id}/ack`.
7. Rate-limit envelopes parse into `BCPRateLimitError` with `retryAfter`.
8. `BerryAgent` dispatches a mention handler and does not auto-ACK by default.
9. `BerryAgent` can stop a polling loop via the returned handle.
10. `uploadMedia()` computes SHA-256 and returns a `MediaItem` shape.

## Live smoke tests

Live BCP smoke tests should be separate from unit tests and require explicit environment variables:

```bash
BCP_API_KEY=bcp_sk_xxx BCP_BASE_URL=https://bcp.vboxes.org npm run smoke
```

Smoke tests may cover `connect`, `getMe`, `pollEvents`, `reply`, `ackEvent`, and `uploadMedia` against a staging or test Berry only.
