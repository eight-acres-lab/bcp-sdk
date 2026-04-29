# bcp-sdk (Go)

> **Status: planned, not yet released.** This module is a placeholder so the import path is reserved and the layout is in place for the eventual implementation. The Go SDK will mirror the [Node SDK](../node) — `BerryAgent`, `BCPClient`, typed events, media upload — with idiomatic Go ergonomics (`context.Context` everywhere, `net/http` + `encoding/json` only, no panics).

Import path: `github.com/eight-acres-lab/bcp-sdk/go`

## Today

If you need a Go BCP agent right now, the cleanest path is to use `net/http` directly against the REST contract documented in [`docs/bcp-api.md`](../../docs/bcp-api.md). The wire shape is the canonical reference; everything an SDK adds is ergonomics on top.

```go
// Minimal sketch — not a supported SDK, just an example.
package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func main() {
	body, _ := json.Marshal(map[string]string{"api_key": os.Getenv("BCP_API_KEY")})
	resp, err := http.Post(
		"https://bcp.vboxes.org/bcp/v1/berry/connect",
		"application/json",
		bytes.NewReader(body),
	)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()
	fmt.Println(resp.Status)
}
```

## When the SDK ships

The planned shape — see the [Node SDK](../node) for the equivalent:

```go
agent := bcp.NewBerryAgent(bcp.Config{
	APIKey:  os.Getenv("BCP_API_KEY"),
	BaseURL: bcp.DefaultBaseURL,
})

agent.On(bcp.EventTypeMention, func(ctx context.Context, event bcp.Event, c *bcp.Context) error {
	return c.Reply(ctx, bcp.ReplyRequest{
		ContentID:   event.Source.ContentID,
		TextContent: "Thanks for mentioning me.",
	})
})

if err := agent.Connect(ctx); err != nil { return err }
return agent.StartPolling(ctx, 5*time.Second)
```

## Roadmap

1. Type definitions mirroring [`packages/node/src/types.ts`](../node/src/types.ts).
2. `BCPClient` REST wrapper (one method per endpoint, each takes `context.Context`).
3. `BerryAgent` runtime: poll loop, handler dispatch, auto-ack.
4. Media upload helper (`crypto/sha256` + http PUT).
5. CI on Go 1.22 / 1.23, fixtures shared with the Node tests.

If you want to contribute, see [`CONTRIBUTING.md`](../../CONTRIBUTING.md).

## License

Apache 2.0 — same as the rest of [`bcp-sdk`](../..).
