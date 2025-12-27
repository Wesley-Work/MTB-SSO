import { logout } from '../../../utils';
import { componentProps } from '../../../props';
import { defineComponent, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { DialogPlugin, MessagePlugin } from 'tdesign-vue-next';
import { toOA } from './utils';
import { subComponentsProps } from './props';
import useRequest from '../../../utils/request';
import { wxApi } from '../../../config';
import MiniprogramCode from './scan/miniprogramCode';

export default defineComponent({
  name: 'LoginWelcome',
  props: {
    ...subComponentsProps,
    ...componentProps,
  },
  setup(props) {
    const { isNetworkPortal, param: componentProps, userInfo, bindWechat } = toRefs(props);

    const route = useRoute();
    const router = useRouter();

    const handleBindWechat = () => {
      const dialog = DialogPlugin({
        header: '绑定微信',
        body: () => {
          return <MiniprogramCode type="auth" uid={userInfo.value.uid} {...props} />;
        },
        cancelBtn: null,
        confirmBtn: null,
        onClose: () => {
          dialog.destroy();
        },
      });
    };

    const handleUnBindWechat = () => {
      useRequest({
        url: `${wxApi}/unbind`,
        useCustomURL: true,
        methods: 'POST',
        data: {
          unionid: userInfo.value?.unionid,
        },
        success: (res) => {
          if (res.errcode !== 0) {
            MessagePlugin.error(`解绑失败： ${res.errmsg}`);
            return;
          }
          MessagePlugin.success(`解绑成功`);
          setTimeout(() => {
            location.reload();
          }, 800);
        },
        error: (e: any) => {
          MessagePlugin.error(`解绑失败： ${e}`);
        },
      });
    };

    const renderBindWechatBtn = () => {
      if (bindWechat.value) {
        return (
          <t-button theme="success" size="large" block variant="outline" onClick={handleUnBindWechat}>
            解绑微信
          </t-button>
        );
      }
      return (
        <t-button theme="success" size="large" block onClick={handleBindWechat}>
          绑定微信
        </t-button>
      );
    };

    return () => {
      return (
        <div class="alreadyLogin">
          <div class="sign-in-action alreadyLogin-action">
            <div>
              <t-button theme="primary" size="large" block onClick={() => toOA(componentProps.value, userInfo.value)}>
                {isNetworkPortal.value ? '绑定并认证上网' : '进入媒体部管理系统'}
              </t-button>
            </div>

            <div>
              <t-button
                theme="primary"
                size="large"
                block
                variant="dashed"
                onClick={() => router.push('change-bind-device')}
              >
                修改上网绑定设备
              </t-button>
            </div>

            <div>{renderBindWechatBtn()}</div>

            <div>
              <t-button
                theme="primary"
                size="large"
                block
                variant="outline"
                onClick={() => router.push('change-password')}
              >
                修改密码
              </t-button>
              <t-button theme="danger" size="large" block variant="outline" onClick={logout}>
                退出登录
              </t-button>
            </div>
          </div>
        </div>
      );
    };
  },
});
