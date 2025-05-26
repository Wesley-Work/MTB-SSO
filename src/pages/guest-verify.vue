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
            <div class="form-provider">
              <div class="header">
                <div class="sign-in-tab">
                  <ul class="account-sign-in">
                    <li data-type="account" style="margin-bottom: 2px">
                      非部门人员-上网认证by上网码 [<t-link theme="primary" @click="backIndex">返回</t-link>]
                    </li>
                  </ul>
                </div>
              </div>
              <div class="session-form">
                <div class="alert alert-warning prepend-top-20" :style="networkParamsIsReady.ready && 'display: none'">
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
                <div>
                  <t-form
                    ref="form"
                    :data="formData"
                    :rules="formRule"
                    :label-width="0"
                    style="margin-top: 20px"
                    @submit="onSubmit"
                  >
                    <t-form-item name="code">
                      <t-input v-model="formData.code" size="large" clearable placeholder="上网码">
                        <template #prefix-icon>
                          <KeyIcon />
                        </template>
                      </t-input>
                    </t-form-item>

                    <t-form-item>
                      <div class="sign-in-action__container" style="width: 100%; margin-top: 12px">
                        <div class="sign-in-action">
                          <div style="min-width: 220px">
                            <t-button
                              theme="primary"
                              type="submit"
                              size="large"
                              block
                              :disabled="!networkParamsIsReady.ready"
                            >
                              验证上网码
                            </t-button>
                          </div>
                        </div>
                      </div>
                    </t-form-item>
                  </t-form>
                </div>
                <!---->
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
import { reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import { KeyIcon } from 'tdesign-icons-vue-next';
import { networkPortalApi } from '../config';
import type { FormProps } from 'tdesign-vue-next';
import type { LoginFormErrorStatus } from '../types';

const route = useRoute();
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
// const resetErrorStatus = () => {
//   errorStatus.both.status = null;
//   errorStatus.both.tip = '';
// };
const formData: FormProps['data'] = reactive({
  code: '',
});
const formRule: FormProps['rules'] = {
  code: [
    { required: true, message: '请输入上网码', type: 'error', trigger: 'submit' },
    { required: true, message: '请输入上网码', type: 'error', trigger: 'change' },
  ],
};

const backIndex = () => {
  router.replace('/login');
};

// 上网认证-验证参数是否完整
const networkParamsIsReady = computed(() => {
  const whoNotReady = ['timestamp', 'mac', 'user_ip'].filter((param) => !route.query[param]);
  return {
    ready: whoNotReady.length === 0,
    whoNotReady: whoNotReady,
  };
});

const onSubmit: FormProps['onSubmit'] = ({ validateResult }) => {
  if (validateResult === true) {
    const loading = MessagePlugin.loading('认证中...', 0);
    const { ip, mac, timestamp } = route.query;
    fetch(networkPortalApi + '/internet-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: 'ip=' + ip + '&mac=' + mac + '&timestamp=' + timestamp + '&code=' + formData.code,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.errcode != 0) {
          MessagePlugin.error('认证失败，因为：' + result.errmsg);
          return;
        }
      })
      .catch((error) => {
        MessagePlugin.error('无法认证，因为：' + error);
      })
      .finally(() => {
        MessagePlugin.close(loading);
      });
  }
};
</script>

<script lang="tsx">
export default {
  name: 'GuestVerify',
};
</script>

<style scoped>
.session {
  width: 540px;
}
</style>
