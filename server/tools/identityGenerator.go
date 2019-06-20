package tools

import (
	"sync"
)

const startIndex int64 = 50000

// IdentityGenerator ...
type IdentityGenerator struct {
	lock sync.RWMutex

	nextID int64
}

// NewIdentityGenerator ...
func NewIdentityGenerator() *IdentityGenerator {
	return &IdentityGenerator{
		nextID: startIndex,
	}
}

// Next ...
func (id *IdentityGenerator) Next() int64 {
	id.lock.Lock()
	defer id.lock.Unlock()

	nextID := id.nextID
	id.nextID++
	return nextID
}

// Reset ...
func (id *IdentityGenerator) Reset() {
	id.lock.Lock()
	defer id.lock.Unlock()

	id.nextID = startIndex
}
