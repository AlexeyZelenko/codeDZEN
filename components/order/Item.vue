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
      <div class="order-item__details">
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
          <div v-if="order.description" class="d-flex flex-column my-1">
            <div class="text-muted small fw-bold">Description:</div>
            <div class="text-muted small">{{ order.description }}</div>
          </div>
          <div class="text-muted small">
            <div>
              <span class="fw-bold">Created:</span>
              {{ formatDate(order.date, 'dd MMM yyyy') }}
              /
              {{ formatDate(order.date, 'yyyy-MM-dd HH:mm') }}
            </div>
            <div>
              <span class="fw-bold">Products:</span> {{ order.products.length }}
            </div>
            <div v-if="!loading">
              <span class="fw-bold">Total:</span>
              ${{ total?.usd.toFixed(2) || '...' }} /
              ₴{{ total?.uah.toFixed(2) || '...' }}
            </div>
            <div v-else>
              <span>Loading total...</span>
            </div>
          </div>
        </div>
        <div v-if="isActive" class="order-item__active">
          <i class="order-item__arrow bi bi-caret-right-fill"></i>
        </div>
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

<script setup lang="ts">
import { format } from 'date-fns';
import { ref, watch, onMounted } from 'vue';
import { usePriceWorker } from '~/composables/usePriceWorker';

const emit = defineEmits(['view-order', 'close-details', 'confirm-delete']);

// Props
const props = defineProps({
  order: Object,
  isActive: Boolean,
});

// State
const isHovered = ref(false);
const isDeleting = ref(false);

// Utility Methods
const formatDate = (date: string, formatStr: string) => format(new Date(date), formatStr);

// Price Calculation
const { calculateTotal, loading } = usePriceWorker();
const total = ref<{ usd: number; uah: number } | null>(null);

// Watch for changes in the order and calculate the total
watch(
    () => props.order,
    async (newOrder) => {
      if (newOrder) {
        try {
          total.value = await calculateTotal(newOrder);
        } catch (error) {
          console.error('Error calculating total:', error);
        }
      }
    },
    { immediate: true }
);

// Delete Order
const deleteOrder = (order: any) => {
  isDeleting.value = true;
  setTimeout(() => {
    emit('confirm-delete', order);
    isDeleting.value = false;
  }, 500);
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

    &__details {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      width: 100%;

      @media (min-width: 768px) {
        flex-direction: row;
        width: 100%;
      }
    }

    &__data {
      width: 100%;
      cursor: pointer;

      @media (min-width: 768px) {
        width: 90%;
        height: 100%;
      }
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
        height: 100%;
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
