package messagebus

import (
	"encoding/json"
	"log"
)

// PublishVerbose ...
func PublishVerbose(msg Message) {
	defer func() {
		if r := recover(); r != nil {
			log.Printf("PANIC occurred attemting to publish %+v (%+v)", msg, r)
		}
	}()

	bus.lock.RLock()
	defer bus.lock.RUnlock()

	log.Printf("%20s:%.50s", msg.Type, msg.Payload)

	if bus.handlers != nil {
		for _, handler := range bus.handlers {
			if handler.Filter == "" || handler.Filter == msg.Type {
				handler.Func(msg)
			}
		}
	}
}

// Publish ...
func Publish(msgType string, payload interface{}) {
	msg := Message{
		Type: msgType,
	}

	raw, err := json.Marshal(payload)
	if err != nil {
		log.Println("Error: " + err.Error())
		return
	}

	msg.Payload = raw
	PublishVerbose(msg)
}
