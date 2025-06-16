import { MessagePlugin } from 'tdesign-vue-next';
import { wxApi } from '../../../config';
import useRequest from '../../../utils/request';
import { defineComponent, onMounted, onUnmounted, ref, toRefs, type PropType } from 'vue';

import './styles/scan.scss';
import { CheckCircleIcon, ErrorCircleIcon, ErrorIcon, LoadingIcon } from 'tdesign-icons-vue-next';

type MiniprogramCodeStatus = 'active' | 'expired' | 'loading' | 'scanned' | 'cancel' | 'confirm' | 'error';

interface MiniprogramCodeResponse {
  img_base64: string;
  createTime: number;
  validity: number;
  timeoutTime: number;
  type: MiniprogramCodeStatus;
  status: number;
  ticket: string;
  uid: string; //绑定扫码用
}

export default defineComponent({
  name: 'MiniprogramCode',
  props: {
    type: {
      type: String as PropType<'login' | 'bind'>,
      default: 'login',
    },
  },
  setup(props) {
    const { type } = toRefs(props);
    const api = wxApi;
    const status = ref<MiniprogramCodeStatus>('loading');
    const ticket = ref('');
    const miniprogramCodeImgBase64 = ref('');
    const checkTicketLock = ref(false);
    const ticketCheckInterval = ref<NodeJS.Timeout>();

    // 处理状态
    // 关于ticket码的Status值定义说明：
    // 400-未扫码（初始） | 401-已扫码，未确认 | 402-已扫码，操作取消 | 403-已扫码，已确认 | 404-已扫码，但由于某种原因无法完成授权 | 405-不存在（已过期）
    const handleStatus = (status: number) => {
      switch (status) {
        case 401:
          return 'active';
        case 402:
          return 'scanned';
        case 403:
          return 'confirm';
        case 404:
          return 'error';
        case 405:
          return 'expired';
        default:
          return 'active';
      }
    };

    const checkTicket = () => {
      if (checkTicketLock.value) {
        return;
      }
      if (ticket.value === '') {
        cancelCheckTicket();
        getMiniprogramCode();
        return;
      }
      checkTicketLock.value = true;
      useRequest({
        url: `${api}/checkTicketStatus`,
        useCustomURL: true,
        methods: 'POST',
        data: {
          ticket: ticket.value,
        },
        success: (res) => {
          if (res.errcode !== 0) {
            cancelCheckTicket();
            ticket.value = '';
            getMiniprogramCode();
            return;
          }
          const { data } = res as { data: MiniprogramCodeResponse };
          const { status: codeStatus } = data;
          if (codeStatus === 405) {
            ticket.value = '';
          }
          status.value = handleStatus(codeStatus);
        },
        error: () => {
          cancelCheckTicket();
          ticket.value = '';
          getMiniprogramCode();
        },
        complete: () => {
          checkTicketLock.value = false;
        },
      });
    };

    const startCheckTicket = () => {
      cancelCheckTicket();
      ticketCheckInterval.value = setInterval(() => {
        checkTicket();
      }, 1500);
    };

    const cancelCheckTicket = () => {
      clearInterval(ticketCheckInterval.value);
    };

    const getMiniprogramCode = () => {
      // 有ticket，应检查当前ticket是否有效，无效再进行获取
      if (ticket.value !== '') {
        startCheckTicket();
        return;
      }
      cancelCheckTicket();
      status.value = 'loading';
      useRequest({
        url: `${api}/getMiniProgramCode`,
        useCustomURL: true,
        methods: 'POST',
        data: {
          type: type.value,
        },
        success: (res) => {
          if (res.errcode !== 0) {
            MessagePlugin.error(res.errmsg);
            return;
          }
          const { data } = res as { data: MiniprogramCodeResponse };
          const { img_base64, status: codeStatus, ticket: codeTicket } = data;
          status.value = handleStatus(codeStatus);
          ticket.value = codeTicket;
          miniprogramCodeImgBase64.value = img_base64;
          startCheckTicket();
        },
      });
    };

    const renderStatus = () => {
      //         <symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16" id="error">
      //   <title>times-circle</title>
      //   <defs>
      //     <path d="M8.703125,8.015625 L10.125,9.421875 C10.3143944,9.62358053 10.3143944,9.939864 10.125,10.140625 C9.924239,10.3300194 9.60795553,10.3300194 9.40625,10.140625 L8,8.71875 L6.59375,10.140625 C6.39204447,10.3300194 6.075761,10.3300194 5.875,10.140625 C5.68560557,9.939864 5.68560557,9.62358053 5.875,9.421875 L7.296875,8.015625 L5.875,6.609375 C5.68560557,6.40766947 5.68560557,6.091386 5.875,5.890625 C6.075761,5.70123057 6.39204447,5.70123057 6.59375,5.890625 L8,7.3125 L9.40625,5.890625 C9.60795553,5.70123057 9.924239,5.70123057 10.125,5.890625 C10.3143944,6.091386 10.3143944,6.40766947 10.125,6.609375 L8.703125,8.015625 L8.703125,8.015625 Z M8,15.015625 C4.13400675,15.015625 1,11.8816182 1,8.015625 C1,4.14963175 4.13400675,1.015625 8,1.015625 C11.8659932,1.015625 15,4.14963175 15,8.015625 C15,11.8816182 11.8659932,15.015625 8,15.015625 Z M8,14.015625 C11.3137085,14.015625 14,11.3293335 14,8.015625 C14,4.7019165 11.3137085,2.015625 8,2.015625 C4.6862915,2.015625 2,4.7019165 2,8.015625 C2,11.3293335 4.6862915,14.015625 8,14.015625 Z" id="error_path-1"></path>
      //   </defs>
      //   <g id="error_times-circle" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      //     <mask id="error_mask-2" fill="white">
      //       <use xlink:href="#error_path-1"></use>
      //     </mask>
      //     <use id="error_Shape" fill="currentColor" xlink:href="#error_path-1"></use>
      //   </g>
      // </symbol>

      {
        /* <symbol xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 16 16" id="check">
  <title>check</title>
  <g id="check_check" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" fill-opacity="0.85">
    <path d="M5.95384424,12.5708236 L1.80680374,8.42378312 C1.55765732,8.1746367 1.55765732,7.77067409 1.80680374,7.52150275 L2.70905919,6.61922237 C2.95820561,6.37005103 3.36219315,6.37005103 3.61133956,6.61922237 L6.40498442,9.41284231 L12.3886604,3.42919122 C12.6378069,3.1800448 13.0417944,3.1800448 13.2909408,3.42919122 L14.1931963,4.3314716 C14.4423427,4.58061801 14.4423427,4.98458063 14.1931963,5.23375197 L6.85612461,12.5708485 C6.60695327,12.819995 6.20299065,12.819995 5.95384424,12.5708236 L5.95384424,12.5708236 Z" id="check_shape" fill="currentColor"></path>
  </g>
</symbol> */
      }

      const text =
        status.value === 'scanned'
          ? '已扫描，请在小程序上确认登录'
          : status.value === 'cancel'
          ? '您操作取消，请重新获取小程序码'
          : status.value === 'expired'
          ? '当前小程码已过期，请重新获取'
          : status.value === 'error'
          ? '遇到错误，请刷新页面后重试！'
          : '';
      const reTryBtn = (
        <svg fill="none" viewBox="0 0 18 18" onClick={getMiniprogramCode}>
          <path
            d="M12.7208 6.29992H11.3061C10.8083 6.29992 10.4061 6.70211 10.4061 7.19992C10.4061 7.69773 10.8083 8.09992 11.3061 8.09992H14.9061C15.4039 8.09992 15.8061 7.69773 15.8061 7.19992V3.59992C15.8061 3.10211 15.4039 2.69992 14.9061 2.69992C14.4083 2.69992 14.0061 3.10211 14.0061 3.59992V5.03992L13.5111 4.54492C11.0501 2.08398 7.06201 2.08398 4.60107 4.54492C2.14014 7.00586 2.14014 10.994 4.60107 13.4549C7.06201 15.9159 11.0501 15.9159 13.5111 13.4549C13.8626 13.1034 13.8626 12.5324 13.5111 12.1809C13.1595 11.8293 12.5886 11.8293 12.237 12.1809C10.4792 13.9387 7.63014 13.9387 5.87232 12.1809C4.11451 10.423 4.11451 7.57398 5.87232 5.81617C7.63014 4.05836 10.4792 4.05836 12.237 5.81617L12.7208 6.29992Z"
            fill="black"
            fill-opacity="0.45"
          ></path>
        </svg>
      );
      const icon =
        status.value === 'loading' ? (
          <LoadingIcon size="28px" />
        ) : status.value === 'expired' ? (
          reTryBtn
        ) : status.value === 'scanned' ? (
          <CheckCircleIcon size="32px" />
        ) : status.value === 'cancel' ? (
          reTryBtn
        ) : status.value === 'error' ? (
          <ErrorCircleIcon size="32px" />
        ) : (
          ''
        );
      const isReverse = status.value !== 'expired' && status.value !== 'cancel';
      return (
        <>
          {(icon || text) && (
            <div class="scan-login-wrapper--img__status">
              <div
                class="scan-login-wrapper--img__status-inner"
                style={{ flexDirection: isReverse ? 'column-reverse' : 'column' }}
              >
                {text}
                <div class={['scan-login-wrapper--img__status-icon', { 'is-btn': !isReverse }]}>{icon}</div>
              </div>
            </div>
          )}
        </>
      );
    };

    const renderCode = () => {
      return (
        <div class="scan-login-wrapper--img">
          {miniprogramCodeImgBase64.value && <img src={miniprogramCodeImgBase64.value} alt="小程序登录-小程序码" />}
          {renderStatus()}
        </div>
      );
    };

    onMounted(() => {
      getMiniprogramCode();
    });

    onUnmounted(() => {
      clearInterval(ticketCheckInterval.value);
    });

    return () => {
      return (
        <div class="scan-login-wrapper">
          {renderCode()}
          <div class="scan-login-wrapper--tips">使用「微信 扫一扫」扫码登录</div>
        </div>
      );
    };
  },
});
