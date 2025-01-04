<template>
  <div
      class="order-details p-4 border rounded animate__animated"
      v-if="order"
      :class="{'animate__fadeIn': order, 'animate__fadeOut': !order}"
  >
    <div class="d-flex justify-content-between align-items-center">
      <h4>{{ order.name }}</h4>
      <button class="btn btn-close" @click="$emit('close')"></button>
    </div>
    <div class="mb-3">
      <h5 class="h6">Products:</h5>
      <ul class="list-unstyled product-list">
        <li
            v-for="product in order.products"
            :key="product.id"
            class="product-item d-flex justify-content-between align-items-center"
        >
          <div class="d-flex mb-2 align-items-center justify-content-start">
            <i class="bi bi-dot text-success fs-1 animate__animated animate__bounce"></i>
            <NuxtImg
                :src="product.photo"
                :alt="product.title"
                width="50"
                height="50"
                class="rounded mx-1 animate__animated animate__zoomIn"
            />
            <div class="m-2">
              {{ product.title }} - ${{ product.price.find(p => p.symbol === 'USD')?.value || 0 }} /
              ₴{{ product.price.find(p => p.symbol === 'UAH')?.value || 0 }}
            </div>
          </div>
          <div class="mx-2">
            <i class="bi bi-trash3 text-black-50 animate__animated animate__shakeX"></i>
          </div>
        </li>
      </ul>
    </div>
    <div>
      <strong>Total:</strong>
      ${{ calculateTotal(order).usd }} / ₴{{ calculateTotal(order).uah }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  order: Object,
});

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
</script>

<style scoped lang="scss">
.order-details {
  background-color: #fff;
}

.product-list {
  border-top: 1px solid #dee2e6;
}

.product-item {
  padding: 10px 0;
  border-bottom: 1px solid #dee2e6;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #f1f8f5;
    transform: scale(1.02);
    animation: bounce 0.5s;
  }

  &:last-child {
    border-bottom: none;
  }
}

.product-item i {
  transition: transform 0.3s ease;
}

.product-item:hover i {
  transform: rotate(15deg);
}
</style>
