<script setup lang="ts">
defineProps<{
  roleName: string
}>()

const emit = defineEmits<{
  back: []
}>()
</script>

<template>
  <div class="header">
    <button class="back" @click="emit('back')">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M12 4L6 10L12 16" stroke="#5D4037" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    <h2>{{ roleName }}</h2>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(180, 160, 140, 0.12);
  position: sticky;
  top: 0;
  z-index: 10;
}

.back {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  background: rgba(232, 160, 180, 0.1);
  margin-right: 14px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.back:hover {
  background: rgba(232, 160, 180, 0.2);
}

h2 {
  font-family: 'Noto Serif SC', serif;
  font-size: 20px;
  font-weight: 600;
  color: #5D4037;
  letter-spacing: 1px;
}
</style>
