<template>
  <div class="datetime">
    <div class="datetime__date">
      <div class="datetime__label">Today</div>
      <div class="datetime__block">
        <div class="datetime__value">{{ formattedDate }}</div>
        <div class="datetime__time">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="green" class="bi bi-clock" viewBox="-1 -1 18 18">
            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" stroke="green" stroke-width="1"/>
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" stroke="green" stroke-width="1"/>
          </svg>
          {{ formattedTime }}
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { format } from 'date-fns'

const formattedDate = ref('')
const formattedTime = ref('')
let timer: NodeJS.Timer | null = null

const updateDateTime = () => {
  const now = new Date()
  formattedDate.value = format(now, 'dd MMM, yyyy').toUpperCase()
  formattedTime.value = format(now, 'HH:mm')
}

onMounted(() => {
  updateDateTime()
  timer = setInterval(updateDateTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped lang="scss">
.datetime {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.datetime__date {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.datetime__block {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

.datetime__label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6B7280;
}

.datetime__value {
  font-size: 0.75rem;
  font-weight: 500;
  color: #111827;
}

.datetime__time {
  font-size: 0.75rem;
  font-weight: 500;
  color: #111827;
  margin-left: 10px;
}
</style>