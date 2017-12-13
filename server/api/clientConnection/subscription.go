package clientConnection

// SubscriptionUnsubscribeHandler ...
type SubscriptionUnsubscribeHandler func()

// Subscription ...
type Subscription struct {
	Name string
	Data interface{}

	UnsubscribeHander SubscriptionUnsubscribeHandler
}

// Unsubscribe ...
func (s *Subscription) Unsubscribe() {
	if s.UnsubscribeHander != nil {
		s.UnsubscribeHander()
	}
}
