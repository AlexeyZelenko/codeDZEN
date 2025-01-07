<template>
  <div>
    <!-- Десктопная версия -->
    <div class="table-responsive desktop-view">
      <table class="table">
        <thead>
          <tr>
            <th>{{ $t("products.serialNumber") }}</th>
            <th>{{ $t("products.photo") }}</th>
            <th>{{ $t("products.title") }}</th>
            <th>{{ $t("products.type") }}</th>
            <th>{{ $t("products.specification") }}</th>
            <th>{{ $t("products.guarantee.title") }}</th>
            <th>{{ $t("products.price") }}</th>
            <th>{{ $t("products.date") }}</th>
            <th>{{ $t("products.actions.title") }}</th>
          </tr>
        </thead>
        <tbody :key="currentPage" class="animate__animated animate__fadeIn">
          <tr
            v-for="product in paginatedProducts"
            :key="product.id"
            class="table-row"
          >
            <td class="wrap-text">{{ product.serialNumber }}</td>
            <td>
              <NuxtImg
                v-if="product.photo"
                :src="product.photo"
                :alt="product.title"
                class="product-thumbnail"
              />
            </td>
            <td class="wrap-text">{{ product.title }}</td>
            <td class="wrap-text">{{ product.type }}</td>
            <td class="wrap-text">{{ product.specification }}</td>
            <td v-if="product.guarantee" class="wrap-text">
              {{ formatDate(product.guarantee.start) }} -
              {{ formatDate(product.guarantee.end) }}
            </td>
            <td v-else class="wrap-text">-</td>
            <td>
              <template v-if="product.price && product.price.length">
                <div
                  v-for="price in product.price"
                  :key="price.symbol"
                  class="d-flex flex-column my-2"
                >
                  <div>{{ price.value }}</div>
                  <div>{{ price.symbol }}</div>
                </div>
              </template>
            </td>
            <td class="wrap-text">{{ formatDate(product.date) }}</td>
            <td class="actions-cell">
              <NuxtLink
                :to="{ path: `/products/details/${product.id}` }"
                class="action-btn view-btn"
              >
                <i class="bi bi-ticket-detailed"></i>
              </NuxtLink>
              <NuxtLink
                :to="{ path: `/products/${product.id}` }"
                class="action-btn edit-btn"
              >
                <i class="bi bi-pencil"></i>
              </NuxtLink>
              <button
                class="action-btn delete-btn"
                @click="deleteProduct(product.id)"
              >
                <i class="bi bi-trash3"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Мобильная версия -->
    <div class="mobile-view">
      <div
        v-for="product in paginatedProducts"
        :key="product.id"
        class="product-card"
      >
        <img
          v-if="product.photo"
          :src="product.photo"
          :alt="product.title"
          class="product-thumbnail"
        />
        <div class="product-details">
          <p>
            <strong>{{ $t("products.serialNumber") }}:</strong>
            {{ product.serialNumber }}
          </p>
          <p>
            <strong>{{ $t("products.title") }}:</strong> {{ product.title }}
          </p>
          <p>
            <strong>{{ $t("products.type") }}:</strong> {{ product.type }}
          </p>
          <p>
            <strong>{{ $t("products.specification") }}:</strong>
            {{ product.specification }}
          </p>
          <p v-if="product.guarantee">
            <strong>{{ $t("products.guarantee.title") }}:</strong>
            {{ formatDate(product.guarantee.start) }} -
            {{ formatDate(product.guarantee.end) }}
          </p>
          <p v-else>
            <strong>{{ $t("products.guarantee.title") }}:</strong> -
          </p>
          <p>
            <strong>{{ $t("products.price") }}:</strong>
            <template v-if="product.price && product.price.length">
              <span v-for="price in product.price" :key="price.symbol">
                {{ price.value }} {{ price.symbol }}
              </span>
            </template>
          </p>
          <p>
            <strong>{{ $t("products.date") }}:</strong>
            {{ formatDate(product.date) }}
          </p>
        </div>
        <div class="actions-cell">
          <NuxtLink
            :to="{ path: `/products/details/${product.id}` }"
            class="action-btn view-btn"
          >
            <i class="bi bi-ticket-detailed"></i>
          </NuxtLink>
          <NuxtLink
            :to="{ path: `/products/${product.id}` }"
            class="action-btn edit-btn"
          >
            <i class="bi bi-pencil"></i>
          </NuxtLink>
          <button
            class="action-btn delete-btn"
            @click="deleteProduct(product.id)"
          >
            <i class="bi bi-trash3"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- Пагинация -->
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a
            class="page-link"
            @click.prevent="changePage(currentPage - 1)"
            aria-label="Previous"
          >
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
          <a
            class="page-link"
            href="#"
            @click.prevent="changePage(currentPage + 1)"
            aria-label="Next"
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>

    <div class="charts-container">
      <!-- Графики -->
      <div class="charts-container">
        <ProductsChartsDisplay
          chartId="priceChart"
          chartType="bar"
          :labels="priceChartLabels"
          :data="priceChartData"
          :backgroundColors="priceChartColors"
          :borderColors="priceChartBorderColors"
          :options="priceChartOptions"
        />
        <ProductsChartsDisplay
          chartId="categoryChart"
          chartType="pie"
          :labels="categoryChartLabels"
          :data="categoryChartData"
          :backgroundColors="categoryChartColors"
          :borderColors="categoryChartBorderColors"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { format } from "date-fns";
import { useInventoryStore } from "~/stores/inventory";

const store = useInventoryStore();
const itemsPerPage = ref(2);
const currentPage = ref(1);

const priceChartLabels = ref<string[]>([]);
const priceChartData = ref<number[]>([]);
const priceChartColors = ref<string[]>(["rgba(75, 192, 192, 0.2)"]);
const priceChartBorderColors = ref<string[]>(["rgba(75, 192, 192, 1)"]);
const priceChartOptions = {
  responsive: true,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};

const categoryChartLabels = ref<string[]>([]);
const categoryChartData = ref<number[]>([]);
const categoryChartColors = ref<string[]>([
  "rgba(255, 99, 132, 0.2)",
  "rgba(54, 162, 235, 0.2)",
  "rgba(255, 206, 86, 0.2)",
]);
const categoryChartBorderColors = ref<string[]>([
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
]);

const selectedProductType = computed(() => store.selectedProductType);

const products = computed(() =>
  store.products.filter((product) => {
    return (
      !selectedProductType.value || product.type === selectedProductType.value
    );
  }),
);

const totalPages = computed(() =>
  Math.ceil(products.value.length / itemsPerPage.value),
);
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
  if (!date) return "-";
  try {
    return format(new Date(date), "dd MMM yyyy HH:mm");
  } catch {
    return "-";
  }
};

const deleteProduct = (id: string) => {
  store.deleteProduct(id);
};

onMounted(() => {
  store.fetchProducts().then(() => {
    const products = store.products;

    // Prepare data for price chart
    priceChartLabels.value = products.map((product) => product.title);
    priceChartData.value = products.map(
      (product) => product.price?.[0]?.value || 0,
    );

    // Prepare data for category chart
    const categoryCounts = products.reduce(
      (acc, product) => {
        acc[product.type] = (acc[product.type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    categoryChartLabels.value = Object.keys(categoryCounts);
    categoryChartData.value = Object.values(categoryCounts);
  });
});
</script>

<style scoped lang="scss">
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
  word-break: break-word;
  white-space: normal;
  overflow-wrap: anywhere;
}

.product-thumbnail {
  width: 100%;
  height: auto;
  border-radius: 4px;
  object-fit: cover;
}

.product-details {
  margin: 0.5rem 0;
  line-height: 1.5;
  font: {
    size: 1rem;
    weight: 400;
  }
  word-break: break-word;
  overflow-wrap: anywhere;
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

.wrap-text {
  word-break: break-word; /* Перенос длинных слов */
  white-space: normal; /* Разрешить перенос строк */
  overflow-wrap: anywhere; /* Перенос текста, если он не умещается */
}

th {
  font: {
    size: 1rem;
    weight: 500;
  }
}

td {
  min-width: 90px;
  font: {
    size: 0.9rem;
    weight: 400;
  }
  color: #4d4c4c;
}

.table {
  border-collapse: separate;
  border-spacing: 0;

  th {
    background-color: #f8f9fa;
    padding: 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td {
    padding: 1rem;
    vertical-align: middle;
    min-width: 100px;

    &.actions-cell {
      white-space: nowrap;
      min-width: 120px;

      .action-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        border-radius: 6px;
        margin: 0 4px;
        transition: all 0.2s;

        &.view-btn {
          color: #0d6efd;
          background-color: rgba(13, 110, 253, 0.1);
          &:hover {
            background-color: rgba(13, 110, 253, 0.2);
          }
        }

        &.edit-btn {
          color: #198754;
          background-color: rgba(25, 135, 84, 0.1);
          &:hover {
            background-color: rgba(25, 135, 84, 0.2);
          }
        }

        &.delete-btn {
          color: #dc3545;
          background-color: rgba(220, 53, 69, 0.1);
          &:hover {
            background-color: rgba(220, 53, 69, 0.2);
          }
        }

        i {
          font-size: 1rem;
        }
      }
    }
  }

  .wrap-text {
    max-width: 200px;
    word-break: break-word;
    white-space: normal;
    overflow-wrap: break-word;
    line-height: 1.4;
  }

  .product-thumbnail {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 6px;
  }
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  margin: 0 4px;
  transition: all 0.2s;

  &.view-btn {
    color: #0d6efd;
    background-color: rgba(13, 110, 253, 0.1);
    &:hover {
      background-color: rgba(13, 110, 253, 0.2);
    }
  }

  &.edit-btn {
    color: #198754;
    background-color: rgba(25, 135, 84, 0.1);
    &:hover {
      background-color: rgba(25, 135, 84, 0.2);
    }
  }

  &.delete-btn {
    color: #dc3545;
    background-color: rgba(220, 53, 69, 0.1);
    &:hover {
      background-color: rgba(220, 53, 69, 0.2);
    }
  }

  i {
    font-size: 1rem;
  }
}
</style>
