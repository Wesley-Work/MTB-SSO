import { defineComponent, onMounted } from 'vue';
import * as wecomSdk from '@wecom/jssdk';
import './wecom.less';
import { componentProps } from '../../../../props';
import { MessagePlugin } from 'tdesign-vue-next';
import useRequest from '../../../../utils/request';

export default defineComponent({
  name: 'WecomCode',
  props: {
    ...componentProps,
  },
  setup(props) {
    onMounted(() => {
      const wecom = wecomSdk.createWWLoginPanel({
        el: '#wecom-login-container',
        params: {
          login_type: wecomSdk.WWLoginType.corpApp,
          appid: 'wwfb90560de2515879',
          agentid: '1000011',
          redirect_uri: 'https://sso.sdzzmtb.cn',
          redirect_type: wecomSdk.WWLoginRedirectType.callback,
          panel_size: wecomSdk.WWLoginPanelSizeType.small,
        },
        onLoginSuccess({ code }) {
          useRequest({
            url: `/wecom/login`,
            methods: 'POST',
            data: {
              code,
            },
            success: (res) => {
              if (res.errcode !== 0) {
                MessagePlugin.error(`登录失败： ${res.errmsg}`);
                return;
              }
              MessagePlugin.success('登录成功！');
              localStorage.setItem('loginStatus', 'true');
              localStorage.setItem('token', res.data?.token || '');
              setTimeout(() => {
                location.reload();
              }, 1500);
            },
            error: (e: any) => {
              MessagePlugin.error(`企业微信扫码登录失败： ${e}`);
            },
          });
        },
        onLoginFail(err) {
          MessagePlugin.error(`企业微信扫码登录失败： ${err || '未知错误'}`);
        },
      });
    });

    return () => {
      return (
        <div style="display: flex;justify-content: center;">
          <div id="wecom-login-container" class="wecom-container"></div>
        </div>
      );
    };
  },
});
