<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  messages: { role: string; content: string }[]
  thinking: boolean
}>()

const msgContainer = ref<HTMLElement | null>(null)

watch(() => props.messages.length, async () => {
  await nextTick()
  if (msgContainer.value) {
    msgContainer.value.scrollTop = msgContainer.value.scrollHeight
  }
})
</script>

<template>
  <div class="messages" ref="msgContainer">
    <div
      v-for="(msg, index) in messages"
      :key="index"
      :class="['msg', msg.role]"
    >
      {{ msg.content }}
    </div>
    <div v-if="thinking" class="msg ai thinking">
      正在思考<span class="dots"></span>
    </div>
  </div>
</template>

<style scoped>
.messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  background: #FFF5EE;
}

.msg {
  max-width: 72%;
  margin-bottom: 14px;
  padding: 14px 20px;
  border-radius: 22px;
  line-height: 1.6;
  font-size: 15px;
  font-weight: 400;
  letter-spacing: 0.3px;
}

.msg.ai {
  background: #F5F0EB;
  color: #5D4037;
  align-self: flex-start;
  border-bottom-left-radius: 8px;
  box-shadow: 0 1px 3px rgba(180, 160, 140, 0.08);
}

.msg.user {
  background: #E8A0B4;
  color: white;
  align-self: flex-end;
  border-bottom-right-radius: 8px;
  box-shadow: 0 2px 6px rgba(232, 160, 180, 0.3);
}

/* 消息滑入动画 */
.msg {
  animation: slideUp 0.35s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* AI 思考中动画 */
.thinking {
  color: #A1887F;
  font-style: italic;
  font-size: 14px;
}

.dots::after {
  content: '';
  animation: dots 1.5s steps(4, end) infinite;
}

@keyframes dots {
  0%   { content: ''; }
  25%  { content: '.'; }
  50%  { content: '..'; }
  75%  { content: '...'; }
}

/* 手机端适配 */
@media (max-width: 600px) {
  .messages {
    padding: 12px;
  }
  .msg {
    max-width: 85%;
    font-size: 14px;
    padding: 12px 16px;
  }
}
</style>
