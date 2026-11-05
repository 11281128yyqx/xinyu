import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useChatStore } from '../chat'

describe('chat store 会话状态', () => {
  beforeEach(() => {
    // 每个用例前清空 localStorage，保证测试之间互不影响
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('应该提供 4 个预设角色', () => {
    const store = useChatStore()

    expect(store.roles).toHaveLength(4)
    expect(store.roles.map((r) => r.name)).toEqual(['小暖', '阿哲', '乐乐', '小苏'])
  })

  it('每个角色都应该有头像、描述和 systemPrompt', () => {
    const store = useChatStore()

    store.roles.forEach((role) => {
      expect(role.avatar).toBeTruthy()
      expect(role.desc).toBeTruthy()
      expect(role.systemPrompt).toBeTruthy()
    })
  })

  it('没有历史消息时应该显示默认欢迎语', () => {
    const store = useChatStore()

    expect(store.messages).toHaveLength(1)
    expect(store.messages[0].role).toBe('ai')
    expect(store.messages[0].content).toContain('小暖')
  })

  it('初始状态不应该选中任何角色', () => {
    const store = useChatStore()

    expect(store.currentRole).toBeNull()
  })

  it('选择角色后应该按角色名生成欢迎语', () => {
    const store = useChatStore()

    store.selectRole(store.roles[1]) // 阿哲

    expect(store.currentRole?.name).toBe('阿哲')
    expect(store.messages).toHaveLength(1)
    expect(store.messages[0].content).toContain('阿哲')
  })

  it('切换角色应该重置会话，不保留上一个角色的消息', () => {
    const store = useChatStore()

    store.selectRole(store.roles[0]) // 小暖
    store.messages.push({ role: 'user', content: '和小暖说的话' })
    store.messages.push({ role: 'ai', content: '小暖的回复' })
    expect(store.messages).toHaveLength(3)

    store.selectRole(store.roles[2]) // 切到乐乐

    expect(store.messages).toHaveLength(1)
    expect(store.messages[0].content).toContain('乐乐')
  })

  it('选择角色后新会话应该写入 localStorage', () => {
    const store = useChatStore()

    store.selectRole(store.roles[0])

    const saved = JSON.parse(localStorage.getItem('xinyu-messages')!)
    expect(saved).toHaveLength(1)
    expect(saved[0].content).toContain('小暖')
  })

  it('应该从 localStorage 恢复历史消息', () => {
    // 先写入历史记录，再初始化 store
    localStorage.setItem(
      'xinyu-messages',
      JSON.stringify([
        { role: 'user', content: '历史提问' },
        { role: 'ai', content: '历史回复' },
      ]),
    )
    setActivePinia(createPinia())

    const store = useChatStore()

    expect(store.messages).toHaveLength(2)
    expect(store.messages[0].content).toBe('历史提问')
  })

  it('messageCount 应该跟随消息数量变化', () => {
    const store = useChatStore()
    const initial = store.messageCount

    store.messages.push({ role: 'user', content: '新消息' })

    expect(store.messageCount).toBe(initial + 1)
  })

  it('发送空消息或纯空格应该被忽略', async () => {
    const store = useChatStore()
    const before = store.messageCount

    await store.sendMessage('')
    await store.sendMessage('   ')

    expect(store.messageCount).toBe(before)
  })
})
