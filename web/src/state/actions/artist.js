export const artistSubscribe = artist => ({
  type: "artistsFetch",
  parameters: { artist },
  reduce: () => ({ artists: [] }),
  webSocketSend: {
    type: "ARTIST_SUBSCRIBE",
    payload: artist ? artist : ""
  },
 
});

export const artistsFetched = artists => ({
  type: "artistsFetched",
  parameters: { artists },
  reduce: () => ({ artists: [...artists] })
});


export const artistUnsubscribe = () => ({
  type: "artistUnsubscribe",
  reduce: () => ({ artists: [] }),
  webSocketSend: {
    type: "ARTIST_UNSUBSCRIBE"
  }
});




export const artistAdded = artist => ({
  type: "artistAdded",
  parameters: { artist },
  reduce: state => ({ artists: [...state.artists, artist] })
});
