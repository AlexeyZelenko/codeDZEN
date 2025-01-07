<template>
  <div class="container-fluid px-4 py-3">
    <div v-if="loading" class="text-center py-5 animate__animated animate__fadeIn">
      <div class="spinner-grow text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="lead text-muted mt-3">Loading product details...</p>
    </div>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      Error loading product details
    </div>

    <div v-else-if="productData" class="animate__animated animate__fadeIn animate__faster">
      <div class="card shadow border-0 overflow-hidden">
        <div class="row g-0">
          <div class="col-lg-5 col-md-6">
            <div class="product-image-container">
              <img
                  v-if="productData.photo"
                  :src="productData.photo"
                  :alt="productData.title"
                  class="product-image animate__animated animate__fadeIn"
              />
              <div v-else class="placeholder-image">
                <i class="bi bi-image text-muted"></i>
              </div>
            </div>
          </div>

          <div class="col-lg-7 col-md-6">
            <div class="product-details p-3 p-md-4">
              <div class="animate__animated animate__fadeInRight">
                <h2 class="product-title mb-4">{{ productData.title }}</h2>

                <div class="info-grid">
                  <div class="info-item">
                    <span class="label">Serial Number</span>
                    <div class="value">{{ productData.serialNumber }}</div>
                  </div>

                  <div class="info-item">
                    <span class="label">Specification</span>
                    <div class="value">{{ productData.specification }}</div>
                  </div>

                  <div class="info-item">
                    <span class="label">Release Date</span>
                    <div class="value">{{ formatDate(productData.date) }}</div>
                  </div>

                  <div v-if="productData.priceUSD" class="price-block">
                    <div class="main-price">${{ productData.priceUSD }}</div>
                    <div v-if="productData.priceUAH" class="secondary-price">
                      {{ productData.priceUAH }} UAH
                    </div>
                  </div>
                </div>

                <div class="actions-block">
                  <button class="btn btn-outline-secondary" @click="goBack">
                    <i class="bi bi-arrow-left me-2"></i>Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { gql } from '@apollo/client/core';
import { useRoute, useRouter } from 'vue-router';
import { useIsLoadingStore } from '~/stores/inventory';

const isLoadingStore = useIsLoadingStore();
const route = useRoute();
const router = useRouter();

const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    getProduct(id: $id) {
      id
      title
      serialNumber
      specification
      date
      photo
      priceUAH
      priceUSD
    }
  }
`;

const productId = computed(() => route.params.id as string);
const { result, loading, error } = useQuery(GET_PRODUCT, { id: productId });

const productData = computed(() => result.value?.getProduct);

const formatDate = (date: string) => {
  /* eslint no-lonely-if: ["off"] */
  if (!date) return '-';
  try {
    return new Date(date).toLocaleDateString();
  } catch {
    return '-';
  }
};

// Логика для обработки ошибок
if (error.value) {
  console.error('Error fetching product:', error.value);
}

onMounted(async () => {
  isLoadingStore.set(false);
});

const goBack = () => {
  router.push('/products');
};
</script>

<style scoped lang="scss">
.product-image-container {
  height: 400px;
  background-color: #f8f9fa;
  overflow: hidden;

  @media (max-width: 768px) {
    height: 300px;
  }

  @media (max-width: 576px) {
    height: 250px;
  }
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 1rem;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.02);
  }
}

.product-details {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 1.75rem;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
}

.info-grid {
  display: grid;
  gap: 1rem;
  margin: 1.5rem 0;
}

.info-item {
  .value {
    font-weight: 500;
    word-break: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 30ch;

    &:hover {
      -webkit-line-clamp: unset;
      overflow: visible;
    }
  }
}

.product-title {
  word-break: break-word;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 30ch;

  &:hover {
    -webkit-line-clamp: unset;
    overflow: visible;
  }
}

.price-block {
  margin: 1.5rem 0;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #f8f9fa;

  .main-price {
    font-size: 1.5rem;
    font-weight: 600;
    color: #0d6efd;
  }

  .secondary-price {
    color: #6c757d;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
}

.actions-block {
  margin-top: auto;
  display: flex;
  gap: 0.5rem;

  @media (max-width: 576px) {
    flex-direction: column;

    .btn {
      width: 100%;
    }
  }
}

.btn {
  padding: 0.625rem 1.25rem;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}
</style>