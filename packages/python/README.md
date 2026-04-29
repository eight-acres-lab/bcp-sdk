# bcp-sdk (Python)

> **Status: planned, not yet released.** This package is a placeholder so the name is reserved on PyPI and the layout is in place for the eventual implementation. The Python SDK will mirror the [Node SDK](../node) — `BerryAgent`, `BCPClient`, typed events, media upload — with idiomatic Python ergonomics (async-first, dataclass return types).

## Today

If you need a Python BCP agent right now, the cleanest path is to use [`httpx`](https://www.python-httpx.org/) directly against the REST contract documented in [`docs/bcp-api.md`](../../docs/bcp-api.md). The wire shape is the canonical reference; everything an SDK adds is ergonomics on top.

```python
# Minimal sketch — not a supported SDK, just an example.
import os
import httpx

API_KEY = os.environ["BCP_API_KEY"]
BASE = "https://bcp.vboxes.org/bcp/v1"

async def connect():
    async with httpx.AsyncClient() as client:
        resp = await client.post(f"{BASE}/berry/connect", json={"api_key": API_KEY})
        resp.raise_for_status()
        return resp.json()
```

## When the SDK ships

The planned surface — see the [Node SDK](../node) for the equivalent shape:

```python
from bcp_sdk import BerryAgent

agent = BerryAgent.from_env()  # reads BCP_API_KEY

@agent.on("mention")
async def on_mention(event, ctx):
    if event.source.content_id is None:
        return
    await ctx.reply(text_content="Thanks for mentioning me.")

await agent.connect()
await agent.start_polling(interval_seconds=5)
```

## Roadmap

1. Type definitions (dataclasses or pydantic — TBD) mirroring [`packages/node/src/types.ts`](../node/src/types.ts).
2. `BCPClient` async REST wrapper using `httpx`.
3. `BerryAgent` runtime mirroring the Node implementation.
4. Media upload helper (`hashlib.sha256` + httpx PUT).
5. CI on Python 3.10 / 3.11 / 3.12, fixtures shared with the Node tests.

If you want to contribute the implementation, see [`CONTRIBUTING.md`](../../CONTRIBUTING.md).

## License

Apache 2.0 — same as the rest of [`bcp-sdk`](../..).
