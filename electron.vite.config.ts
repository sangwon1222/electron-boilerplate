import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },

  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@pages': resolve('src/renderer/src/pages'),
        '@atoms': resolve('src/renderer/src/components/atoms'),
        '@molecules/*': resolve('src/renderer/src/components/molecules'),
        '@organisms/*': resolve('src/renderer/src/components/organisms'),
        '@template': resolve('src/renderer/src/components/template'),
        '@store': resolve('src/renderer/src/store'),
        '@util': resolve('src/renderer/src/util'),
        '@type': resolve('src/renderer/src/type'),
      },
    },
    plugins: [vue()],
  },
})
