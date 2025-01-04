<template>
  <div class="modal fade animate__animated animate__fadeIn" id="createOrderModal" tabindex="-1">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Create New Order</h5>
          <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              @click="resetButtonState"
          ></button>
        </div>
        <form @submit.prevent="createOrder" class="p-3">
          <div class="mb-3">
            <label for="orderName" class="form-label">Order Name</label>
            <input
                id="orderName"
                v-model="newOrder.name"
                type="text"
                class="form-control"
                placeholder="Enter order name"
                required
            />
          </div>
          <div class="mb-3">
            <label for="orderDescription" class="form-label">Order Description</label>
            <textarea
                id="orderDescription"
                v-model="newOrder.description"
                class="form-control"
                placeholder="Enter order description"
                rows="3"
            ></textarea>
          </div>
          <div class="mb-3">
            <label for="selectProducts" class="form-label">Select Products</label>
            <div id="selectProducts" class="product-checkbox-list">
              <div
                  v-for="product in products"
                  :key="product.id"
                  class="form-check"
              >
                <input
                    type="checkbox"
                    class="form-check-input"
                    :id="`product-${product.id}`"
                    :value="product"
                    v-model="newOrder.products"
                />
                <label class="form-check-label" :for="`product-${product.id}`">
                  {{ product.title }}
                </label>
              </div>
            </div>
          </div>
          <button
              type="submit"
              class="btn btn-primary"
              :disabled="isLoading"
          >
            <span v-if="!isLoading">Create Order</span>
            <span v-else>
              <i class="spinner-border spinner-border-sm" role="status"></i>
              Loading...
            </span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useInventoryStore } from '~/stores/inventory';

const store = useInventoryStore();
const emit = defineEmits(['create-order']);
const props = defineProps({
  products: Array,
});

const newOrder = ref({
  name: '',
  description: '',
  products: [],
});

const isLoading = ref(false);

const createOrder = async () => {
  try {
    isLoading.value = true;
    const order = {
      ...newOrder.value,
      date: new Date().toISOString(),
    };
    await store.addOrder(order);
    emit('create-order', order);
    newOrder.value = { name: '', description: '', products: [] };
    const modal = bootstrap.Modal.getInstance(document.getElementById('createOrderModal'));
    modal.hide();
  } catch (error) {
    console.error('Error creating order:', error);
  } finally {
    isLoading.value = false;
  }
};

const resetButtonState = () => {
  isLoading.value = false;
};
</script>

<style scoped lang="scss">
.modal-content {
  animation-duration: 0.5s;
  animation-fill-mode: both;
}

.product-checkbox-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-primary {
  transition: all 0.3s ease;
}

.btn-primary:disabled {
  cursor: not-allowed;
  background-color: #6c757d;
  border-color: #6c757d;
}

.spinner-border {
  margin-right: 0.5rem;
}
</style>
