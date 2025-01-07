<template>
  <section>
    <h2 class="d-flex align-items-center">
      {{ $t("products.title") }}
      <NuxtLink
        to="/productForm"
        class="btn btn-success btn-sm ms-3 rounded-circle"
      >
        <i class="bi bi-plus-lg"></i>
      </NuxtLink>
    </h2>

    <ProductsTypeFilter v-model="selectedType" :types="store.productTypes" />

    <ProductsList v-if="filteredProducts.length" :products="filteredProducts" />
    <div v-else>
      <p>{{ $t("products.empty") }}</p>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useInventoryStore, useIsLoadingStore } from "~/stores/inventory";

const isLoadingStore = useIsLoadingStore();
const store = useInventoryStore();
const selectedType = ref("");

const filteredProducts = computed(() => {
  return store.products.filter(
    (product) => !selectedType.value || product.type === selectedType.value,
  );
});

onMounted(async () => {
  await store.fetchProducts();
  isLoadingStore.set(false);
});
</script>
