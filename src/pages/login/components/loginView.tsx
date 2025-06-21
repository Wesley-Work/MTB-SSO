import { Fingerprint3Icon, KeyIcon, ScanIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';
import { defineComponent, toRefs, ref, computed, reactive } from 'vue';
import LoginWelcome from './loginWelcome';
import LoginScan from './loginScan';
import { componentProps } from '../../../props';
import { useRoute, useRouter } from 'vue-router';
import type { LoginFormErrorStatus } from '../../../types';
import LoginForm from './loginForm';
import { judgmentTime } from '../../../utils/time';

export default defineComponent({
  name: 'LoginView',
  props: {
    ...componentProps,
  },
  setup(props) {
    const { alreadyLogin, param: propsRef, userName, userInfo, bindWechat } = toRefs(props);

    const route = useRoute();
    const router = useRouter();

    const isNetworkPortal = computed(() => {
      return propsRef.value?.actionType === 'networkportal';
    });
    // 上网认证-验证参数是否完整
    const networkParamsIsReady = computed(() => {
      const whoNotReady = ['timestamp', 'mac', 'user_ip'].filter((param) => !route.query[param]);
      return {
        ready: whoNotReady.length === 0 || !isNetworkPortal.value,
        whoNotReady: whoNotReady,
      };
    });

    const isScanLogin = computed(() => {
      return propsRef.value?.actionType === 'scan-login';
    });

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

    const handleToScanLogin = () => {
      router.push({
        path: '/login',
        query: {
          ...route.query,
          actionType: 'Scan-Login',
        },
      });
    };

    const handleToPwsLogin = () => {
      router.push({
        path: '/login',
        query: {
          ...route.query,
          actionType: 'login',
        },
      });
    };

    const setFormErrorStatus = (ex: string, status: LoginFormErrorStatus['both']['status'], tip: string) => {
      errorStatus[ex].status = status;
      errorStatus[ex].tip = tip;
    };

    const renderViewHeader = () => {
      const getSubComponentTitle = () => {
        if (alreadyLogin.value) {
          return (
            <span>
              Hi，{userName.value ?? ''}，{judgmentTime()}好 👋！
            </span>
          );
        } else if (isScanLogin.value) {
          return <span>扫码登录</span>;
        } else {
          return isNetworkPortal.value ? <span>上网认证-密码登录</span> : <span>密码登录</span>;
        }
      };
      return (
        <div class="header">
          <div class="sign-in-tab">
            <ul class="account-sign-in">
              <li data-type="account" style="margin-bottom: 2px">
                {getSubComponentTitle()}
              </li>
            </ul>
          </div>
          <a class="primary link register-link" style="display: none">
            没有帐号，立即注册
          </a>
        </div>
      );
    };

    const renderViewComponent = () => {
      const generalSubComponentsProps = {
        bindWechat: bindWechat.value,
        param: { ...propsRef.value },
      };
      const subComponentsProps = {
        isNetworkPortal: isNetworkPortal.value,
        networkParamsIsReady: networkParamsIsReady.value.ready,
        setFormErrorStatus: setFormErrorStatus,
        userName: userName.value,
        userInfo: userInfo.value,
        ...generalSubComponentsProps,
      };
      // 子组件优先级： LoginWelcome > LoginScan > LoginForm
      // LoginWelcome: alreadyLogin === true
      // LoginScan: ScanLogin === true
      // LoginForm: !ScanLogin === true
      const getSubComponent = () => {
        if (alreadyLogin.value) {
          return <LoginWelcome {...subComponentsProps}></LoginWelcome>;
        } else if (isScanLogin.value) {
          return <LoginScan {...generalSubComponentsProps}></LoginScan>;
        } else {
          return <LoginForm {...subComponentsProps}></LoginForm>;
        }
      };
      return (
        <>
          <div class="tips">
            {!networkParamsIsReady.value.ready && (
              <div class="alert alert-warning prepend-top-20">
                ⚠️ 缺少：{networkParamsIsReady.value.whoNotReady.join(' , ')}
                参数，无法完成上网授权。请尝试重新连接网络或联系IT处理！
              </div>
            )}
            {!(errorStatus.both.tip == '' || !errorStatus.both.status) && (
              <div class={['alert', 'prepend-top-20', errorStatusClass_Both(errorStatus.both.status)]}>
                {errorStatus.both.tip}
              </div>
            )}
          </div>
          {getSubComponent()}
        </>
      );
    };

    const renderViewFooter = () => {
      const commonStyle = {
        width: '156px',
        maxWidth: '156px',
        margin: '0px 5px',
      };

      const renderBtn = () => {
        return (
          <>
            {!isScanLogin.value && (
              <div class="provider-each" style={commonStyle}>
                <a class="btn btn-default provider-link" onClick={handleToScanLogin}>
                  <ScanIcon />
                  扫码登录
                </a>
              </div>
            )}

            {isScanLogin.value && (
              <div class="provider-each" style={commonStyle}>
                <a class="btn btn-default provider-link" onClick={handleToPwsLogin}>
                  <KeyIcon />
                  密码登录
                </a>
              </div>
            )}

            <div class="provider-each" style={{ ...commonStyle, display: 'none' }}>
              <a class="btn btn-default provider-link">
                <Fingerprint3Icon />
                单次口令
              </a>
            </div>
          </>
        );
      };

      return (
        <>
          <div class="provider-separator">
            <div class="provider-header">其他登录方式</div>
          </div>

          <div class="providers">
            <div class="provider-action">
              <div
                class="provider-raw raw-center"
                style="margin-left: -5px; margin-right: -5px; justify-content: center"
              >
                {renderBtn()}
              </div>
            </div>
          </div>
          <div class="agreements" style="display: none">
            登录视为您已同意
            <a href="https://code.tencent.com/help/agreement/service" target="_blank">
              服务协议
            </a>
            、
            <a href="https://code.tencent.com/help/agreement/privacy" target="_blank">
              隐私协议
            </a>
          </div>
        </>
      );
    };

    return () => {
      return (
        <div class="session-box">
          <div class="session-box-inner">
            <div class="body">
              <div class="session-form">
                <div class="form-provider">
                  {renderViewHeader()}
                  {renderViewComponent()}
                </div>
                {!alreadyLogin.value && renderViewFooter()}
              </div>
            </div>
          </div>
        </div>
      );
    };
  },
});
