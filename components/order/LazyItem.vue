<template>
  <div ref="itemRef" class="lazy-order-item">
    <transition name="fade" @after-enter="logVisible">
      <OrderItem
          v-if="isVisible"
          :order="order"
          :isActive="isActive"
          @view-order="$emit('view-order', $event)"
          @close-details="$emit('close-details')"
          @confirm-delete="$emit('confirm-delete', $event)"
      />
    </transition>
  </div>
</template>

<script setup>
import {ref, onMounted, onUnmounted} from 'vue';

// Props
const props = defineProps({
  order: Object,
  isActive: Boolean,
});

// Emits
const emit = defineEmits(['view-order', 'close-details', 'confirm-delete']);

// State
const isVisible = ref(false);
const itemRef = ref(null);

let observer = null;

// Handle Intersection Observer
const handleIntersect = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      isVisible.value = true;
      console.log(`Order ${props.order.id} is now visible.`);
      if (observer) observer.unobserve(entry.target); // Stop observing this element
    }
  });
};

// Log appearance in the console
const logVisible = () => {
  console.log(`Order ${props.order.id} appeared on screen.`);
};

onMounted(() => {
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(handleIntersect, {threshold: 0.5});
    if (itemRef.value) {
      observer.observe(itemRef.value);
    }
  } else {
    // Fallback for older browsers
    isVisible.value = true;
    console.log(`Order ${props.order.id} is visible (fallback).`);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
.lazy-order-item {
  min-height: 50px; /* Ensure smooth loading */
}

/* Fade-in animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
