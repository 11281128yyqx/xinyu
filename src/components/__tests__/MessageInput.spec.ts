import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MessageInput from '../MessageInput.vue'

describe('MessageInput 消息输入组件', () => {
  it('输入内容后点击按钮，应该抛出 send 事件并带上内容', async () => {
    const wrapper = mount(MessageInput)

    await wrapper.find('input').setValue('今天有点累')
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('send')).toHaveLength(1)
    expect(wrapper.emitted('send')![0]).toEqual(['今天有点累'])
  })

  it('按回车键也应该发送消息', async () => {
    const wrapper = mount(MessageInput)

    await wrapper.find('input').setValue('你好呀')
    await wrapper.find('input').trigger('keyup.enter')

    expect(wrapper.emitted('send')).toHaveLength(1)
    expect(wrapper.emitted('send')![0]).toEqual(['你好呀'])
  })

  it('发送成功后输入框应该被清空', async () => {
    const wrapper = mount(MessageInput)
    const input = wrapper.find('input')

    await input.setValue('测试消息')
    await wrapper.find('button').trigger('click')

    expect((input.element as HTMLInputElement).value).toBe('')
  })

  it('空消息不应该发送，并且要提示错误', async () => {
    const wrapper = mount(MessageInput)

    // 先输入再清空，触发空值分支
    await wrapper.find('button').trigger('click')

    // 没有抛 send 事件
    expect(wrapper.emitted('send')).toBeUndefined()
    // 显示了错误提示
    expect(wrapper.find('.error-msg').text()).toBe('不能发送空消息哦~')
  })

  it('只输入空格也视为空消息，不应发送', async () => {
    const wrapper = mount(MessageInput)

    await wrapper.find('input').setValue('    ')
    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('send')).toBeUndefined()
    expect(wrapper.find('.error-msg').exists()).toBe(true)
  })

  it('错误提示应该在 2 秒后自动消失', async () => {
    vi.useFakeTimers()
    const wrapper = mount(MessageInput)

    await wrapper.find('button').trigger('click')
    expect(wrapper.find('.error-msg').exists()).toBe(true)

    // 快进 2 秒
    vi.advanceTimersByTime(2000)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.error-msg').exists()).toBe(false)
    vi.useRealTimers()
  })
})
