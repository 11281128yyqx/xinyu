import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

// Vitest 配置
// 说明：单元测试不需要 vite-plugin-vue-devtools，所以这里单独配一份，
// 与 vite.config.ts 保持 alias 一致即可。
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    // 组件测试需要 DOM 环境
    environment: 'jsdom',
    // 测试文件位置
    include: ['src/**/*.spec.ts'],
    // 全局注入 describe / it / expect，省掉每个文件重复 import
    globals: true,
    // 每次测试前清空 mock 调用记录
    clearMocks: true,
  },
})
