export const subComponentsProps = {
  isNetworkPortal: {
    type: Boolean,
    default: false,
  },
  networkParamsIsReady: {
    type: Boolean,
    default: false,
  },
  setFormErrorStatus: {
    type: Function,
    default: () => {},
  },
};
