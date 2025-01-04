<template>
  <form @submit.prevent="handleSubmit" class="product-form p-4 border rounded">
    <div class="d-flex justify-content-between">
      <h3>{{ $t('products.edit.title') }}</h3>
      <NuxtLink to="/products">
        <i class="bi bi-x-lg"></i>
      </NuxtLink>
    </div>


    <div class="mb-3">
      <label class="form-label">{{ $t('products.serialNumber') }}</label>
      <input
          v-model.number="form.serialNumber"
          type="number"
          class="form-control"
          required
      />
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t('products.title') }}</label>
      <input
          v-model="form.title"
          type="text"
          class="form-control"
          required
      />
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t('products.type') }}</label>
      <select v-model="form.type" class="form-select" required>
        <option v-for="type in store.productTypes" :key="type" :value="type">
          {{ type }}
        </option>
      </select>
    </div>

    <div class="mb-3">
      <label class="form-label">{{ $t('products.specification') }}</label>
      <textarea
          v-model="form.specification"
          class="form-control"
          required
      ></textarea>
    </div>

    <ProductsPhotoUpload v-model="form.photo" />

    <div class="row">
      <div class="col-md-6 mb-3">
        <label class="form-label">{{ $t('products.guarantee.start') }}</label>
        <input
            v-model="form.guarantee.start"
            type="datetime-local"
            class="form-control"
            required
        />
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label">{{ $t('products.guarantee.end') }}</label>
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
        <label class="form-label">{{ $t('products.priceUSD') }}</label>
        <input
            v-model.number="form.priceUSD"
            type="number"
            step="0.01"
            class="form-control"
            required
        />
      </div>
      <div class="col-md-6 mb-3">
        <label class="form-label">{{ $t('products.priceUAH') }}</label>
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
      {{ loading ? $t('common.loading') : $t('products.edit.submit') }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '~/utils/firebase';
import { useInventoryStore, useIsLoadingStore } from '~/stores/inventory'

const isLoadingStore = useIsLoadingStore()

const route = useRoute();
const store = useInventoryStore();

const form = ref({
  id: '',
  serialNumber: 0,
  isNew: 1,
  photo: '',
  title: '',
  type: '',
  specification: '',
  guarantee: {
    start: '',
    end: '',
  },
  priceUSD: 0,
  priceUAH: 0,
});

const handleSubmit = async () => {
  try {
    const product = {
      ...form.value,
      price: [
        { value: form.value.priceUSD, symbol: 'USD', isDefault: 0 },
        { value: form.value.priceUAH, symbol: 'UAH', isDefault: 1 },
      ],
      order: 0,
      date: new Date().toISOString(),
    };
    console.log('Обновляем продукт:', product);
    await store.updateProduct(product.id, product);
  } catch {
    console.log('Error updating product');
  }
};

onMounted(async () => {
  isLoadingStore.set(true);
  const productId = route.params.id as string;

  try {
    // Создаем запрос с фильтром по полю productId
    const productsRef = collection(db, 'products');
    const q = query(productsRef, where('id', '==', productId));

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const productDoc = querySnapshot.docs[0];
      const fetchedProduct = productDoc.data();

      form.value = {
        id: fetchedProduct.id || '',
        serialNumber: fetchedProduct.serialNumber || 0,
        isNew: fetchedProduct.isNew || 1,
        photo: fetchedProduct.photo || '',
        title: fetchedProduct.title || '',
        type: fetchedProduct.type || '',
        specification: fetchedProduct.specification || '',
        guarantee: {
          start: fetchedProduct.guarantee?.start || '',
          end: fetchedProduct.guarantee?.end || '',
        },
        priceUSD: fetchedProduct.price?.find((p) => p.symbol === 'USD')?.value || 0,
        priceUAH: fetchedProduct.price?.find((p) => p.symbol === 'UAH')?.value || 0,
      };
    } else {
      throw new Error('Продукт с указанным ID не найден');
    }
  } catch (e: any) {
    console.error('Ошибка поиска продукта:', e.message || e);
  } finally {
    isLoadingStore.set(false);
  }
});
</script>
