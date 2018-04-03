package connection

// Subscriptions ...
type Subscriptions struct {
	all []Subscription
}

// ClientDisconnectHandler ...
type ClientDisconnectHandler func()

func newSubscriptions() *Subscriptions {
	var subscriptions Subscriptions
	subscriptions.all = make([]Subscription, 0)

	return &subscriptions
}

// Contains ...
func (s *Subscriptions) Contains(name string) bool {
	for _, sub := range s.all {
		if sub.Name == name {
			return true
		}
	}

	return false
}

// Track ...
func (s *Subscriptions) Track(name string, unsubscribe SubscriptionUnsubscribeHandler) *Subscription {
	var newSubscription Subscription
	newSubscription.Name = name
	newSubscription.UnsubscribeHander = unsubscribe
	s.all = append(s.all, newSubscription)

	return &s.all[len(s.all)-1]
}

// Disconnect ...
func (s *Subscriptions) Disconnect(name string) {
	for idx, subscription := range s.all {
		if subscription.Name == name {
			subscription.Unsubscribe()

			s.all = append(s.all[:idx], s.all[idx+1:]...)
			break
		}
	}

}

// DisconnectAll ...
func (s *Subscriptions) DisconnectAll() {
	for _, subscription := range s.all {
		subscription.Unsubscribe()
	}

	s.all = make([]Subscription, 0)
}
