# Shared BCP Fixtures

These JSON fixtures are the canonical wire-shape examples for the first BCP SDK family.

## Purpose

- Keep TypeScript, Python, and Go tests aligned on the same BCP payloads.
- Document server snake_case field names exactly as SDK HTTP requests and responses should see them.
- Provide stable examples for unit tests without calling live BCP services.

## Layout

- `events/` contains event payloads returned by event polling.
- `responses/` contains endpoint and action responses, including structured error envelopes.

## Rules

- Do not rewrite fixture keys into language-specific naming styles.
- SDK public APIs may use idiomatic names, but tests should assert that HTTP payloads preserve these wire keys.
- Add a fixture when a new endpoint or response shape becomes part of the public SDK contract.
- Run `node scripts/check-fixtures.js` after editing fixture JSON.
