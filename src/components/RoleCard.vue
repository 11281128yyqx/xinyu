<script setup lang="ts">
defineProps<{
  name: string
  avatar: string
  desc: string
}>()

const emit = defineEmits<{
  enter: []
}>()

function handleClick() {
  emit('enter')
}
</script>

<template>
  <div class="card">
    <div class="card-inner">
      <span class="avatar">{{ avatar }}</span>
      <h3>{{ name }}</h3>
      <p>{{ desc }}</p>
      <button @click="handleClick">开始聊天</button>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 190px;
  border-radius: 28px;
  background: linear-gradient(160deg, #F0F7F4 0%, #FFFFFF 100%);
  box-shadow: 0 4px 24px rgba(180, 160, 140, 0.12);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: default;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(180, 160, 140, 0.2);
}

.card-inner {
  padding: 32px 20px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  font-size: 52px;
  margin-bottom: 16px;
  line-height: 1;
}

.card h3 {
  font-family: 'Noto Serif SC', serif;
  font-size: 20px;
  font-weight: 600;
  color: #5D4037;
  margin-bottom: 6px;
  letter-spacing: 1px;
}

.card p {
  font-size: 13px;
  color: #A1887F;
  font-weight: 300;
  margin-bottom: 20px;
  letter-spacing: 0.5px;
}

button {
  padding: 10px 28px;
  border: none;
  border-radius: 24px;
  background: #E8A0B4;
  color: white;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  font-family: 'Noto Sans SC', sans-serif;
}

button:hover {
  background: #D4859C;
  transform: scale(1.03);
}

button:active {
  transform: scale(0.97);
}

/* 手机端适配 */
@media (max-width: 600px) {
  .card {
    width: 100%;
    max-width: 320px;
  }
}
</style>
