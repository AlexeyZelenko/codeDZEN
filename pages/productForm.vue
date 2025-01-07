<template>
  <form @submit.prevent="handleSubmit" class="product-form p-4 border rounded">
    <h3>{{ $t("products.add.title") }}</h3>

    <div class="mb-3">
      <label class="form-label">{{ $t("products.serialNumber") }}</label>
      <input
        v-model.number="form.serialNumber"
        type="number"
        class="form-control"
        required
      />
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t("products.title") }}</label>
      <input v-model="form.title" type="text" class="form-control" required />
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t("products.type") }}</label>
      <select v-model="form.type" class="form-select" required>
        <option v-for="type in store.productTypes" :key="type" :value="type">
          {{ type }}
        </option>
      </select>
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t("products.specification") }}</label>
      <textarea
        v-model="form.specification"
        class="form-control"
        required
      ></textarea>
    </div>

    <ProductsPhotoUpload v-model="form.photo" />

    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label">{{ $t("products.guarantee.start") }}</label>
        <input
          v-model="form.guarantee.start"
          type="datetime-local"
          class="form-control"
          required
        />
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label">{{ $t("products.guarantee.end") }}</label>
        <input
          v-model="form.guarantee.end"
          type="datetime-local"
          class="form-control"
          required
        />
      </div>
    </div>

    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label">{{ $t("products.priceUSD") }}</label>
        <input
          v-model.number="form.priceUSD"
          type="number"
          step="0.01"
          class="form-control"
          required
        />
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label">{{ $t("products.priceUAH") }}</label>
        <input
          v-model.number="form.priceUAH"
          type="number"
          step="0.01"
          class="form-control"
          required
        />
      </div>
    </div>

    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>

    <button type="submit" class="btn btn-primary" :disabled="loading">
      {{ loading ? $t("common.loading") : $t("products.add.submit") }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useInventoryStore } from "~/stores/inventory";
import { useProducts } from "~/composables/useProducts";

const emit = defineEmits<{
  submit: [];
}>();

const store = useInventoryStore();
const { loading, error, createProduct } = useProducts();

const form = ref({
  serialNumber: 0,
  isNew: 1,
  photo: "",
  title: "",
  type: "",
  specification: "",
  guarantee: {
    start: "",
    end: "",
  },
  priceUSD: 0,
  priceUAH: 0,
});

const handleSubmit = async () => {
  try {
    const product = {
      ...form.value,
      price: [
        { value: form.value.priceUSD, symbol: "USD", isDefault: 0 },
        { value: form.value.priceUAH, symbol: "UAH", isDefault: 1 },
      ],
      order: 0,
      date: new Date().toISOString(),
    };
    await createProduct(product);
    form.value = {
      serialNumber: 0,
      isNew: 1,
      photo: "",
      title: "",
      type: "",
      specification: "",
      guarantee: {
        start: "",
        end: "",
      },
      priceUSD: 0,
      priceUAH: 0,
    };
    emit("submit");
  } catch {
    // Error is handled by the composable
  }
};
</script>
