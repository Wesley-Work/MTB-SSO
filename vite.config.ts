import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import path from 'path';
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
  },
  plugins: [vue(), vueJsx()],
});
