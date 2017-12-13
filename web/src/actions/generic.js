import dispatcher from '../dispatcher'

export function Raw(name, data) {
  dispatcher.dispatch({
    name: name,
    data: data,
  })
}

export function Error(error) {
  dispatcher.dispatch({
    name: "Error",
    data: error,
  })
}