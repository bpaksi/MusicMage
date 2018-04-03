package connection

import "encoding/json"

// Message ...
type Message struct {
	Type    string          `json:"type"`
	Payload json.RawMessage `json:"payload"`
}
