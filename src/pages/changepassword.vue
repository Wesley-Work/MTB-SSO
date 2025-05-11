<template>
  <div class="session-container sign-in-box">
    <div class="session">
      <!---->
      <div class="session-logo">
        <img src="../assets/fhzsn_white.png" />
      </div>
      <!---->
      <div class="session-box">
        <div class="session-box-inner">
          <div class="body">
            <div class="session-form">
              <div class="form-provider">
                <div class="header">
                  <div class="sign-in-tab">
                    <ul class="account-sign-in">
                      <li data-type="account" style="margin-bottom: 2px">
                        修改密码 [<t-link theme="primary" @click="backIndex">返回登录</t-link>]
                      </li>
                    </ul>
                  </div>
                </div>
                <!---->
                <div>
                  <!---->
                  <div
                    class="alert prepend-top-20"
                    :class="errorStatusClass_Both(errorStatus.both.status)"
                    :style="(errorStatus.both.tip == '' || !errorStatus.both.status) && 'display: none'"
                  >
                    {{ errorStatus.both.tip }}
                  </div>
                  <!---->
                  <div
                    class="sign-in-action"
                    style="
                      min-width: 110px;
                      padding: 12px;
                      display: flex;
                      flex-direction: column;
                      gap: 8px;
                      margin: 24px 0 0;
                    "
                    :style="!(errorStatus.both.tip == '' || !errorStatus.both.status) && 'margin-top: 0'"
                  >
                    <!---->
                    <div v-if="current == 1" class="reset-password-box">
                      <div class="verify-user">
                        <div v-if="!checking && !checkOk" class="mtb-form-input">
                          <div style="display: flex; justify-content: center; padding: 22px 0px">
                            <svg
                              aria-hidden="true"
                              class="mtb-svg-icon mtb-logo"
                              style="width: 42px; height: 42px; color: rgb(51, 51, 51); transform: scale(1.8)"
                            >
                              <use xlink:href="#close"></use>
                            </svg>
                          </div>
                          <div class="mtb-input-label" style="text-align: center; margin-top: 18px; font-size: 18px">
                            验证失败，请重新登录
                          </div>
                          <!---->
                        </div>
                        <!---->
                        <div v-else class="mtb-form-input">
                          <div class="mtb-input-group">
                            <!---->
                            <div
                              v-if="state != '验证成功'"
                              style="display: flex; justify-content: center; padding: 38px 0px"
                            >
                              <div class="circle-loader">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                              </div>
                            </div>
                            <!---->
                            <div v-else style="display: flex; justify-content: center; padding: 14px 0px">
                              <svg
                                aria-hidden="true"
                                class="mtb-svg-icon mtb-logo"
                                style="width: 42px; height: 42px; color: rgb(51, 51, 51); transform: scale(1.4)"
                              >
                                <use xlink:href="#check"></use>
                              </svg>
                            </div>
                          </div>
                          <!---->
                          <div
                            v-if="state != '验证成功'"
                            class="mtb-input-label"
                            style="text-align: center; margin-top: 18px; font-size: 18px"
                          >
                            <span>正在验证账号</span>{{ state }}
                          </div>
                          <!---->
                          <div
                            v-else
                            class="mtb-input-label"
                            style="text-align: center; margin-top: 14px; font-size: 18px"
                          >
                            {{ state }}
                          </div>
                          <!---->
                        </div>
                        <!---->
                      </div>
                    </div>
                    <!---->
                    <t-form
                      ref="form"
                      :data="formData"
                      :rules="formRules"
                      label-align="top"
                      :colon="true"
                      @submit="submit"
                    >
                      <div v-if="current == 2" class="reset-password-box">
                        <t-form-item label="输入账号原密码" name="oldPws">
                          <t-input v-model="formData.oldPws" placeholder="请输入"></t-input>
                        </t-form-item>
                        <!---->
                        <t-form-item label="输入账号新密码" name="newPws">
                          <t-input v-model="formData.newPws" placeholder="请输入"></t-input>
                        </t-form-item>
                        <!---->
                        <t-form-item label="确认密码" name="rePws">
                          <t-input v-model="formData.rePws" type="password"></t-input>
                        </t-form-item>
                      </div>
                      <!---->
                      <div class="action" style="display: flex; flex-direction: column; gap: 4px">
                        <t-button
                          v-if="current !== 1"
                          block
                          size="large"
                          @click="() => (!checkOk ? backIndex() : lastStep())"
                          >{{ !checkOk ? '返回登录' : '上一步' }}</t-button
                        >
                        <div v-if="!!checkOk">
                          <t-button v-if="current !== 2" block size="large" @click="nextStep"> 下一步 </t-button>
                          <t-button v-else block size="large" type="submit"> 提交 </t-button>
                        </div>
                      </div>
                    </t-form>
                    <!---->
                    <div class="mtb-service-links">
                      <p style="margin-bottom: 0px; text-align: center">
                        遇到问题？
                        <t-link theme="primary">请联系技术人员</t-link>
                        以获得支持
                      </p>
                    </div>
                  </div>
                  <!---->
                </div>
              </div>
              <!---->
            </div>
          </div>
        </div>
      </div>
      <!---->
    </div>
  </div>
</template>

<script setup lang="tsx">
import { ref, reactive, onMounted } from 'vue';
import { MessagePlugin, type FormProps } from 'tdesign-vue-next';
import { api } from '../config';
import { logout } from '../utils';
import type { LoginFormErrorStatus } from '../types';
import { useRouter } from 'vue-router';

const router = useRouter();

const errorStatus = reactive<LoginFormErrorStatus>({
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
const resetErrorStatus = () => {
  errorStatus.both.status = null;
  errorStatus.both.tip = '';
};
const current = ref(1);
const token = ref('');
const state = ref('安全');
const checking = ref(true);
const checkOk = ref(false);
const formData = reactive({
  account: '',
  oldPws: '',
  newPws: '',
  rePws: '',
});
const formRules = {
  oldPws: [
    { required: true, message: '原密码必填', type: 'error', trigger: 'blur' },
    { required: true, message: '原密码必填', type: 'error', trigger: 'change' },
  ],
  newPws: [
    { required: true, message: '新密码必填', type: 'error', trigger: 'blur' },
    { required: true, message: '新密码必填', type: 'error', trigger: 'change' },
    { whitespace: true, message: '新密码不能为空' },
  ],
  rePws: [
    { required: true, message: '二次密码必填', type: 'error' },
    {
      validator: (val: string) => {
        return new Promise((resolve) => {
          const timer = setTimeout(() => {
            resolve(formData.newPws === val);
            clearTimeout(timer);
          });
        });
      },
      message: '两次密码不一致',
      trigger: 'change',
    },
  ],
};

const backIndex = () => {
  router.replace('/login');
};

const nextStep = () => {
  if (current.value == 1) {
    current.value += 1;
  }
};
const lastStep = () => {
  current.value -= 1;
};

const submit: FormProps['onSubmit'] = ({ validateResult, firstError }) => {
  resetErrorStatus();
  if (validateResult === true) {
    const { oldPws, newPws } = formData;
    var url = api + '/changePassword';
    const xhr = new XMLHttpRequest();
    xhr.open('post', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    xhr.setRequestHeader('token', token.value);
    xhr.onload = () => {
      var result = JSON.parse(xhr.response.replace(/\r|\n/gi, ''));
      let errorText;
      if (result.errcode == 0) {
        MessagePlugin.success('更改成功，请重新登录！');
        setTimeout(() => {
          logout();
        }, 1500);
        return;
      } else if (result.errcode == -10001) {
        errorText = '无法加密密码信息';
      } else if (result.errcode == -10002) {
        errorText = '找不到用户';
      } else if (result.errcode == -10003) {
        errorText = '原密码错误';
      } else if (result.errcode == -1005) {
        errorText = 'Token不存在或已过期，请重新登录！';
      } else {
        errorText = result.errmsg;
      }
      errorStatus.both.status = 'error';
      errorStatus.both.tip = `修改密码失败：${errorText}`;
    };
    xhr.onerror = () => {
      console.error('请求错误', xhr);
    };
    xhr.send('oldpassword=' + oldPws + '&newpassword=' + newPws);
  } else {
    // MessagePlugin.warning(firstError as string);
    errorStatus.both.status = 'error';
    errorStatus.both.tip = firstError as string;
  }
};

onMounted(() => {
  checking.value = true;
  var loginStatus = localStorage.getItem('loginStatus');
  if (loginStatus == 'true') {
    console.info('检测到了登录态信息，正在判断登录态是否有效。');
    var localToken = localStorage.getItem('token');
    token.value = localToken ?? '';
    setTimeout(() => {
      state.value = '登录态';
      const xhr = new XMLHttpRequest();
      xhr.open('post', api + '/checkToken', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      xhr.setRequestHeader('token', token.value);
      xhr.onload = () => {
        // this.$data.loading = false;
        var result = JSON.parse(xhr.response.replace(/\r|\n/gi, ''));
        if (result.errcode == 0) {
          if (result.data.verify) {
            state.value = '验证成功';
            checkOk.value = true;
          } else {
            localStorage.setItem('loginStatus', 'false');
            state.value = '验证失败，请重新登录';
          }
        } else {
          localStorage.setItem('loginStatus', 'false');
        }
        checkOk.value = false;
        checking.value = false;
      };
      xhr.onerror = () => {
        console.error('请求错误', xhr);
        checking.value = false;
      };
      xhr.send();
    }, 1800);
  } else {
    setTimeout(() => {
      checkOk.value = false;
    }, 1800);
  }
});
</script>

<script lang="tsx">
export default {
  name: 'ChangePassword',
};
</script>

<style>
.circle-loader {
  position: relative;
  width: auto;
  height: auto;
}

.circle-loader div {
  height: 10px;
  width: 10px;
  background-color: #434343;
  border-radius: 50%;
  position: absolute;
  -webkit-animation: 0.8s opaque ease-in-out infinite both;
  animation: 0.8s opaque ease-in-out infinite both;
}

.circle-loader > div:nth-child(1) {
  top: -25px;
  left: 0;
}

.circle-loader > div:nth-child(2) {
  top: -17px;
  left: 17px;
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}

.circle-loader > div:nth-child(3) {
  top: 0;
  left: 25px;
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

.circle-loader > div:nth-child(4) {
  top: 17px;
  left: 17px;
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}

.circle-loader > div:nth-child(5) {
  top: 25px;
  left: 0;
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

.circle-loader > div:nth-child(6) {
  top: 17px;
  left: -17px;
  -webkit-animation-delay: 0.5s;
  animation-delay: 0.5s;
}

.circle-loader > div:nth-child(7) {
  top: 0;
  left: -25px;
  -webkit-animation-delay: 0.6s;
  animation-delay: 0.6s;
}

.circle-loader > div:nth-child(8) {
  top: -17px;
  left: -17px;
  -webkit-animation-delay: 0.7s;
  animation-delay: 0.7s;
}

@keyframes opaque {
  0% {
    opacity: 0.1;
  }

  40% {
    opacity: 1;
  }

  80% {
    opacity: 0.1;
  }

  100% {
    opacity: 0.1;
  }
}
</style>
