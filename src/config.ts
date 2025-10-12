const config = {
  version: '2.0.0',
  debug: false,
  jump_login: false,
  skipLoginCheck: false,
  apiHost: 'https://sso-api.mtb.wesley.net.cn/',
  oaApi: 'https://oa-api.mtb.wesley.net.cn/v2',
  api: 'https://sso-api.mtb.wesley.net.cn/v2/OAuth',
  networkPortalApi: 'http://192.168.67.14:50001/networkPortal',
  wxApi: 'https://sso-api.mtb.wesley.net.cn/v2/WxAuth',
  // jump_defaultURL: 'http://10.3.146.12/system',
  jump_defaultURL: 'https://oa-mtb.wesley.net.cn/',
};

export const { version, apiHost, api, wxApi, jump_defaultURL, skipLoginCheck, networkPortalApi } = config;

export default config;
