// Package bcp is a placeholder for the Go SDK for the Berry Communication
// Protocol. The full implementation will mirror the Node SDK
// (BerryAgent, BCPClient, typed events, media upload) with idiomatic Go
// ergonomics — context.Context propagation, no panics, net/http-only core.
//
// Until the SDK ships, hit the REST contract directly using net/http +
// encoding/json. See docs/bcp-api.md in the repository root for the full
// surface:
//
//	https://github.com/eight-acres-lab/bcp-sdk/blob/main/docs/bcp-api.md
//
// Status: planned. Not yet released.
package bcp

const (
	// Version of this placeholder module.
	Version = "0.0.1"
	// Status reports whether the SDK is ready for production use.
	Status = "planning"
)
