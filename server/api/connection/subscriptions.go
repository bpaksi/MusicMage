package connection

import (
	"fmt"
	"sync"

	"github.com/bpaksi/MusicMage/server/tools/messagebus"
)

type Subscription struct {
	ClientID int64
	Name     string
	Data     interface{}
}

// SubscriptionList ...
type SubscriptionList struct {
	lock sync.RWMutex
	all  []*Subscription
}

// Subscriptions ...
var Subscriptions *SubscriptionList

func init() {
	Subscriptions = &SubscriptionList{
		all: make([]*Subscription, 0),
	}

	messagebus.Subscribe("CLIENT_CONNECTION_CLOSED", Subscriptions.onConnectionClosed)
}

// Add ...
func (obj *SubscriptionList) Add(clientID int64, name string, data interface{}) (err error) {
	obj.lock.Lock()
	defer obj.lock.Unlock()

	if _, ok := obj.find(clientID, name); ok {
		err = fmt.Errorf("Subscription %s already exists for client %d", name, clientID)
		return
	}

	obj.all = append(obj.all, &Subscription{
		ClientID: clientID,
		Name:     name,
		Data:     data,
	})

	return
}

// Remove ...
func (obj *SubscriptionList) Remove(clientID int64, name string) (err error) {
	obj.lock.Lock()
	defer obj.lock.Unlock()

	if _, ok := obj.find(clientID, name); !ok {
		err = fmt.Errorf("Subscription %s doesn not exists for client %d", name, clientID)
		return
	}

	for i, subscription := range obj.all {
		if subscription.ClientID == clientID && subscription.Name == name {
			obj.all = append(obj.all[:i], obj.all[i+1:]...)
			break
		}
	}
	return
}

// List ...
func (obj *SubscriptionList) List(name string) (subscriptions []*Subscription) {
	obj.lock.RLock()
	defer obj.lock.RUnlock()

	subscriptions = make([]*Subscription, 0)
	for _, subscription := range obj.all {
		if subscription.Name == name {
			subscriptions = append(subscriptions, subscription)
		}
	}

	return
}

func (obj *SubscriptionList) find(clientID int64, name string) (subscription *Subscription, ok bool) {
	ok = false
	for _, subscription = range obj.all {
		if subscription.ClientID == clientID && subscription.Name == name {
			ok = true
			return
		}
	}

	subscription = nil
	return
}

func (obj *SubscriptionList) onConnectionClosed(clientID int64) {
	obj.lock.Lock()
	defer obj.lock.Unlock()

	for i := len(obj.all) - 1; i >= 0; i-- {
		subscription := obj.all[i]

		if subscription.ClientID == clientID {

			obj.all = append(obj.all[:i], obj.all[i+1:]...)
		}
	}
}
