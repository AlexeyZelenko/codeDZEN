<template>
  <div>
    <h2 class="d-flex align-items-center">
      Orders
      <button
          class="btn btn-success btn-sm ms-3 rounded-circle"
          @click="$emit('open-create-modal')"
      >
        <i class="bi bi-plus-lg"></i>
      </button>
    </h2>
    <div class="order-list">
      <OrderItem
          v-for="order in orders"
          :key="order.id"
          :order="order"
          :isActive="selectedOrder?.id === order.id"
          @view-order="$emit('view-order', order)"
          @close-details="$emit('close-details')"
          @confirm-delete="$emit('confirm-delete', order)"
      />
    </div>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  orders: Array,
  selectedOrder: Object,
});

</script>

<style scoped>
.order-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
