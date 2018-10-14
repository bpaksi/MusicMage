package connection

import "encoding/json"

// Message ...
type Message struct {
	Type      string          `json:"type"`
	ReturnKey string          `json:"returnKey,omitempty"`
	Payload   json.RawMessage `json:"payload"`
}
