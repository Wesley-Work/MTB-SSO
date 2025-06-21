<template>
  <svgList />
  <router-view v-slot="{ Component }">
    <div class="bg normal-bg">
      <div class="bg-image" :style="`background-image: url(${bg})`"></div>
    </div>
    <div class="bg normal-container">
      <div class="sso-container navless-container">
        <component
          :is="Component"
          :param="param"
          :already-login="alreadyLogin"
          :user-name="username"
          :user-info="userInfo"
          :bind-wechat="bindWechat"
        />
        <footer>
          <div class="copyright">
            <div>Copyright © 2025 顺德中专团委学生会媒体部 All Rights Reserved.</div>
            <span> Designed by Tencent Inc. </span>
            <div>
              <span> Powered by Wesley </span>
              <span class="copyright-link">
                <a href="https://github.com/Wesley-Work/MTB-SSO" target="__blank">仓库地址</a>
              </span>
              <span class="copyright-link">
                <a href="https://github.com/Wesley-Work/MTB-SSO/blob/develop/CHANGELOG.md" target="__blank">更新日志</a>
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  </router-view>
</template>

<script setup lang="ts">
import bg from './assets/TencentCode-Background.png';
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import svgList from './components/svg.vue';
import { api, skipLoginCheck } from './config.ts';
import { useRoute, useRouter } from 'vue-router';
import { getURLParams, logout } from './utils.ts';
import { MessagePlugin } from 'tdesign-vue-next';

const alreadyLogin = ref(false);
const param = computed(() => {
  // router参数
  const {
    backUrl: routerBackUrl,
    strongAuth: routerStrongAuth,
    actionType: routerActionType,
    loginType: routerLoginType,
  } = route.query as {
    [key: string]: string;
  };
  // 原始url参数
  const {
    backUrl: linkBackUrl,
    strongAuth: linkStrongAuth,
    actionType: linkActionType,
    loginType: linkLoginType,
  } = getURLParams() as { [key: string]: string };
  const backUrl = routerBackUrl ?? linkBackUrl ?? undefined;
  const strongAuth = routerStrongAuth ?? linkStrongAuth ?? false;
  const actionType = routerActionType ?? linkActionType ?? undefined;
  const loginType = routerLoginType ?? linkLoginType ?? 'account';
  // actionType大小写不敏感
  const actionTypeLowerCase = actionType?.toLowerCase();
  return {
    backUrl: backUrl,
    strongAuth: strongAuth,
    actionType: actionTypeLowerCase,
    loginType: loginType,
  };
});
const username = ref('');
const bindWechat = ref(false);
const userInfo = ref({});
const route = useRoute();
const router = useRouter();

const loadParam = () => {
  // 获取url参数
  router.isReady().then(() => {
    /**
     * backUrl: 登录后跳转的页面
     * strongAuth: 是否强验证
     * actionType: 登录类型，login为登录，logout为登出，NetworkPortal为上网验证
     * loginType: 登录方式，account为账号密码登录，ticket为Ticket登录
     */
    // 特定页面下，如果没有actionType参数，则加上actionType=login并刷新页面
    const actionTypeLowerCase = param.value.actionType;
    const needPushPage = ['/', '/login'];
    const paramsData = {
      ...route.query,
      ...getURLParams(),
    } as { [x: string]: string };
    if (!actionTypeLowerCase && needPushPage.includes(route.path)) {
      const newParams = {
        ...paramsData,
        actionType: 'login',
      };
      location.replace('/#/login?' + new URLSearchParams(newParams).toString());
      // location.reload();
    }
    // 登出
    if (actionTypeLowerCase === 'logout') {
      logout();
    }
    // 改密码
    if (actionTypeLowerCase === 'change-password') {
      location.replace('/#/change-password?' + new URLSearchParams(paramsData).toString());
    }
    // 改上网设备
    if (actionTypeLowerCase === 'change-bind-device') {
      location.replace('/#/change-bind-device?' + new URLSearchParams(paramsData).toString());
    }
  });
};

const init = () => {
  const cleanStatus = () => {
    localStorage.removeItem('loginStatus');
    localStorage.removeItem('token');
  };
  // 初始化状态
  alreadyLogin.value = false;
  if (!skipLoginCheck) {
    // 判断是否登录
    var loginStatus = localStorage.getItem('loginStatus');
    var token = localStorage.getItem('token');
    if (loginStatus != 'true') {
      return;
    }
    console.info('检测到了登录态，将判断登录是否有效。');
    fetch(api + '/checkToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        token: token ?? '',
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.errcode != 0 || !result?.data?.verify) {
          // 登录态无效
          cleanStatus();
          return;
        }
        // 获取用户信息
        getUserInfo();
      })
      .catch((err) => {
        console.error('请求错误:', err);
      });
  }
};

const getUserInfo = () => {
  var token = localStorage.getItem('token');
  fetch(api + '/getLoginUserInfo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      token: token ?? '',
    },
  })
    .then((res) => res.json())
    .then((result) => {
      if (result.errcode == 0) {
        alreadyLogin.value = true;
        bindWechat.value = !!result.data.unionid;
        username.value = result.data.name;
        userInfo.value = result.data;
      } else {
        // 获取用户名称出错了
        alreadyLogin.value = false;
        console.error('获取用户名称出错了');
        username.value = '请求出错';
        MessagePlugin.error('获取用户名称出错了');
      }
    })
    .catch((err) => {
      alreadyLogin.value = false;
      console.error('请求错误', err);
      username.value = '请求出错';
      MessagePlugin.error('获取用户名称出错了');
    });
};

onBeforeMount(() => {
  loadParam();
});

onMounted(() => {
  init();
});
</script>

<script lang="ts">
export default {
  name: 'MtbSSO',
};
</script>

<style lang="scss">
.copyright {
  display: flex;
  flex-direction: column;
  gap: 2px;

  .copyright-link {
    margin-left: 4px;
    cursor: pointer;
    position: relative;
    & a {
      color: #fff;
      text-decoration: none;
      &:hover {
        text-decoration: none !important;
      }
    }
    &::after {
      content: ' ';
      height: 1.25px;
      background-color: #f5f5f5;
      width: 0px;
      position: absolute;
      bottom: -1px;
      left: 50%;
      transition: 0.28s width cubic-bezier(0.4, 0, 0.2, 1);
      transform: translate(-50%, 0);
    }
    &:hover {
      &::after {
        width: 100%;
      }
    }
  }
}

.--we-tag-black.t-avatar {
  color: #fff;
  background: #979797;
}
</style>
