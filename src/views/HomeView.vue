<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useChatStore } from '../stores/chat'
import RoleCard from '../components/RoleCard.vue'

const router = useRouter()
const chatStore = useChatStore()

let title = ref('心语')
let desc = ref('选一个角色，开始对话吧')

function enterChat(role: any) {
  chatStore.selectRole(role)
  router.push('/chat')
}

// 快捷场景：点一下直接跳到对应角色聊天
const scenarios = [
  { label: '心情不好', emoji: '😔', roleName: '小暖' },
  { label: '需要建议', emoji: '🤔', roleName: '阿哲' },
  { label: '想学东西', emoji: '📚', roleName: '小苏' },
  { label: '随便聊聊', emoji: '💬', roleName: '乐乐' },
]

function quickStart(roleName: string) {
  const role = chatStore.roles.find(r => r.name === roleName)
  if (role) enterChat(role)
}
</script>

<template>
  <div class="home">
    <!-- 装饰圆 -->
    <div class="deco-circle deco-1"></div>
    <div class="deco-circle deco-2"></div>
    <div class="deco-circle deco-3"></div>

    <div class="hero">
      <p class="brand">心语</p>
      <h1 class="title">今天想和谁聊天？</h1>
      <p class="subtitle">选一个角色，开始一段温柔的对话</p>
    </div>

    <div class="cards">
      <RoleCard
        v-for="role in chatStore.roles"
        :key="role.name"
        :name="role.name"
        :avatar="role.avatar"
        :desc="role.desc"
        @enter="enterChat(role)"
      />
    </div>

    <!-- 快捷场景入口 -->
    <div class="scenarios">
      <p class="scenario-hint">或者，告诉我你现在的心情</p>
      <div class="scenario-tags">
        <button
          v-for="s in scenarios"
          :key="s.label"
          class="scenario-tag"
          @click="quickStart(s.roleName)"
        >
          <span class="tag-emoji">{{ s.emoji }}</span>
          <span class="tag-label">{{ s.label }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  position: relative;
  overflow: hidden;
}

/* 装饰圆 */
.deco-circle {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}
.deco-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #FADADD 0%, transparent 70%);
  top: -80px;
  right: -60px;
}
.deco-2 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #E8F5E9 0%, transparent 70%);
  bottom: 10%;
  left: -40px;
}
.deco-3 {
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, #FADADD 0%, transparent 70%);
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0.5;
}

.hero {
  text-align: center;
  margin-bottom: 56px;
  position: relative;
  z-index: 1;
}

.brand {
  font-family: 'Noto Serif SC', serif;
  font-size: 16px;
  color: #E8A0B4;
  letter-spacing: 8px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.title {
  font-family: 'Noto Serif SC', serif;
  font-size: 36px;
  font-weight: 400;
  color: #5D4037;
  margin-bottom: 12px;
  letter-spacing: 2px;
}

.subtitle {
  font-size: 15px;
  color: #A1887F;
  font-weight: 300;
  letter-spacing: 1px;
}

.cards {
  display: flex;
  gap: 24px;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 900px;
  position: relative;
  z-index: 1;
}

/* 快捷场景入口 */
.scenarios {
  margin-top: 48px;
  text-align: center;
  position: relative;
  z-index: 1;
}

.scenario-hint {
  font-size: 13px;
  color: #A1887F;
  font-weight: 300;
  letter-spacing: 1px;
  margin-bottom: 16px;
}

.scenario-tags {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.scenario-tag {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 22px;
  border: 1.5px solid #E8D5C4;
  border-radius: 24px;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: 'Noto Sans SC', sans-serif;
}

.scenario-tag:hover {
  border-color: #E8A0B4;
  background: rgba(232, 160, 180, 0.08);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(232, 160, 180, 0.15);
}

.tag-emoji {
  font-size: 18px;
}

.tag-label {
  font-size: 14px;
  color: #5D4037;
  font-weight: 400;
}

/* 手机端适配 */
@media (max-width: 600px) {
  .home {
    padding: 24px 16px;
    justify-content: flex-start;
    padding-top: 80px;
  }
  .title {
    font-size: 28px;
  }
  .cards {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  .scenarios {
    margin-top: 32px;
  }
  .scenario-tag {
    padding: 8px 18px;
  }
  .deco-1 { width: 200px; height: 200px; top: -40px; right: -40px; }
  .deco-2 { width: 140px; height: 140px; bottom: 5%; }
  .deco-3 { display: none; }
}
</style>
