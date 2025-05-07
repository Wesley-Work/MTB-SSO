import { createApp } from 'vue';
import App from './index.vue';
import route from './router.ts';

import TDesign from 'tdesign-vue-next';

// 引入组件库全局样式资源
import 'tdesign-vue-next/es/style/index.css';
import './styles/TDtheme.css';
import './styles/Tgit.scss';

const app = createApp(App);

app.use(TDesign).use(route).mount('#sso');
