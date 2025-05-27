import type { ParamerData, userInfoInLoginStatus } from './types';

export const componentProps = {
  param: {
    type: Object as ParamerData,
  },
  alreadyLogin: {
    type: Boolean,
  },
  userName: {
    type: String,
  },
  userInfo: {
    type: Object as userInfoInLoginStatus,
  },
};
