<template>
  <section class="order">
    <!-- Order Item -->
    <div
        class="order-item mb-3 border rounded animate__animated"
        :class="{
        'animate__pulse': isHovered,
        'animate__fadeOutLeft': isDeleting
      }"
        @click="$emit('view-order', order)"
        @mouseover="isHovered = true"
        @mouseleave="isHovered = false"
    >
      <div class="order-item__data d-flex flex-column p-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h3 class="h5 mb-0">{{ order.name }}</h3>
          <button
              class="btn btn-danger btn-sm"
              @click.stop="deleteOrder(order)"
          >
            Delete
          </button>
        </div>
        <div v-if="order.description" class="d-flex flex-column justify-content-lg-start my-1" aria-label="description">
          <div class="text-muted small fw-bold">Description:</div>
          <div class="text-muted small">{{ order.description }}</div>
        </div>
        <div class="text-muted small">
          <div><span class="fw-bold">Created:</span> {{ formatDate(order.date, 'dd MMM yyyy') }} / {{ formatDate(order.date, 'yyyy-MM-dd HH:mm') }}</div>
          <div><span class="fw-bold">Products:</span> {{ order.products.length }}</div>
          <div>
            <span class="fw-bold">Total:</span> ${{ calculateTotal(order).usd.toFixed(2) }} /
            ₴{{ calculateTotal(order).uah.toFixed(2) }}
          </div>
        </div>
      </div>
      <div v-if="isActive" class="order-item__active">
        <i class="order-item__arrow bi bi-caret-right-fill"></i>
      </div>
    </div>

    <!-- Order Details -->
    <OrderDetails
        v-if="isActive"
        class="order-details border rounded p-3 mx-2 d-flex flex-column animate__animated animate__fadeInLeft"
        :order="order"
        @close="$emit('close-details')"
    />
  </section>
</template>

<script setup>
import { format } from 'date-fns';
import { ref } from 'vue';

const emit = defineEmits(['view-order', 'close-details', 'confirm-delete']);

// Props
const props = defineProps({
  order: Object,
  isActive: Boolean,
});

// State
const isHovered = ref(false);
const isDeleting = ref(false);

// Methods
const formatDate = (date, formatStr) => format(new Date(date), formatStr);

const calculateTotal = (order) =>
    order.products.reduce(
        (acc, product) => {
          const priceUSD = product.price.find((p) => p.symbol === 'USD')?.value || 0;
          const priceUAH = product.price.find((p) => p.symbol === 'UAH')?.value || 0;

          return {
            usd: acc.usd + priceUSD,
            uah: acc.uah + priceUAH,
          };
        },
        { usd: 0, uah: 0 }
    );

const deleteOrder = (order) => {
  emit('confirm-delete', order);
};
</script>

<style scoped lang="scss">
.order {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
  }

  &-item {
    display: flex;
    flex-direction: column;
    width: 100%;
    transition: all 0.3s ease;

    &:hover {
      background-color: #f8f9fa;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    }

    @media (min-width: 768px) {
      flex-direction: row;
      width: 50%;
    }

    &__data {
      width: 90%;
      cursor: pointer;
    }

    &__active {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #c1c3c7;
      width: 100%;
      color: #fff;

      @media (min-width: 768px) {
        width: 10%;
      }
    }

    &__arrow {
      transform: rotate(90deg);

      @media (min-width: 768px) {
        transform: rotate(0);
      }
    }
  }

  &-details {
    width: 100%;

    @media (min-width: 768px) {
      width: 50%;
    }
  }
}

.active-order {
  border: 2px solid #4caf50;
  background-color: #e8f5e9;
}

.animate__animated {
  animation-duration: 0.5s;
  animation-fill-mode: both;
}
</style>
