import type { ParamerData, userInfoInLoginStatus } from './types';

export const componentProps = {
  param: {
    type: Object as ParamerData,
    default: {},
  },
  alreadyLogin: {
    type: Boolean,
    default: false,
  },
  userName: {
    type: String,
    default: '',
  },
  userInfo: {
    type: Object as userInfoInLoginStatus,
    default: {},
  },
};
