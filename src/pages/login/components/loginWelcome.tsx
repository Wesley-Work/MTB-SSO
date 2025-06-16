import { logout } from '../../../utils';
import { componentProps } from '../../../props';
import { defineComponent, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MessagePlugin } from 'tdesign-vue-next';
import { toOA } from './utils';
import { subComponentsProps } from './props';

export default defineComponent({
  name: 'LoginWelcome',
  props: {
    ...subComponentsProps,
    ...componentProps,
  },
  setup(props) {
    const { isNetworkPortal, param: componentProps, userInfo } = toRefs(props);

    const route = useRoute();
    const router = useRouter();

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

            <div>
              <t-button theme="success" size="large" block onClick={() => MessagePlugin.info('功能正在维护中...')}>
                绑定微信
              </t-button>
            </div>

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
