const scope = "notify";

export const notifyMessage = message => ({
  type: "notifyMessage",
  ...createMessage(message)
});

export const notifySuccess = message => ({
  type: "notifySuccess",
  ...createMessage(message, "success")
});

export const notifyError = (message, extra) => ({
  type: "notifyError",
  ...createMessage(message, "error", extra)
});

export const notifyClose = () => ({
  type: "notifyClose",
  scope,
  reduce: () => ({ open: false })
});

export const notifyExit = () => ({
  type: "notifyExit",
  scope,
  reduce: state => ({
    open: state.messages.length > 1,
    messages: [...state.messages.slice(1)]
  })
});

const createMessage = (message, type, extra) => ({
  parameters: { message, extra },
  scope,
  reduce: state => ({
    open: !state.open,
    messages: [...state.messages, { message, type }]
  })
});
