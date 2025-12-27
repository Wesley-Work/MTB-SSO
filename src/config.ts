const config = {
  version: '3.2.0',
  debug: false,
  jump_login: false,
  skipLoginCheck: false,
  apiHost: 'https://sso.api.sdzzmtb.cn/',
  oaApi: 'https://oa.api.sdzzmtb.cn/v2',
  api: 'https://sso.api.sdzzmtb.cn/v2/OAuth',
  networkPortalApi: 'http://192.168.67.14:50001/networkPortal',
  wxApi: 'https://sso.api.sdzzmtb.cn/v2/WxAuth',
  jump_defaultURL: 'https://oa.sdzzmtb.cn/',
};

export const { version, apiHost, api, wxApi, jump_defaultURL, skipLoginCheck, networkPortalApi } = config;

export default config;
