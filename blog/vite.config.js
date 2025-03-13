import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/ai-api': {
        target: 'https://api.siliconflow.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false
      },
      '/translate-api': {
        target: 'https://fanyi-api.baidu.com/api/trans/vip/translate',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/translate-api/, ''),
        secure: false
      }
    }
  }
})
