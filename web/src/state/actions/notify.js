export const notifyMessage = message => ({
  type: "notifyMessage",
  parameters: { message },
  reduce: (state) => ({
    notify: {
      messages: [...state.notify.messages, {message}]
    }
  })
});

export const notifySuccess = message => ({
  type: "notifySuccess",
  parameters: { message },
  reduce: (state) => ({
    notify: {
      messages: [...state.notify.messages, {message, type: "success"}]
    }
  })
});

export const notifyError = (message, extra) => ({
  type: "notifyError",
  parameters: { message, extra },
  reduce: (state) => ({
    notify: {
      messages: [...state.notify.messages, {message, type: "error"}]
		}
	})
});

export const notifyClose = () => ({
  type: "notifyClose",
  reduce: (state) => ({
    notify: {
      messages: [...state.notify.messages.slice(1)]
		}
	})
});


