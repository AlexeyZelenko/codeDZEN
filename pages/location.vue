<template>
  <div class="container py-4">
    <h2 class="mb-4">Location</h2>
    <div class="d-flex flex-column">
      <MapsSimpleLocationPicker />
    </div>
  </div>
</template>

<script setup>
import { useIsLoadingStore } from '~/stores/inventory'

const isLoadingStore = useIsLoadingStore()

onMounted(() => {
  isLoadingStore.set(false)
})
</script>