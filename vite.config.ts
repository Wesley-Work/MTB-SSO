import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
// import fs from 'node:fs';
// https://vite.dev/config/
const srcRootPath = path.resolve(__dirname, './src');

export default defineConfig({
  resolve: {
    alias: {
      '@': srcRootPath,
    },
  },
  server: {
    host: '0.0.0.0',
    // host: 'sso.sdzzmtb.cn',
    // https: {
    //   cert: fs.readFileSync(path.join(__dirname, './cert/_cert.pem')),
    //   key: fs.readFileSync(path.join(__dirname, './cert/key.pem')),
    // },
  },
  plugins: [vue(), vueJsx()],
});
