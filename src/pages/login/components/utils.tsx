import { jump_defaultURL, networkPortalApi } from '../../../config';
import { Button, DialogPlugin, MessagePlugin, Space } from 'tdesign-vue-next';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// TODO: 暂定any
export const toOA = (param: any, userInfo: any) => {
  const token = localStorage.getItem('token') ?? '';
  // 上网认证
  if (param.actionType === 'networkportal') {
    const { timestamp, mac, user_ip } = route.query as { [k: string]: string };
    networkPortalVerify(token, user_ip, mac, timestamp);
  } else {
    MessagePlugin.success('请稍后...');
    setTimeout(() => {
      returnSourceSystem(param.backUrl ?? jump_defaultURL, token, userInfo.usercode, userInfo.name);
    }, 1500);
  }
};

export const toGuestVerify = () => {
  router.push({
    path: '/guest-verify',
    query: {
      ...route.query,
    },
  });
};

/**
 * @returnSourceSystem
 * @登录后带参返回来源系统
 * @param {string} URL 来源系统URL
 * @param {string} TOKEN 登录token
 * @param {string} CODE 登录用户Code
 * @param {string} NAME 登录用户Name
 */
export const returnSourceSystem = (URL: string | null, TOKEN: string, CODE: string, NAME: string) => {
  const BACKURL = URL || jump_defaultURL;
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

export /**
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
