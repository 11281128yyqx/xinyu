import { defineConfig, devices } from '@playwright/test'

// Playwright E2E 配置
//
// 说明：本机沙箱环境无法下载 Playwright 自带的 Chromium，
// 因此改为驱动系统已安装的 Microsoft Edge（同为 Chromium 内核）。
// 换一台机器时，把 channel 去掉或改成 'chromium' 即可。
export default defineConfig({
  // E2E 用例目录
  testDir: './e2e',

  // 单个用例最长 30 秒
  timeout: 30_000,

  // 断言失败自动重试一次，避免偶发不稳定
  retries: 1,

  // 串行执行，避免多个浏览器实例抢同一个 dev server
  workers: 1,

  // 报告格式：终端列出每条用例 + 生成 HTML 报告
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],

  use: {
    // 被测应用的地址
    baseURL: 'http://localhost:4173',

    // 失败时保留现场，方便排查
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',

    // 用系统 Edge，不需要额外下载浏览器
    channel: 'msedge',
  },

  projects: [
    {
      name: 'Edge Desktop',
      use: { ...devices['Desktop Edge'] },
    },
  ],

  // 自动准备被测服务
  // 这里先构建再用 vite preview 提供静态服务，有两个好处：
  //   1. 测的是「生产构建产物」，更接近用户真实看到的东西
  //   2. 不需要 Vite 的依赖预构建缓存，避免缓存目录被占用导致启动失败
  // 如果你更想测开发服务器，把 command 换成 'npm run dev -- --port 5173 --strictPort'、
  // url 和 baseURL 换成 5173 即可。
  webServer: {
    command: 'npm run build-only && npx vite preview --port 4173 --strictPort',
    url: 'http://localhost:4173',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
