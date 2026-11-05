import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RoleCard from '../RoleCard.vue'

describe('RoleCard 角色卡片组件', () => {
  // 卡片要显示的内容
  const props = {
    name: '小暖',
    avatar: '🧡',
    desc: '温暖治愈的倾听者',
  }

  it('应该正确渲染角色名称、头像和描述', () => {
    const wrapper = mount(RoleCard, { props })

    expect(wrapper.find('h3').text()).toBe('小暖')
    expect(wrapper.find('.avatar').text()).toBe('🧡')
    expect(wrapper.find('p').text()).toBe('温暖治愈的倾听者')
  })

  it('按钮文案应该是「开始聊天」', () => {
    const wrapper = mount(RoleCard, { props })

    expect(wrapper.find('button').text()).toBe('开始聊天')
  })

  it('点击按钮时应该向父组件抛出 enter 事件', async () => {
    const wrapper = mount(RoleCard, { props })

    // 初始状态不应该有 emit
    expect(wrapper.emitted('enter')).toBeUndefined()

    await wrapper.find('button').trigger('click')

    // 点击后应该有且只有一次 enter 事件
    expect(wrapper.emitted('enter')).toHaveLength(1)
  })

  it('props 变化时显示内容应该跟着更新', async () => {
    const wrapper = mount(RoleCard, { props })

    // 模拟切换到另一个角色
    await wrapper.setProps({ name: '阿哲', avatar: '🧠', desc: '理性冷静的分析师' })

    expect(wrapper.find('h3').text()).toBe('阿哲')
    expect(wrapper.find('.avatar').text()).toBe('🧠')
    expect(wrapper.find('p').text()).toBe('理性冷静的分析师')
  })
})
