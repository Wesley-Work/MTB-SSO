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
            <div class="header">
              <div class="sign-in-tab">
                <ul class="account-sign-in">
                  <li data-type="account" style="margin-bottom: 2px">
                    修改上网绑定设备 [<t-link theme="primary" @click="backIndex">返回</t-link>]
                  </li>
                </ul>
              </div>
            </div>
            <div class="session-form">
              <div
                class="alert prepend-top-20"
                :class="errorStatusClass_Both(errorStatus.both.status)"
                :style="(errorStatus.both.tip == '' || !errorStatus.both.status) && 'display: none'"
              >
                {{ errorStatus.both.tip }}
              </div>
              <!---->
              <div>
                <div class="network-bind-list__label" style="padding: 12px 0 6px">
                  <span style="font: var(--td-font-title-medium)">当前绑定设备列表</span>
                </div>
                <div class="network-bind-list__body">
                  <t-table
                    :data="tableData"
                    :columns="tableColumns"
                    bordered
                    hover
                    stripe
                    empty="无绑定设备"
                    :loading="tableLoading"
                  ></t-table>
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
import { ref, reactive, onMounted, type Ref } from 'vue';
import { MessagePlugin, type FormProps, type TableProps } from 'tdesign-vue-next';
import { api } from '../config';
import { logout } from '../utils';
import type { LoginFormErrorStatus } from '../types';
import { useRouter } from 'vue-router';
import useRequest from '../utils/request';

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

const tableLoading = ref(true);
const tableData: Ref<TableProps['data']> = ref([]);
const tableColumns: TableProps['columns'] = [
  {
    colKey: 'id',
    title: 'ID',
    width: 46,
  },
  {
    colKey: 'code',
    title: '用户Code',
    width: 120,
  },
  {
    colKey: 'name',
    title: '用户',
  },
  {
    colKey: 'ip',
    title: 'IP',
  },
  {
    colKey: 'mac',
    title: 'MAC',
  },
  {
    colKey: 'lastverify_timestamp',
    title: '上次认证时间',
  },
  {
    colKey: 'operation',
    title: '操作',
    width: '64',
    align: 'right',
    cell: (_h, { row }) => (
      <t-popconfirm theme="danger" content="确认删除吗" onConfirm={() => unBind(row.id)}>
        <t-link theme={'primary'}>解绑</t-link>
      </t-popconfirm>
    ),
  },
];

const backIndex = () => {
  router.replace('/login');
};

const initData = () => {
  resetErrorStatus();
  useRequest({
    url: '/network-portal/myBindList',
    methods: 'post',
    success: (res: any) => {
      if (res.errcode == 0) {
        tableData.value = res.data;
      } else {
        errorStatus.both.status = 'error';
        errorStatus.both.tip = `遇到错误：${res.errmsg}`;
      }
    },
    error: (err: any) => {
      errorStatus.both.status = 'error';
      errorStatus.both.tip = `错误：${err}`;
    },
    complete: () => {
      tableLoading.value = false;
    },
  });
};

const checkStatus = (callback: Function) => {
  var loginStatus = localStorage.getItem('loginStatus');
  if (loginStatus == 'true') {
    var localToken = localStorage.getItem('token') ?? '';
    setTimeout(() => {
      const xhr = new XMLHttpRequest();
      xhr.open('post', api + '/checkToken', true);
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      xhr.setRequestHeader('token', localToken);
      xhr.onload = () => {
        // this.$data.loading = false;
        var result = JSON.parse(xhr.response.replace(/\r|\n/gi, ''));
        if (result.errcode == 0) {
          if (result.data.verify) {
            callback?.();
            return;
          }
          localStorage.setItem('loginStatus', 'false');
          errorStatus.both.status = 'error';
          errorStatus.both.tip = '登录状态已过期，请重新登录';
        }
      };
      xhr.onerror = () => {
        console.error('请求错误', xhr);
      };
      xhr.send();
    }, 1800);
    return;
  }
  errorStatus.both.status = 'error';
  errorStatus.both.tip = '登录状态已过期，请重新登录';
};

const unBind = (id: number) => {
  resetErrorStatus();
  useRequest({
    url: '/network-portal/bindDel',
    methods: 'post',
    data: {
      id: id,
    },
    success: (res: any) => {
      if (res.errcode == 0) {
        MessagePlugin.success(`id为${id}的数据，解绑成功！`, 3000);
        initData();
      } else {
        errorStatus.both.status = 'error';
        errorStatus.both.tip = `遇到错误：${res.errmsg}`;
      }
    },
    error: (err: any) => {
      errorStatus.both.status = 'error';
      errorStatus.both.tip = `错误：${err}`;
    },
  });
};

onMounted(() => {
  checkStatus(initData);
});
</script>

<script lang="tsx">
export default {
  name: 'ChangePassword',
};
</script>

<style scoped>
.session {
  width: 860px;
}
</style>
