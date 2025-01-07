<template>
  <div>
    <OrderList
      :orders="orders"
      :selected-order="selectedOrder"
      @view-order="viewOrder"
      @close-details="closeDetails"
      @confirm-delete="confirmDelete"
      @open-create-modal="openCreateOrderModal"
    />

    <OrderCreate :products="products" />

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Deletion</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              :disabled="isDeleting"
              @click="resetButtonState"
            ></button>
          </div>
          <div class="modal-body">
            <div class="my-3">
              Are you sure you want to delete the order "{{
                orderToDelete?.name
              }}"?
            </div>
            <div
              v-for="(item, index) in orderToDelete?.products"
              :key="index"
              class="d-flex"
            >
              <i
                class="bi bi-dot text-success fs-1 animate__animated animate__bounce"
              ></i>
              <NuxtImg
                :src="item.photo"
                alt="Delete Order"
                width="50"
                height="50"
              />
              <div class="ms-3">
                <h6>{{ item.title }}</h6>
                <p class="text-secondary fst-italic">{{ item.serialNumber }}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer bg-body-secondary">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              :disabled="isDeleting"
              @click="resetButtonState"
            >
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-danger"
              :disabled="isDeleting"
              @click="deleteOrder"
            >
              <span v-if="!isDeleting">
                <i class="bi bi-trash3"></i>
                Delete
              </span>
              <span v-else>
                <i class="spinner-border spinner-border-sm" role="status"></i>
                Loading...
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useInventoryStore, useIsLoadingStore } from "~/stores/inventory";

const isLoadingStore = useIsLoadingStore();

const orders = computed(() => store.orders);
const products = computed(() => store.products);

const store = useInventoryStore();
const orderToDelete = ref(null);
const isDeleting = ref(false);

const selectedOrder = ref(null);
const viewOrder = (order) => {
  selectedOrder.value = order;
};

const closeDetails = () => {
  selectedOrder.value = null;
};

const openCreateOrderModal = () => {
  const modal = new bootstrap.Modal(
    document.getElementById("createOrderModal"),
  );
  modal.show();
};

const confirmDelete = (order) => {
  orderToDelete.value = order;
  const modal = new bootstrap.Modal(document.getElementById("deleteModal"));
  modal.show();
};

const deleteOrder = async () => {
  if (orderToDelete.value) {
    isDeleting.value = true;
    try {
      await store.deleteOrder(orderToDelete.value.id);
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("deleteModal"),
      );
      modal.hide();

      if (selectedOrder.value?.id === orderToDelete.value.id) {
        selectedOrder.value = null;
      }
      orderToDelete.value = null;
    } catch (error) {
      console.error("Error deleting order:", error);
    } finally {
      isDeleting.value = false;
    }
  }
};

const resetButtonState = () => {
  isDeleting.value = false;
};

// Fetch orders on component mount
onMounted(async () => {
  await store.fetchProducts();
  await store.fetchOrders();
  isLoadingStore.set(false);
});
</script>

<style scoped>
.btn-danger {
  transition: all 0.3s ease;
}

.spinner-border {
  margin-right: 0.5rem;
}

.modal-header .btn-close {
  font-size: 1.25rem;
}

.modal-footer .btn {
  min-width: 100px;
}
</style>
