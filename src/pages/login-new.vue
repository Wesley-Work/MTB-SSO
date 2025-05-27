<template>
  <div class="session-container sign-in-box">
    <div class="session">
      <!---->
      <div class="session-logo">
        <img src="../assets/fhzsn_white.png" />
      </div>
      <!---->
      <div v-if="!props.alreadyLogin" class="session-box">
        <div class="session-box-inner">
          <div class="body">
            <div class="session-form">
              <div class="form-provider">
                <div class="header">
                  <div class="sign-in-tab">
                    <ul class="account-sign-in">
                      <li data-type="account" style="margin-bottom: 2px">
                        {{ isNetworkPortal ? '上网认证-' : '' }}密码登录
                      </li>
                    </ul>
                  </div>
                  <a class="primary link register-link" style="display: none"> 没有帐号，立即注册 </a>
                </div>
                <!---->
                <div class="account">
                  <!---->
                  <div
                    class="alert alert-warning prepend-top-20"
                    :style="networkParamsIsReady.ready && 'display: none'"
                  >
                    ⚠️ 缺少：{{ networkParamsIsReady.whoNotReady.join(' , ') }}
                    参数，无法完成上网授权。请尝试重新连接网络或联系IT处理！
                  </div>
                  <div
                    class="alert prepend-top-20"
                    :class="errorStatusClass_Both(errorStatus.both.status)"
                    :style="(errorStatus.both.tip == '' || !errorStatus.both.status) && 'display: none'"
                  >
                    {{ errorStatus.both.tip }}
                  </div>
                  <!---->
                  <t-form
                    ref="form"
                    :data="formData"
                    :rules="formRule"
                    :label-width="0"
                    style="margin-top: 20px"
                    @submit="onSubmit"
                  >
                    <t-form-item name="account">
                      <t-input v-model="formData.account" size="large" clearable placeholder="账号Code">
                        <template #prefix-icon>
                          <DesktopIcon />
                        </template>
                      </t-input>
                    </t-form-item>

                    <t-form-item name="password">
                      <t-input v-model="formData.password" type="password" size="large" clearable placeholder="密码">
                        <template #prefix-icon>
                          <LockOnIcon />
                        </template>
                      </t-input>
                    </t-form-item>

                    <t-form-item>
                      <div class="sign-in-action__container" style="width: 100%; margin-top: 12px">
                        <div class="sign-in-action" style="gap: 16px">
                          <div style="min-width: 110px">
                            <t-button
                              theme="primary"
                              type="submit"
                              size="large"
                              :disabled="!networkParamsIsReady.ready"
                              :title="!networkParamsIsReady.ready ? '无法完成验证！' : ''"
                              block
                            >
                              {{ isNetworkPortal ? '登录并认证' : '登录' }}
                            </t-button>
                          </div>
                          <div v-if="isNetworkPortal" style="min-width: 110px">
                            <t-button theme="primary" size="large" variant="outline" block @click="toGuestVerify">
                              访客(非部门人员)认证
                            </t-button>
                          </div>
                        </div>
                        <!---->
                        <div class="sign-in-action">
                          <div class="sign-in__forget-password">
                            <a href="/profile/password/forget">忘记帐号密码?</a>
                          </div>
                        </div>
                      </div>
                    </t-form-item>
                  </t-form>
                </div>
              </div>
              <!---->
              <div class="provider-separator">
                <div class="provider-header">其他登录方式</div>
              </div>
              <!---->
              <div class="providers">
                <div class="provider-action">
                  <div
                    class="provider-raw raw-center"
                    style="margin-left: -5px; margin-right: -5px; justify-content: center"
                  >
                    <div class="provider-each" style="width: 156px; max-width: 156px; margin: 0px 5px">
                      <a class="btn btn-default provider-link" @click.stop="handleToScanLogin">
                        <ScanIcon />
                        扫码登录
                      </a>
                    </div>
                    <!---->
                    <div class="provider-each" style="width: 156px; max-width: 156px; margin: 0px 5px; display: none">
                      <a class="btn btn-default provider-link">
                        <Fingerprint3Icon />
                        单次口令
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="agreements" style="display: none">
                登录视为您已同意
                <a href="https://code.tencent.com/help/agreement/service" target="_blank">服务协议</a>
                、
                <a href="https://code.tencent.com/help/agreement/privacy" target="_blank">隐私协议</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!---->
      <div v-else class="session-box">
        <div class="session-box-inner">
          <div class="body">
            <div class="session-form">
              <div class="form-provider">
                <div class="header">
                  <div class="sign-in-tab">
                    <ul class="account-sign-in">
                      <li data-type="account" style="margin-bottom: 2px">
                        Hi，{{ props.userName ?? '' }}，{{ judgmentTime() }}好 👋！
                      </li>
                    </ul>
                  </div>
                </div>
                <!---->
                <div class="alreadyLogin">
                  <!---->
                  <div
                    class="alert prepend-top-20"
                    :class="errorStatusClass_Both(errorStatus.both.status)"
                    :style="(errorStatus.both.tip == '' || !errorStatus.both.status) && 'display: none'"
                  >
                    {{ errorStatus.both.tip }}
                  </div>
                  <!---->
                  <div class="sign-in-action alreadyLogin-action">
                    <!---->
                    <div>
                      <t-button theme="primary" size="large" block @click="toOA">
                        {{ isNetworkPortal ? '绑定并认证上网' : '进入媒体部管理系统' }}
                      </t-button>
                    </div>
                    <!---->
                    <div>
                      <t-button
                        theme="primary"
                        size="large"
                        block
                        variant="dashed"
                        @click="router.push('change-bind-device')"
                      >
                        修改上网绑定设备
                      </t-button>
                    </div>
                    <!---->
                    <div>
                      <t-button theme="success" size="large" block @click="MessagePlugin.info('功能正在维护中...')">
                        绑定微信
                      </t-button>
                    </div>
                    <!---->
                    <div>
                      <t-button
                        theme="primary"
                        size="large"
                        block
                        variant="outline"
                        @click="router.push('change-password')"
                      >
                        修改密码
                      </t-button>
                      <t-button theme="danger" size="large" block variant="outline" @click="logout()">
                        退出登录
                      </t-button>
                    </div>
                    <!---->
                  </div>
                  <!---->
                </div>
              </div>
              <!---->
              <div class="agreements" style="display: none">
                登录视为您已同意
                <a href="https://code.tencent.com/help/agreement/service" target="_blank">服务协议</a>
                、
                <a href="https://code.tencent.com/help/agreement/privacy" target="_blank">隐私协议</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!---->
    </div>
  </div>
</template>

<script setup lang="tsx">
import { computed, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { componentProps } from '../props';
import { Button, DialogPlugin, MessagePlugin, Space } from 'tdesign-vue-next';
import type { FormProps } from 'tdesign-vue-next';
import { DesktopIcon, LockOnIcon, ScanIcon, Fingerprint3Icon } from 'tdesign-icons-vue-next';
import { api, jump_defaultURL, networkPortalApi } from '../config';
import type { LoginFormErrorStatus } from '../types';
import { logout } from '../utils';
import { judgmentTime } from '../utils/time';

const props = defineProps(componentProps);
const propsRef = ref(props);

const route = useRoute();
const router = useRouter();

const requestLock = ref(false);

const formData: FormProps['data'] = reactive({
  account: '',
  password: '',
});
const formRule: FormProps['rules'] = {
  account: [
    { required: true, message: '请输入账号Code', type: 'error', trigger: 'blur' },
    { required: true, message: '请输入账号Code', type: 'error', trigger: 'change' },
  ],
  password: [
    { required: true, message: '请输入密码', type: 'error', trigger: 'blur' },
    { required: true, message: '请输入密码', type: 'error', trigger: 'change' },
  ],
};
const isNetworkPortal = computed(() => {
  return propsRef.value.param.actionType === 'networkportal';
});
// 上网认证-验证参数是否完整
const networkParamsIsReady = computed(() => {
  const whoNotReady = ['timestamp', 'mac', 'user_ip'].filter((param) => !route.query[param]);
  return {
    ready: whoNotReady.length === 0 || !isNetworkPortal.value,
    whoNotReady: whoNotReady,
  };
});

const onSubmit: FormProps['onSubmit'] = ({ validateResult, firstError }) => {
  if (validateResult === true) {
    login();
  } else {
    MessagePlugin.warning(firstError as string);
  }
};

const errorStatus = reactive<LoginFormErrorStatus>({
  accountInput: {
    status: null,
    tip: '',
  },
  passwordInput: {
    status: null,
    tip: '',
  },
  both: {
    status: null,
    tip: '',
  },
});

const errorStatusClass_Both = (status: LoginFormErrorStatus['both']['status']) => {
  return status === 'info'
    ? 'alert-info'
    : status === 'success'
    ? 'alert-success'
    : status === 'warning'
    ? 'alert-warning'
    : 'alert-danger';
};

const setFormErrorStatus = (ex: string, status: LoginFormErrorStatus['both']['status'], tip: string) => {
  errorStatus[ex].status = status;
  errorStatus[ex].tip = tip;
};

const toOA = () => {
  const token = localStorage.getItem('token') ?? '';
  // 上网认证
  if (props.param.actionType === 'networkportal') {
    const { timestamp, mac, user_ip } = route.query as { [k: string]: string };
    networkPortalVerify(token, user_ip, mac, timestamp);
  } else {
    MessagePlugin.success('请稍后...');
    setTimeout(() => {
      returnSourceSystem(
        props.param.backUrl ?? jump_defaultURL,
        token,
        propsRef.value.userInfo.usercode,
        propsRef.value.userInfo.name,
      );
    }, 1500);
  }
};

const toGuestVerify = () => {
  router.push({
    path: '/guest-verify',
    query: {
      ...route.query,
    },
  });
};

/**
 * @login
 * @登录
 */
const login = () => {
  if (requestLock.value) {
    return;
  }
  requestLock.value = true;
  var account = formData.account;
  var password = formData.password;
  if (account == '') {
    setFormErrorStatus('accountInput', 'error', '账号不能为空');
    return;
  }
  if (password == '') {
    setFormErrorStatus('passwordInput', 'error', '账号不能为空');
    return;
  }
  const loading = MessagePlugin.loading('加载中...', 0);
  if (account != '' && password != '') {
    fetch(api + '/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: 'account=' + account + '&password=' + password,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.errcode == 0) {
          const userData = result.data;
          localStorage.setItem('loginStatus', 'true');
          localStorage.setItem('token', result.data.token);
          // 返回源系统
          if (props.param.backUrl) {
            MessagePlugin.success('登录成功，请稍后...');
            setTimeout(() => {
              returnSourceSystem(props.param.backUrl, result.data.token, userData.usercode, userData.name);
            }, 1500);
            return;
          }
          // 上网认证
          else if (props.param.actionType === 'networkportal') {
            const { timestamp, mac, user_ip } = route.query as { [k: string]: string };
            networkPortalVerify(result.data.token, user_ip, mac, timestamp);
          }
          // 默认刷新
          else {
            setTimeout(() => {
              location.reload();
            }, 1500);
          }
          MessagePlugin.success('登录成功');
        } else if (result.errcode == -20001) {
          MessagePlugin.error('账户或密码错误');
          errorStatus.both.status = 'error';
          errorStatus.both.tip = '账户或密码错误';
        } else {
          MessagePlugin.error('登录失败：' + result.errmsg);
        }
      })
      .catch((error) => {
        MessagePlugin.error('登录失败：' + error);
      })
      .finally(() => {
        MessagePlugin.close(loading);
      });
  }
  requestLock.value = false;
};

/**
 * @returnSourceSystem
 * @登录后带参返回来源系统
 * @param {string} URL 来源系统URL
 * @param {string} TOKEN 登录token
 * @param {string} CODE 登录用户Code
 * @param {string} NAME 登录用户Name
 */
const returnSourceSystem = (URL: string | null, TOKEN: string, CODE: string, NAME: string) => {
  const BACKURL = URL || props.param.backUrl || jump_defaultURL;
  const TIMESTAMP = Date.now();
  const Paramers: Record<string, string | number> = {
    user_token: TOKEN,
    user_code: CODE,
    user_name: NAME,
    login_time: TIMESTAMP,
    actionType: 'Login_Back',
  };

  // 判断是否是 Hash 模式
  const isHashMode = BACKURL.includes('#');

  let RETURN_URL = BACKURL;

  // 如果是 Hash 模式，将参数追加到 # 之后
  if (isHashMode) {
    const [baseUrl, hashPath] = BACKURL.split('#');
    const queryString = Object.entries(Paramers)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
    RETURN_URL = `${baseUrl}#${hashPath}?${queryString}`;
  } else {
    // 如果不是 Hash 模式，直接追加参数
    RETURN_URL = BACKURL.includes('?') ? `${BACKURL}&` : `${BACKURL}?`;
    RETURN_URL += Object.entries(Paramers)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');
  }

  const RETURN_A_ELEMENT = document.createElement('a');
  RETURN_A_ELEMENT.style.display = 'none';
  RETURN_A_ELEMENT.href = RETURN_URL;
  document.body.appendChild(RETURN_A_ELEMENT);
  RETURN_A_ELEMENT.click();
};

/**
 * @networkPortalVerify
 * @param token 登录token
 * @param user_ip 用户设备IP
 * @param mac 用户设备mac
 * @param timestamp ikuai 认证时间戳
 * @param onceVerify 是否为单次认证，false则会添加绑定，true则不会添加绑定
 */
const networkPortalVerify = (token: string, user_ip: string, mac: string, timestamp: string, onceVerify = false) => {
  const loading = MessagePlugin.loading('认证中...', 0);
  // 上网认证服务端必须和路由在一起。。。。
  fetch(networkPortalApi + '/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      token: token,
    },
    body: 'ip=' + user_ip + '&mac=' + mac + '&timestamp=' + timestamp + '&onceVerify=' + onceVerify,
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.errcode != 0) {
        MessagePlugin.error('认证失败，因为：' + result.errmsg);
        // 设备超出限制
        // if (result.errcode == -8951) {
        const Dialog = DialogPlugin.confirm({
          header: '上网认证失败',
          body: () => {
            return (
              <div>
                <div style="margin-bottom: 12px;">
                  您的绑定设备已超出您个人设备数量限制限制，您可以尝试通过以下方案完成上网认证。
                </div>
                <div style="display: flex; flex-direction: column; gap: 2px;">
                  <span>1. 移除一个已绑定设备后再次尝试认证</span>
                  <span>2. 使用上网码（找技术拿）或发起上网审批（审批需要部长和技术在OA中操作通过）</span>
                  <span>3. 联系部门IT处理</span>
                </div>
              </div>
            );
          },
          width: 640,
          confirmBtn: () => {
            return (
              <Space size="small" style="margin-left: 8px;">
                <Button
                  theme="primary"
                  variant="dashed"
                  onClick={() => {
                    Dialog.destroy();
                    router.push('change-bind-device');
                  }}
                >
                  编辑绑定设备
                </Button>
                <Button
                  theme="primary"
                  variant="outline"
                  onClick={() => {
                    Dialog.destroy();
                    toGuestVerify();
                  }}
                >
                  使用上网码
                </Button>
                <Button
                  theme="primary"
                  onClick={() => MessagePlugin.info('正在加速开发中！请使用其他方式完成上网认证！')}
                >
                  发起审批
                </Button>
              </Space>
            );
          },
          cancelBtn: '取消认证',
          onConfirm: () => {},
          onClose: () => {
            Dialog.destroy();
          },
        });
        // }
        // setTimeout(() => {
        //   location.reload();
        // }, 2500);
        return;
      }
    })
    .catch((error) => {
      MessagePlugin.error('无法认证，因为：' + error);
    })
    .finally(() => {
      MessagePlugin.close(loading);
    });
};

const handleToScanLogin = () => {
  MessagePlugin.warning('扫码服务维护中，请使用账号密码登录！');
};
</script>

<script lang="tsx">
export default {
  name: 'NewLogin',
};
</script>
