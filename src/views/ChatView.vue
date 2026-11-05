<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useChatStore } from '../stores/chat'
import ChatHeader from '../components/ChatHeader.vue'
import MessageList from '../components/MessageList.vue'
import MessageInput from '../components/MessageInput.vue'

const router = useRouter()
const chatStore = useChatStore()

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="chat">
   <ChatHeader :role-name="chatStore.currentRole?.name || '聊天'" @back="goBack" />
   <MessageList :messages="chatStore.messages" :thinking="chatStore.isThinking" />
   <MessageInput @send="chatStore.sendMessage" />
  </div>
</template>

<style scoped>
.chat {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #FFF5EE;
}
</style>
