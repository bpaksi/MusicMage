import dispatcher from '../dispatcher'

export function ArtistSubscribe() {
  dispatcher.dispatch({
    name: 'artist subscribe',
  })
}

export function ArtistUnsubscribe() {
  dispatcher.dispatch({
    name: 'artist unsubscribe',
  })
}

export function ArtistAdd(artist) {
  dispatcher.dispatch({
    name: 'artist add',
    data: artist
  })
}

export function ArtistDelete(id) {
  dispatcher.dispatch({
    name: 'artist delete',
    data: id
  })
}

export function ArtistChange(artist) {
  dispatcher.dispatch({
    name: 'artist change',
    data: artist
  })
}