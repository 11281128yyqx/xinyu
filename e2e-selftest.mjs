/**
 * E2E 断言自检脚本（临时验证用，可删除）
 *
 * 用途：在不启动 Playwright 测试运行器的前提下，逐条验证 e2e/chat-flow.spec.ts
 * 里用到的选择器和断言是否真的成立。这样可以在受限环境里确认测试本身是对的。
 *
 * 运行：
 *   1. 先启动被测服务：npx vite preview --port 4173 --strictPort
 *   2. node e2e-selftest.mjs
 */
import { chromium } from '@playwright/test'

const BASE = 'http://localhost:4173'
let pass = 0
let fail = 0
const failures = []

async function check(name, fn) {
  try {
    await fn()
    pass++
    console.log('  PASS  ' + name)
  } catch (e) {
    fail++
    const msg = String(e.message || e).split('\n')[0]
    failures.push(name + '  ->  ' + msg)
    console.log('  FAIL  ' + name + '  ->  ' + msg)
  }
}

const browser = await chromium.launch({ channel: 'msedge' })
const page = await browser.newPage()

// ==================== 首页渲染 ====================
console.log('\n【首页渲染】')
await page.goto(BASE + '/', { waitUntil: 'networkidle' })

await check('品牌名是「心语」', async () => {
  const t = await page.locator('.brand').textContent()
  if (t && t.trim() !== '心语') throw new Error('实际: ' + t)
})

await check('标题是「今天想和谁聊天？」', async () => {
  const t = await page.locator('.title').textContent()
  if (t && t.trim() !== '今天想和谁聊天？') throw new Error('实际: ' + t)
})

await check('副标题文案正确', async () => {
  const t = await page.locator('.subtitle').textContent()
  if (t && t.trim() !== '选一个角色，开始一段温柔的对话') throw new Error('实际: ' + t)
})

await check('渲染出 4 个角色卡片', async () => {
  const n = await page.locator('.cards .card').count()
  if (n !== 4) throw new Error('实际数量: ' + n)
})

await check('角色名称依次是 小暖/阿哲/乐乐/小苏', async () => {
  const names = (await page.locator('.cards .card h3').allTextContents()).map((s) => s.trim())
  const want = ['小暖', '阿哲', '乐乐', '小苏']
  if (JSON.stringify(names) !== JSON.stringify(want)) throw new Error('实际: ' + names.join(' / '))
})

await check('首张卡片有头像、描述和「开始聊天」按钮', async () => {
  const card = page.locator('.cards .card').first()
  if (!(await card.locator('.avatar').isVisible())) throw new Error('头像不可见')
  const desc = await card.locator('p').textContent()
  if (desc && desc.trim() !== '温暖治愈的倾听者') throw new Error('描述实际: ' + desc)
  const btn = await card.getByRole('button').textContent()
  if (btn && btn.trim() !== '开始聊天') throw new Error('按钮实际: ' + btn)
})

await check('渲染出 4 个快捷场景入口', async () => {
  const n = await page.locator('.scenario-tags .scenario-tag').count()
  if (n !== 4) throw new Error('入口数量: ' + n)
  const txt = (await page.locator('.scenario-tags').textContent()) || ''
  for (const w of ['心情不好', '需要建议', '想学东西', '随便聊聊']) {
    if (!txt.includes(w)) throw new Error('缺少场景: ' + w)
  }
})

// ==================== 页面跳转链路 ====================
console.log('\n【页面跳转链路】')

await check('点第二张卡片进入聊天页，标题为「阿哲」', async () => {
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.locator('.cards .card').nth(1).getByRole('button').click()
  await page.waitForURL(/\/chat$/, { timeout: 5000 })
  const h = await page.locator('.header h2').textContent()
  if (h && h.trim() !== '阿哲') throw new Error('标题实际: ' + h)
})

await check('进入聊天页显示小暖的专属欢迎语', async () => {
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.locator('.cards .card').first().getByRole('button').click()
  await page.waitForURL(/\/chat$/, { timeout: 5000 })
  const ok = await page.getByText('你好呀，我是小暖，有什么想聊的吗？').isVisible()
  if (!ok) throw new Error('欢迎语不可见')
})

await check('点快捷场景「心情不好」跳到小暖', async () => {
  await page.goto(BASE + '/', { waitUntil: 'networkidle' })
  await page.locator('.scenario-tag').first().click()
  await page.waitForURL(/\/chat$/, { timeout: 5000 })
  const h = await page.locator('.header h2').textContent()
  if (h && h.trim() !== '小暖') throw new Error('标题实际: ' + h)
})

await check('点返回按钮回到首页', async () => {
  await page.goto(BASE + '/chat', { waitUntil: 'networkidle' })
  await page.locator('.back').click()
  await page.waitForURL(/\/$/, { timeout: 5000 })
  const t = await page.locator('.title').textContent()
  if (t && t.trim() !== '今天想和谁聊天？') throw new Error('实际: ' + t)
})

await check('聊天页有输入框且占位符正确', async () => {
  await page.goto(BASE + '/chat', { waitUntil: 'networkidle' })
  const input = page.locator('.input-area input')
  if (!(await input.isVisible())) throw new Error('输入框不可见')
  const ph = await input.getAttribute('placeholder')
  if (ph !== '想说点什么...') throw new Error('占位符实际: ' + ph)
})

// ==================== 输入校验 ====================
console.log('\n【输入校验】')

await check('空消息点发送提示「不能发送空消息哦~」', async () => {
  await page.goto(BASE + '/chat', { waitUntil: 'networkidle' })
  await page.locator('.input-area button').click()
  const err = page.locator('.error-msg')
  await err.waitFor({ state: 'visible', timeout: 3000 })
  const t = await err.textContent()
  if (t && t.trim() !== '不能发送空消息哦~') throw new Error('实际: ' + t)
})

await check('纯空格也判为空消息', async () => {
  await page.goto(BASE + '/chat', { waitUntil: 'networkidle' })
  await page.locator('.input-area input').fill('     ')
  await page.locator('.input-area button').click()
  await page.locator('.error-msg').waitFor({ state: 'visible', timeout: 3000 })
})

await check('错误提示约 2 秒后自动消失', async () => {
  await page.goto(BASE + '/chat', { waitUntil: 'networkidle' })
  await page.locator('.input-area button').click()
  const err = page.locator('.error-msg')
  await err.waitFor({ state: 'visible', timeout: 3000 })
  await err.waitFor({ state: 'hidden', timeout: 6000 })
})

await browser.close()

console.log('\n' + '='.repeat(52))
console.log('E2E 断言自检结果:  ' + pass + ' 通过 / ' + fail + ' 失败')
if (failures.length) {
  console.log('\n失败明细:')
  failures.forEach((f) => console.log('  - ' + f))
}
console.log('='.repeat(52))
process.exit(fail ? 1 : 0)
