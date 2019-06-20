package messagebus

import (
	"fmt"
	"sync"

	"github.com/bpaksi/MusicMage/server/tools"
)

type messageBus struct {
	lock     sync.RWMutex
	idenity  *tools.IdentityGenerator
	handlers []*messageBusHandler
}

var bus messageBus

func init() {
	bus.idenity = tools.NewIdentityGenerator()
	bus.handlers = make([]*messageBusHandler, 0)
}

func unsubscribe(id int64) (err error) {
	index := -1
	for idx, handler := range bus.handlers {
		if handler.ID == id {
			index = idx
			break
		}
	}

	if index == -1 {
		err = fmt.Errorf("Unable to find handler: %d", id)
		return
	}

	l := len(bus.handlers) - 1
	if l == 0 {
		bus.handlers = make([]*messageBusHandler, 0)
	} else {
		bus.handlers[index] = bus.handlers[l]
		bus.handlers = bus.handlers[:l]
	}

	return
}
