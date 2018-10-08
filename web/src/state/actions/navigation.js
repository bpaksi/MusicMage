export const navigateTo = (key, keyParam) => ({
  type: "navigateTo",
  reduce: state => ({
    navigation: {
			direction: "forward",
			stack: [...state.navigation.stack, { key, keyParam }] 
		}
  })
});

export const navigateBack = index => ({
  type: "navigateBack",
  reduce: state => ({
    navigation: {
			direction: "backward",
			stack: state.navigation.stack.slice(0, index === undefined ? 1 : index + 1)
		}
  })
});
