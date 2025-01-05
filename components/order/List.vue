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
    <div class="order-list" ref="orderListRef">
      <div
          v-for="(order, index) in orders"
          :key="order.id"
          :ref="el => (orderRefs[index] = el)"
          class="order-lazy-item"
      >
        <transition name="fade">
          <OrderItem
              v-if="visibleOrders.has(order.id)"
              :order="order"
              :isActive="selectedOrder?.id === order.id"
              @view-order="$emit('view-order', order)"
              @close-details="$emit('close-details')"
              @confirm-delete="$emit('confirm-delete', order)"
          />
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUpdated, onUnmounted, nextTick } from 'vue';

// Props
const props = defineProps({
  orders: {
    type: Array,
    required: true,
  },
  selectedOrder: Object,
});

// Refs
const orderListRef = ref(null); // Ref для списка заказов
const orderRefs = ref([]); // Массив рефов для каждого элемента заказа
const visibleOrders = reactive(new Set()); // Множество ID видимых заказов

let observer = null;

// Функция обработки пересечений
const handleIntersect = (entries) => {
  entries.forEach((entry) => {
    const orderId = entry.target.dataset.id; // ID заказа
    if (entry.isIntersecting) {
      visibleOrders.add(orderId); // Добавляем в видимые заказы
    } else {
      visibleOrders.delete(orderId); // Удаляем из видимых заказов
    }
  });
};

const initObserver = () => {
  if ('IntersectionObserver' in window && orderListRef.value) {
    observer = new IntersectionObserver(handleIntersect, { threshold: 0.3 });
    orderRefs.value.forEach((el, index) => {
      if (el) {
        el.dataset.id = props.orders[index]?.id; // Устанавливаем ID заказа
        observer.observe(el); // Наблюдаем за элементом
      }
    });
  } else {
    console.warn('IntersectionObserver not supported, falling back.');
    props.orders.forEach((order) => visibleOrders.add(order.id));
  }
};

// Сбрасываем и реинициализируем наблюдатель
const resetObserver = async () => {
  if (observer) {
    observer.disconnect();
  }
  await nextTick(); // Ждём, пока DOM обновится
  initObserver();
};

// Lifecycle hooks
onMounted(async () => {
  await resetObserver();
});

onUpdated(async () => {
  await resetObserver();
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>

<style scoped>
.order-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-lazy-item {
  min-height: 50px;
}

/* Fade-in анимация */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
