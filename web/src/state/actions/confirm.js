const scope = "confirm";

export const confirm = (title, body, onConfirm) => ({
  type: "confirm",
  scope,
  parameters: { title, body, onConfirm },
  reduce: () => ({ open: true, title, body, onConfirm })
});

export const confirmConfirmed = () => ({
  type: "confirmConfirmed",
  scope,
  reduce: () => ({ open: false }),
  afterReduce: ({ getState }) => {
    const confirm = getState();
    confirm.onConfirm();
  }
});

export const confirmCanceled = () => ({
  type: "confirmCanceled",
  scope,
  reduce: () => ({ open: false })
});
