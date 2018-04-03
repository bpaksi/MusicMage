package connection

import (
	"encoding/json"
	"fmt"
	"log"
	"reflect"
)

// RouterData ...
type RouterData struct {
	routes map[string]reflect.Value
}

// Router ...
var Router RouterData

func init() {
	Router.routes = make(map[string]reflect.Value)
}

// Handle ...
func (router *RouterData) Handle(name string, handler interface{}) {
	if _, ok := router.routes[name]; ok {
		log.Println("Attempted handle the same command more than once")
		return
	}

	handlerPtr := reflect.ValueOf(handler)
	if handlerPtr.Kind().String() != "func" {
		log.Println("Connection messages must be handled by functions")
		return
	}

	handlerType := handlerPtr.Type()
	paramCnt := handlerType.NumIn()
	if paramCnt < 1 || paramCnt > 2 {
		log.Println("Connection message handlers must accept at one or two parameters")
		return
	}

	paramType := handlerType.In(0)
	clientType := reflect.TypeOf((*Client)(nil))
	if paramType != clientType {
		log.Println("A Connection message handler's first parameter must be of type connection.Client")
		return
	}

	router.routes[name] = handlerPtr
}

// Route ...
func (router *RouterData) Route(client *Client, message Message) (err error) {
	if handler, ok := router.routes[message.Type]; ok {
		handlerType := handler.Type()
		paramCnt := handlerType.NumIn()

		params := make([]reflect.Value, paramCnt)
		params[0] = reflect.ValueOf(client)

		if paramCnt == 2 {
			paramType := handlerType.In(1)
			param := reflect.New(paramType)
			err = json.Unmarshal(message.Payload, param.Interface())
			if err != nil {
				return
			}

			// log.Printf("param: %s\n", param.Elem().Interface())

			params[1] = param.Elem()
		}

		// log.Printf("params: %+v", params)

		handler.Call(params)
		return
	}

	err = fmt.Errorf("No handler define for %s", message.Type)
	return
}
