<template>
  <div>
    <!-- Десктопная версия -->
    <div class="table-responsive desktop-view">
      <table class="table">
        <thead>
        <tr>
          <th>{{ $t('products.serialNumber') }}</th>
          <th>{{ $t('products.photo') }}</th>
          <th>{{ $t('products.title') }}</th>
          <th>{{ $t('products.type') }}</th>
          <th>{{ $t('products.specification') }}</th>
          <th>{{ $t('products.guarantee.title') }}</th>
          <th>{{ $t('products.price') }}</th>
          <th>{{ $t('products.date') }}</th>
          <th>{{ $t('products.actions.title') }}</th>
        </tr>
        </thead>
        <tbody
            :key="currentPage"
            class="animate__animated animate__fadeIn"
        >
        <tr v-for="product in paginatedProducts" :key="product.id">
          <td>{{ product.serialNumber }}</td>
          <td>
            <img
                v-if="product.photo"
                :src="product.photo"
                :alt="product.title"
                class="product-thumbnail"
            />
          </td>
          <td>{{ product.title }}</td>
          <td>{{ product.type }}</td>
          <td>{{ product.specification }}</td>
          <td v-if="product.guarantee">
            {{ formatDate(product.guarantee.start) }} - {{ formatDate(product.guarantee.end) }}
          </td>
          <td v-else>-</td>
          <td>
            <template v-if="product.price && product.price.length">
              <div v-for="price in product.price" :key="price.symbol" class="d-flex flex-column my-2">
                <div>{{ price.value }}</div>
                <div>{{ price.symbol }}</div>
              </div>
            </template>
          </td>
          <td>{{ formatDate(product.date) }}</td>
          <td>
            <NuxtLink :to="{ path: `/products/${product.id}` }">
              <i class="bi bi-pencil"></i>
            </NuxtLink>
            <i class="bi bi-trash3 text-danger mx-2" @click="deleteProduct(product.id)"></i>
          </td>
        </tr>
        </tbody>

      </table>
    </div>

    <!-- Мобильная версия -->
    <div class="mobile-view">
      <div v-for="product in paginatedProducts" :key="product.id" class="product-card">
        <img
            v-if="product.photo"
            :src="product.photo"
            :alt="product.title"
            class="product-thumbnail"
        />
        <div class="product-details">
          <p><strong>{{ $t('products.serialNumber') }}:</strong> {{ product.serialNumber }}</p>
          <p><strong>{{ $t('products.title') }}:</strong> {{ product.title }}</p>
          <p><strong>{{ $t('products.type') }}:</strong> {{ product.type }}</p>
          <p><strong>{{ $t('products.specification') }}:</strong> {{ product.specification }}</p>
          <p v-if="product.guarantee">
            <strong>{{ $t('products.guarantee.title') }}:</strong>
            {{ formatDate(product.guarantee.start) }} - {{ formatDate(product.guarantee.end) }}
          </p>
          <p v-else>
            <strong>{{ $t('products.guarantee.title') }}:</strong> -
          </p>
          <p>
            <strong>{{ $t('products.price') }}:</strong>
            <template v-if="product.price && product.price.length">
              <span
                  v-for="price in product.price"
                  :key="price.symbol"
              >
                {{ price.value }} {{ price.symbol }}
              </span>
            </template>
          </p>
          <p><strong>{{ $t('products.date') }}:</strong> {{ formatDate(product.date) }}</p>
        </div>
        <div class="product-actions">
          <NuxtLink :to="{ path: `/products/${product.id}` }" class="edit-btn">
            <i class="bi bi-pencil"></i>
          </NuxtLink>
          <button class="delete-btn" @click="deleteProduct(product.id)">
            <i class="bi bi-trash3"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Пагинация -->
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" @click.prevent="changePage(currentPage - 1)" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        <li
            v-for="page in totalPages"
            :key="page"
            class="page-item"
            :class="{ active: currentPage === page }"
        >
          <a class="page-link" href="#" @click.prevent="changePage(page)">
            {{ page }}
          </a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>

    <div class="charts-container">
      <canvas id="priceChart"></canvas>
      <canvas id="categoryChart"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { format } from 'date-fns';
import { useInventoryStore } from '~/stores/inventory';
import Chart from 'chart.js/auto';

const store = useInventoryStore();
const itemsPerPage = ref(2);
const currentPage = ref(1);

const createPriceChart = () => {
  const products = store.products;
  const labels = products.map((product) => product.title);
  const data = products.map((product) => {
    return product.price?.[0]?.value || 0;
  });

  new Chart(document.getElementById('priceChart') as HTMLCanvasElement, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Price USD',
          data,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
};

const createCategoryChart = () => {
  const products = store.products;
  const categoryCounts = products.reduce((acc, product) => {
    acc[product.type] = (acc[product.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const labels = Object.keys(categoryCounts);
  const data = Object.values(categoryCounts);

  new Chart(document.getElementById('categoryChart') as HTMLCanvasElement, {
    type: 'pie',
    data: {
      labels,
      datasets: [
        {
          label: 'Categories',
          data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
    },
  });
};

onMounted(() => {
  store.fetchProducts().then(() => {
    createPriceChart();
    createCategoryChart();
  });
});

const products = computed(() => store.products);

const totalPages = computed(() => Math.ceil(products.value.length / itemsPerPage.value));
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return products.value.slice(start, end);
});

const changePage = (page: number) => {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
};

const formatDate = (date: string) => {
  if (!date) return '-';
  try {
    return format(new Date(date), 'dd MMM yyyy HH:mm');
  } catch {
    return '-';
  }
};

const deleteProduct = (id: string) => {
  store.deleteProduct(id);
};
</script>

<style scoped>
/* Десктопная версия */
.desktop-view {
  display: block;
}

.mobile-view {
  display: none;
}

/* Мобильная версия */
.product-card {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.product-thumbnail {
  width: 100%;
  height: auto;
  border-radius: 4px;
  object-fit: cover;
}

.product-details {
  margin-top: 0.5rem;
}

.product-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 0.5rem;
}

.edit-btn,
.delete-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: white;
}

.edit-btn {
  background-color: #4caf50;
}

.delete-btn {
  background-color: #f44336;
}

@media (max-width: 768px) {
  .desktop-view {
    display: none;
  }

  .mobile-view {
    display: block;
  }
}

.charts-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 2rem 0;
}

#categoryChart {
  max-width: 400px;
  max-height: 400px;
}

canvas {
  max-width: 100%;
}
</style>
