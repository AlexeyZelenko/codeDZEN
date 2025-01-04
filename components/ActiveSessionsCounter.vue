<template>
  <div class="active-sessions">
    <span class="active-sessions__label">Active Sessions:</span>
    <span class="active-sessions__count">{{ activeSessions }}</span>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useWebSocket } from '@/services/websocket'

const { activeSessions, connect, disconnect } = useWebSocket()

onMounted(() => {
  connect()
})

onUnmounted(() => {
  disconnect()
})
</script>

<style scoped>
.active-sessions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  background-color: #e9ecef;
  border-radius: 0.25rem;
}

.active-sessions__count {
  font-weight: bold;
  color: #0d6efd;
}
</style>