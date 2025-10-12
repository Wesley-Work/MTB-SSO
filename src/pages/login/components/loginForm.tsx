import { componentProps } from '../../../props';
import { api, jump_defaultURL, networkPortalApi } from '../../../config';
import { DesktopIcon, LockOnIcon } from 'tdesign-icons-vue-next';
import { Button, DialogPlugin, Form, FormItem, Input, MessagePlugin, Space, type FormProps } from 'tdesign-vue-next';
import { defineComponent, reactive, ref, toRefs } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { networkPortalVerify, returnSourceSystem, toGuestVerify } from './utils';
import { subComponentsProps } from './props';

export default defineComponent({
  name: 'LoginForm',
  props: {
    ...subComponentsProps,
    ...componentProps,
  },
  setup(props) {
    const { isNetworkPortal, networkParamsIsReady, param: componentProps } = toRefs(props);

    const route = useRoute();
    const router = useRouter();

    const formRef = ref(null);
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
    const requestLock = ref(false);

    const onSubmit: FormProps['onSubmit'] = ({ validateResult, firstError }) => {
      if (validateResult === true) {
        login();
      } else {
        MessagePlugin.warning(firstError as string);
      }
    };

    const showForceChangePasswordDialog = () => {
      const pws = ref('');
      const pws2 = ref('');
      const inError = ref(false);
      DialogPlugin({
        header: '提示',
        body: () => {
          return (
            <>
              <t-space direction="vertical" size="small" style="width: 100%">
                <span style="font: var(--td-font-title-small)">当前密码是初始密码，请修改密码！</span>
                <t-space direction="vertical" size="small" style="width: 100%">
                  <div>
                    <span>新密码：</span>
                    <t-input
                      v-model={pws.value}
                      placeholder="请输入新密码"
                      status={inError.value ? 'error' : ''}
                      onFocus={() => {
                        inError.value = false;
                      }}
                    ></t-input>
                  </div>
                  <div>
                    <span>确认密码：</span>
                    <t-input
                      v-model={pws2.value}
                      placeholder="请再次输入新密码"
                      status={inError.value ? 'error' : ''}
                      onFocus={() => {
                        inError.value = false;
                      }}
                    ></t-input>
                  </div>
                </t-space>
              </t-space>
            </>
          );
        },
        cancelBtn: null,
        confirmBtn: '确定',
        closeBtn: false,
        closeOnOverlayClick: false,
        closeOnEscKeydown: false,
        onConfirm: () => {
          inError.value = false;
          if (!pws.value || !pws2.value) {
            MessagePlugin.error('需要输入内容');
            inError.value = true;
            return;
          }
          if (pws.value !== pws2.value) {
            MessagePlugin.error('两次输入的密码不一致');
            inError.value = true;
            return;
          }

          fetch(api + '/force-change-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              TOKEN: localStorage.getItem('token') ?? '',
            },
            body: 'password=' + pws.value,
          })
            .then((response) => response.json())
            .then((result) => {
              if (result.errcode == 0) {
                MessagePlugin.success('修改密码成功！');
              } else {
                MessagePlugin.error('修改密码失败：' + result.errmsg);
              }
            })
            .catch((error) => {
              MessagePlugin.error('修改密码失败：' + error);
            })
            .finally(() => {
              setTimeout(() => {
                location.reload();
              }, 1200);
            });
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
      const account = formData.account;
      const password = formData.password;
      if (account == '') {
        props?.setFormErrorStatus?.('accountInput', 'error', '账号不能为空');
        return;
      }
      if (password == '') {
        props?.setFormErrorStatus?.('passwordInput', 'error', '账号不能为空');
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
              if (userData.isDefaultPws === true) {
                showForceChangePasswordDialog();
                return;
              }
              // 返回源系统
              if (componentProps.value.backUrl) {
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
              props?.setFormErrorStatus?.('both', 'error', '账户或密码错误');
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

    return () => {
      return (
        <div class="account">
          <Form
            ref={formRef}
            data={formData}
            rules={formRule}
            label-width="0"
            style="margin-top: 20px"
            onSubmit={onSubmit}
          >
            <FormItem name="account">
              <Input
                v-model={formData.account}
                size="large"
                clearable
                placeholder="账号Code"
                v-slots={{ prefixIcon: () => <DesktopIcon /> }}
              ></Input>
            </FormItem>

            <FormItem name="password">
              <Input
                v-model={formData.password}
                type="password"
                size="large"
                clearable
                placeholder="密码"
                v-slots={{ prefixIcon: () => <LockOnIcon /> }}
              ></Input>
            </FormItem>

            <FormItem>
              <div class="sign-in-action__container" style="width: 100%; margin-top: 12px">
                <div class="sign-in-action" style="gap: 16px">
                  <div style="min-width: 110px">
                    <t-button
                      theme="primary"
                      type="submit"
                      size="large"
                      disabled={!networkParamsIsReady.value}
                      title={!networkParamsIsReady.value ? '无法完成验证！' : ''}
                      block
                    >
                      {isNetworkPortal.value ? '登录并认证' : '登录'}
                    </t-button>
                  </div>
                  {isNetworkPortal.value && (
                    <div style="min-width: 110px">
                      <Button theme="primary" size="large" variant="outline" block onClick={toGuestVerify}>
                        访客(非部门人员)认证
                      </Button>
                    </div>
                  )}
                </div>

                <div class="sign-in-action">
                  <div class="sign-in__forget-password">
                    <a href="javascript:void(0)" onClick={() => MessagePlugin.warning('请联系管理员进行重置～')}>
                      忘记帐号密码?
                    </a>
                  </div>
                </div>
              </div>
            </FormItem>
          </Form>
        </div>
      );
    };
  },
});
