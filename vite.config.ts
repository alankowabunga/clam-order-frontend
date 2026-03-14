import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080', // 替換成實際後端的 URL 與 Port
      changeOrigin: true,
    }
  }
}
});
