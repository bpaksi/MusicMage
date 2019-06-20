package messagebus

// Subscription ...
type Subscription interface {
	// Unsubscribe unsubscribe handler from the given topic
	Unsubscribe() error
}

type messageBusHandler struct {
	ID     int64
	Func   func(Message)
	Filter string
}

// SubscribeAll ...
// func SubscribeAll(handler func(Message)) Subscription {
// 	return subscribe("", handler)
// }

// Subscribe ...
func Subscribe(msgType string, handler interface{}) Subscription {
	proxy := newProxy(handler)
	return subscribe(msgType, proxy.Call)
}

// SubscribeWithClientID ...
func SubscribeWithClientID(msgType string, handler interface{}) Subscription {
	proxy := newProxy(handler)
	proxy.WithClientID = true
	return subscribe(msgType, proxy.Call)
}

func subscribe(msgType string, handler func(Message)) Subscription {
	bus.lock.Lock()
	defer bus.lock.Unlock()

	h := &messageBusHandler{
		ID:     bus.idenity.Next(),
		Filter: msgType,
		Func:   handler,
	}

	bus.handlers = append(bus.handlers, h)
	return h
}

func (obj *messageBusHandler) Unsubscribe() error {
	return unsubscribe(obj.ID)
}
