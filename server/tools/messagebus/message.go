package messagebus

// Message ...
type Message struct {
	Type     string `json:"type"`
	Payload  []byte `json:"payload,omitempty"`
	ClientID int64  `json:"clientId,omitempty"`
}
