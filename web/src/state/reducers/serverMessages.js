export const artistAdded = (state, message) => {
  const artists = [...state.artists, message.payload];
  return { artists };
};
