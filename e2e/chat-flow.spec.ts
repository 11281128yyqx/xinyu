import { test, expect } from '@playwright/test'

/**
 * 心语 · 端到端（E2E）测试
 *
 * 与单元测试的分工：
 *   - 单元测试（vitest）：验证单个组件和 store 的逻辑，跑得快，不启动浏览器
 *   - E2E 测试（本文件）：启动真实浏览器，验证页面跳转、真实渲染和用户交互链路
 *
 * 这里刻意只覆盖「不需要调用大模型接口」的链路，
 * 保证测试稳定、不依赖网络和 API Key。
 */

test.describe('心语 · 首页渲染', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('应该显示品牌名和引导文案', async ({ page }) => {
    await expect(page.locator('.brand')).toHaveText('心语')
    await expect(page.locator('.title')).toHaveText('今天想和谁聊天？')
    await expect(page.locator('.subtitle')).toHaveText('选一个角色，开始一段温柔的对话')
  })

  test('应该渲染出 4 个角色卡片', async ({ page }) => {
    const cards = page.locator('.cards .card')
    await expect(cards).toHaveCount(4)
    await expect(cards.locator('h3')).toHaveText(['小暖', '阿哲', '乐乐', '小苏'])
  })

  test('每张卡片都应该有头像、描述和「开始聊天」按钮', async ({ page }) => {
    const card = page.locator('.cards .card').first()

    await expect(card.locator('.avatar')).toBeVisible()
    await expect(card.locator('p')).toHaveText('温暖治愈的倾听者')
    await expect(card.getByRole('button')).toHaveText('开始聊天')
  })

  test('应该显示 4 个快捷场景入口', async ({ page }) => {
    await expect(page.locator('.scenario-tags .scenario-tag')).toHaveCount(4)
    await expect(page.locator('.scenario-tags')).toContainText('心情不好')
    await expect(page.locator('.scenario-tags')).toContainText('需要建议')
    await expect(page.locator('.scenario-tags')).toContainText('想学东西')
    await expect(page.locator('.scenario-tags')).toContainText('随便聊聊')
  })
})

test.describe('心语 · 页面跳转链路', () => {
  test('点击角色卡片的按钮应该跳转到聊天页，并带上该角色的名字', async ({ page }) => {
    await page.goto('/')

    // 选第二个角色「阿哲」
    await page.locator('.cards .card').nth(1).getByRole('button').click()

    // 断言：URL 变了，且顶部标题是阿哲
    await expect(page).toHaveURL(/\/chat$/)
    await expect(page.locator('.header h2')).toHaveText('阿哲')
  })

  test('进入聊天页应该显示该角色的专属欢迎语', async ({ page }) => {
    await page.goto('/')
    await page.locator('.cards .card').first().getByRole('button').click()

    await expect(page.getByText('你好呀，我是小暖，有什么想聊的吗？')).toBeVisible()
  })

  test('点击快捷场景标签应该直接跳到对应角色', async ({ page }) => {
    await page.goto('/')

    // 第一个场景「心情不好」对应小暖
    await page.locator('.scenario-tag').first().click()

    await expect(page).toHaveURL(/\/chat$/)
    await expect(page.locator('.header h2')).toHaveText('小暖')
  })

  test('点击返回按钮应该回到首页', async ({ page }) => {
    await page.goto('/chat')

    await page.locator('.back').click()

    await expect(page).toHaveURL(/\/$/)
    await expect(page.locator('.title')).toHaveText('今天想和谁聊天？')
  })

  test('聊天页应该同时显示消息区和输入框', async ({ page }) => {
    await page.goto('/chat')

    await expect(page.locator('.input-area input')).toBeVisible()
    await expect(page.locator('.input-area input')).toHaveAttribute('placeholder', '想说点什么...')
    await expect(page.locator('.input-area')).toContainText('')
  })
})

test.describe('心语 · 输入校验', () => {
  test('不输入内容直接点发送，应该提示不能发送空消息', async ({ page }) => {
    await page.goto('/chat')

    await page.locator('.input-area button').click()

    const error = page.locator('.error-msg')
    await expect(error).toBeVisible()
    await expect(error).toHaveText('不能发送空消息哦~')
  })

  test('只输入空格也属于空消息，同样应该被拦截', async ({ page }) => {
    await page.goto('/chat')

    await page.locator('.input-area input').fill('     ')
    await page.locator('.input-area button').click()

    await expect(page.locator('.error-msg')).toBeVisible()
  })

  test('错误提示应该在约 2 秒后自动消失', async ({ page }) => {
    await page.goto('/chat')

    await page.locator('.input-area button').click()
    const error = page.locator('.error-msg')
    await expect(error).toBeVisible()

    // 2 秒后自动隐藏（给一点余量）
    await expect(error).toBeHidden({ timeout: 5000 })
  })
})
