import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface Role {
  name: string
  avatar: string
  desc: string
  systemPrompt: string
}

interface Message {
  role: 'user' | 'ai'
  content: string
}

// localStorage 工具函数
function loadMessages(): Message[] {
  const saved = localStorage.getItem('xinyu-messages')
  return saved ? JSON.parse(saved) : []
}

function saveMessages(messages: Message[]) {
  localStorage.setItem('xinyu-messages', JSON.stringify(messages))
}

// 调用 DeepSeek API
async function callDeepSeek(messages: Message[], systemPrompt: string): Promise<string> {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY

  // 把消息格式转换成 API 需要的格式（ai → assistant）
  const apiMessages = [
    { role: 'system', content: systemPrompt },
    ...messages.map(m => ({
      role: m.role === 'ai' ? 'assistant' : 'user',
      content: m.content
    }))
  ]

  const response = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: apiMessages,
      stream: false
    })
  })

  if (!response.ok) {
    throw new Error(`API 错误: ${response.status}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}

export const useChatStore = defineStore('chat', () => {
  // state（数据）
  const roles = ref<Role[]>([
    { name: '小暖', avatar: '🧡', desc: '温暖治愈的倾听者', systemPrompt: '你是"小暖"，一个温暖治愈的倾听者。回复风格温柔、关心对方，用温暖的语气安慰和鼓励对方。回复简洁，不超过80字。' },
    { name: '阿哲', avatar: '🧠', desc: '理性冷静的分析师', systemPrompt: '你是"阿哲"，一个理性冷静的分析师。回复风格逻辑清晰、善于分析问题，喜欢给出有条理的建议。回复简洁，不超过80字。' },
    { name: '乐乐', avatar: '🎉', desc: '活泼有趣的好朋友', systemPrompt: '你是"乐乐"，一个活泼有趣的好朋友。回复风格幽默、充满活力，偶尔用 emoji。回复简洁，不超过80字。' },
    { name: '小苏', avatar: '🚦', desc: '认真努力的鼓励者', systemPrompt: '你是"小苏"，一个认真努力的鼓励者。回复风格积极向上、充满正能量，喜欢鼓励对方坚持。回复简洁，不超过80字。' }
  ])

  // 从 localStorage 恢复消息，如果为空则用默认欢迎语
  const saved = loadMessages()
  const messages = ref<Message[]>(
    saved.length > 0 ? saved : [{ role: 'ai', content: '你好呀，我是小暖，有什么想聊的吗？' }]
  )

  const currentRole = ref<Role | null>(null)
  const isThinking = ref(false)

  // getters（计算属性）
  const messageCount = computed(() => messages.value.length)

  // actions（方法）
  function selectRole(role: Role) {
    currentRole.value = role
    messages.value = [{ role: 'ai', content: `你好呀，我是${role.name}，有什么想聊的吗？` }]
    saveMessages(messages.value)
  }

  // ========== sendMessage（接入 DeepSeek API） ==========
  async function sendMessage(content: string) {
    if (content.trim() === '') return
    messages.value.push({ role: 'user', content: content })
    saveMessages(messages.value)

    isThinking.value = true   // 显示"正在思考..."

    try {
      const systemPrompt = currentRole.value?.systemPrompt || '你是一个友好的聊天助手。'
      const reply = await callDeepSeek(messages.value, systemPrompt)

      isThinking.value = false

      // 打字机效果
      messages.value.push({ role: 'ai', content: '' })
      let i = 0
      const timer = setInterval(() => {
        if (i >= reply.length) {
          clearInterval(timer)
          saveMessages(messages.value)
          return
        }
        const last = messages.value[messages.value.length - 1]
        // 类型守卫：数组为空时越界访问会得到 undefined，直接结束打字机
        if (!last) {
          clearInterval(timer)
          return
        }
        last.content += reply[i] ?? ''
        i++
      }, 50)
    } catch (error) {
      isThinking.value = false
      messages.value.push({
        role: 'ai',
        content: '抱歉，连接出问题了，请稍后再试~'
      })
      saveMessages(messages.value)
    }
  }

  return { roles, messages, currentRole, isThinking, messageCount, selectRole, sendMessage }
})
