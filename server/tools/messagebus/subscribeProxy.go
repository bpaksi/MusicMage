package messagebus

import (
	"encoding/json"
	"log"
	"reflect"
)

type handlerProxy struct {
	handler reflect.Value
	WithClientID bool
}

func newProxy(handler interface{}) handlerProxy {
	return handlerProxy{
		handler: reflect.ValueOf(handler),
	}
}

func (proxy *handlerProxy) Call(msg Message) {
	defer func() {
		if r := recover(); r != nil {
			log.Printf("PANIC while processing message: %s (%+v)", msg.Type, r)
		}
	}()

	handlerType := proxy.handler.Type()
	paramCnt := handlerType.NumIn()

	params := make([]reflect.Value, paramCnt)

	paramIdx := 0
	if proxy.WithClientID {
		params[paramIdx] = reflect.ValueOf(msg.ClientID)
		paramIdx++
	}


	if paramIdx < paramCnt {
			params[paramIdx] = createParam(handlerType.In(paramIdx), msg.Payload)
	}

	// log.Printf("params: %+v", params)
	proxy.handler.Call(params)
}

func createParam(paramType reflect.Type, payload []byte) reflect.Value {
	param := reflect.New(paramType)
	err := json.Unmarshal(payload, param.Interface())
	if err != nil {
		log.Printf("Error populating param: %s", err.Error())
	}

	// log.Printf("param: %s\n", param.Elem().Interface())
	return param.Elem()
}
