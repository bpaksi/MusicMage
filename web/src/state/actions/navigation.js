const scope = "navigation";

export const navigateTo = (key, param) => ({
  type: "navigateTo",
  scope,
  parameters: { key, param },
  reduce: state => ({
    direction: "forward",
    stack: [...state.stack, { key, param }]
  })
});

export const navigateBack = index => {
  const idx = index === undefined ? 1 : index + 1;

  return {
    type: "navigateBack",
    scope,
    parameters: { index },
    reduce: state => ({
      direction: "backward",
      stack: state.stack.slice(0, idx)
    })
  };
};

export const navigateRefresh = () => ({
  type: "navigateRefresh",
  scope,
  reduce: state => ({
    pageKey: state.pageKey + 1
  })
});
