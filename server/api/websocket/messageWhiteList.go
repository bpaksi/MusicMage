package websocket

import (
	"fmt"
	"sync"
)

// WhitelistList ...
type WhitelistList struct {
	lock sync.RWMutex
	all  []string
}

// MessageWhitelist ...
var MessageWhitelist *WhitelistList

func init() {
	MessageWhitelist = &WhitelistList{
		all: make([]string, 0),
	}
}

// Add ...
func (obj *WhitelistList) Add(msgType string) (err error) {
	obj.lock.Lock()
	defer obj.lock.Unlock()

	if obj.contains(msgType) {
		err = fmt.Errorf("MessageWhitelist entery already exists for %s", msgType)
		return
	}

	obj.all = append(obj.all, msgType)
	return
}

// Contains ...
func (obj *WhitelistList) Contains(msgType string) bool {
	obj.lock.RLock()
	defer obj.lock.RUnlock()

	return obj.contains(msgType)
}

// Contains ...
func (obj *WhitelistList) contains(msgType string) bool {

	for _, val := range obj.all {
		if val == msgType {
			return true
		}
	}

	return false
}
