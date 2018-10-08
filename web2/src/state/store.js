import { applyMiddleware, createStore } from 'redux'
import reducer from './reducer'

// middleware
import logger from './middleware/logger'
import thunk from 'redux-thunk'
import WebsocketMiddleware from './middleware/websocketMiddleware'
import rediirectToServer from './middleware/rediirectToServer'
import currentSubscription from './middleware/currentSubscription'
import selectFolder from './middleware/selectFolder'

const middleware = applyMiddleware(
  rediirectToServer,  
  currentSubscription,
  WebsocketMiddleware,
  selectFolder,
  thunk, 
  logger, 
);

export default createStore(reducer, middleware);

