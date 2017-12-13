import dispatcher from '../dispatcher'

export function AlertInfo(msg) {
  dispatcher.dispatch({
    name: 'alert info',
    data: msg
  })
}

export function AlertWarning(msg) {
  dispatcher.dispatch({
    name: 'alert info',
    data: msg
  })
}