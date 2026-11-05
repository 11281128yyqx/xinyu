<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  send: [content: string]
}>()

const input = ref('')
const showError = ref(false)

function handleSend() {
  if (input.value.trim() === '') {
    showError.value = true
    setTimeout(() => {
      showError.value = false
    }, 2000)
    return
  }
  emit('send', input.value)
  input.value = ''
}
</script>

<template>
  <div class="input-area">
    <div class="input-row">
      <input
        v-model="input"
        type="text"
        placeholder="想说点什么..."
        @keyup.enter="handleSend"
      />
      <button @click="handleSend">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2 9L16 2L9 16L7 10L2 9Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <p v-if="showError" class="error-msg">不能发送空消息哦~</p>
  </div>
</template>

<style scoped>
.input-area {
  padding: 14px 20px 18px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  border-top: 1px solid rgba(180, 160, 140, 0.12);
}

.input-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

input {
  flex: 1;
  padding: 12px 20px;
  border: 1.5px solid #E8D5C4;
  border-radius: 24px;
  font-size: 14px;
  font-family: 'Noto Sans SC', sans-serif;
  color: #5D4037;
  background: #FFF8F2;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

input:focus {
  border-color: #E8A0B4;
  box-shadow: 0 0 0 3px rgba(232, 160, 180, 0.15);
}

input::placeholder {
  color: #C4B5A6;
  font-weight: 300;
}

button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border: none;
  border-radius: 50%;
  background: #E8A0B4;
  color: white;
  cursor: pointer;
  flex-shrink: 0;
  transition: background 0.2s ease, transform 0.2s ease;
}

button:hover {
  background: #D4859C;
  transform: scale(1.05);
}

button:active {
  transform: scale(0.95);
}

.error-msg {
  color: #E8A0B4;
  font-size: 12px;
  margin-top: 8px;
  margin-left: 20px;
  font-weight: 400;
}

/* 手机端适配 */
@media (max-width: 600px) {
  .input-area {
    padding: 10px 12px 14px;
  }
  input {
    padding: 10px 16px;
    font-size: 15px;
  }
  button {
    width: 38px;
    height: 38px;
  }
}
</style>
