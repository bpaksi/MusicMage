export const navigateTo = (key, param) => ({
  type: "navigateTo",
  parameters: { key, param },
  reduce: state => ({
    navigation: {
      direction: "forward",
      stack: [...state.navigation.stack, { key, param }]
    }
  })
});

export const navigateBack = index => {
  const idx = index === undefined ? 1 : index + 1;

  return {
    type: "navigateBack",
    parameters: { index },
    reduce: state => ({
      navigation: {
        direction: "backward",
        stack: state.navigation.stack.slice(0, idx)
      }
    })
  };
};
