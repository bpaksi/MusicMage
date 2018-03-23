package tools

import (
	"sync"
)

const startIndex int64 = 50000

// IdentityGenerator ...
type IdentityGenerator struct {
	sync.RWMutex

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
	id.Lock()
	defer id.Unlock()

	nextID := id.nextID
	id.nextID++
	return nextID
}

// Reset ...
func (id *IdentityGenerator) Reset() {
	id.Lock()
	defer id.Unlock()

	id.nextID = startIndex
}
