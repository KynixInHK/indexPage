import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/time': {
        target: 'https://f.m.suning.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/time/, '')
      },
      '/weather': {
        target: 'https://geoapi.qweather.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/weather/, '')
      },
      '/wea': {
        target: 'https://devapi.qweather.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wea/, '')
      },
      '/sug': {
        target: 'https://sp0.baidu.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sug/, '')
      }
    }
  }
})
