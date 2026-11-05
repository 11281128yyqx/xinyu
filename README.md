# 心语 · AI 角色对话应用

一个 Vue 3 + TypeScript 的角色扮演对话应用：选一个角色，和 TA 聊天。四个角色各有独立的 system prompt 与回复风格，消息本地持久化，带打字机效果与「思考中」状态。

## 功能

- **四个角色，四种人格**：小暖（温柔）、阿哲（理性）、乐乐（活泼）、小苏（鼓励），通过不同的 system prompt 控制语气
- **真实模型对话**：调用 DeepSeek Chat API，按角色注入 system prompt，多轮上下文自动拼接
- **打字机效果**：逐字输出，可随时中断
- **本地持久化**：消息写入 `localStorage`，刷新不丢；切换角色时重置会话
- **异常降级**：接口失败时给出友好提示，不白屏、不丢上下文
- **质量保障**：Vitest 单元测试 + Playwright E2E + GitHub Actions CI

## 技术栈

| 层 | 选型 |
|---|---|
| 框架 | Vue 3（`<script setup>`）+ TypeScript |
| 状态管理 | Pinia（Composition API 风格 store） |
| 路由 | Vue Router |
| 构建 | Vite |
| 单元测试 | Vitest + @vue/test-utils + jsdom |
| E2E | Playwright |
| CI | GitHub Actions（type-check → test → build） |

## 目录结构

```
src/
├── views/
│   ├── HomeView.vue      # 角色选择页
│   └── ChatView.vue      # 对话页
├── components/
│   ├── RoleCard.vue      # 角色卡片
│   ├── MessageList.vue   # 消息列表
│   ├── MessageInput.vue  # 输入框
│   └── ChatHeader.vue    # 对话页头部
├── stores/
│   └── chat.ts           # 核心 store：角色、消息、发送、持久化
└── router/
e2e/
└── chat-flow.spec.ts     # 端到端对话流程
```

## 本地运行

```bash
npm install

# 配置模型密钥（不要提交到仓库）
echo "VITE_DEEPSEEK_API_KEY=sk-xxxx" > .env.local

npm run dev        # 开发
npm run type-check # 类型检查
npm run test       # 单元测试
npm run test:e2e   # E2E
npm run build      # 生产构建
```

> 没配 Key 也能打开界面、切换角色、看到欢迎语，只是发送消息时会走到异常降级分支。

## 几个实现上的取舍

**1. 状态为什么放在 Pinia 而不是组件里**

早期消息状态散落在 `ChatView` 和 `MessageList` 里，切换角色时出现「旧消息串到新角色」的问题。统一收到 `chat` store 后，角色与消息成为同一份状态，`selectRole()` 一次性重置，问题消失。

**2. `localStorage` 为什么要包一层**

直接调 `localStorage.setItem` 在隐私模式或配额超限时会抛异常，导致整个对话流程中断。现在读写都收敛到 `loadMessages/saveMessages`，异常在边界处理，业务代码不用关心。

**3. 打字机效果的定时器清理**

逐字输出用 `setInterval`，必须保证在组件卸载、消息重置、数组越界时都能 `clearInterval`，否则会出现「两个定时器同时往一条消息里写」的错乱。代码里对 `last` 做了空值守卫。

**4. 类型守卫的实际价值**

`messages[messages.length - 1]` 的返回类型是 `Message | undefined`。开启严格模式后，这里必须显式处理越界，否则 `last.content +=` 会崩。这不是为了过编译，而是真的会在快速点击时触发。

## CI

`.github/workflows/ci.yml`：push 到 `main` 或提 PR 时自动执行

1. `npm ci`（严格按 lock 文件，比 `npm install` 更快更稳）
2. `npm run type-check`（vue-tsc 严格模式）
3. `npm run test`（Vitest）
4. `npm run build`

Node 版本锁 `22`，与 `package.json` 的 `engines` 保持一致——早期用 20 会因 `EBADENGINE` 直接失败。

## License

MIT
