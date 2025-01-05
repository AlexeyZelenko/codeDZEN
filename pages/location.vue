<template>
  <div class="container py-4">
    <h2 class="mb-4">Location Picker</h2>
    <MapsSimpleLocationPicker />
  </div>
</template>

<script setup>
import { useIsLoadingStore } from '~/stores/inventory'

const isLoadingStore = useIsLoadingStore()

onMounted(() => {
  isLoadingStore.set(false)
})
</script>