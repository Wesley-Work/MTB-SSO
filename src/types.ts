export interface ParamerDataItem {
  backUrl: string;
  strongAuth: string;
  actionType: string;
  loginType: string;
}

export type ParamerData = any | ParamerDataItem;

export interface userInfoInLoginStatusItem {
  TOKEN: string;
  class: string;
  grade: string;
  group: number;
  id: number;
  join_time: string;
  login_time: string;
  login_type: string;
  name: string;
  openid: string;
  password: string;
  reg_time: string;
  remark: string;
  renewalLimit: number;
  share_device: number;
  timeout: number;
  uid: number;
  usercode: string;
}

export type userInfoInLoginStatus = any | userInfoInLoginStatusItem;

export interface LoginFormErrorStatusItem {
  status: 'default' | 'success' | 'warning' | 'error' | 'info' | null;
  tip: string;
}

export type LoginFormErrorStatus = {
  [key: string]: LoginFormErrorStatusItem;
};
