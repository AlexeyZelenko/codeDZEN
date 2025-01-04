import { ref } from 'vue';
import { useInventoryStore } from '~/stores/inventory';
import type { Product } from '~/types/inventory';
import { v4 as uuidv4 } from 'uuid';


export function useProducts() {
  const loading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Создание нового продукта
   * @param product - Объект продукта без id и orderId
   * @returns Созданный продукт
   */
  const createProduct = async (product: Product): Promise<Product> => {
    const store = useInventoryStore();
    try {
      loading.value = true;
      error.value = null;

      const newProduct = {
        ...product,
        id: uuidv4(),
        orderId: 0,
      };

      await store.addProduct(newProduct);

      return newProduct;
    } catch (e: any) {
      console.error('Error creating product:', e.message);
      error.value = e.message || 'Unknown error';
      throw e;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    createProduct,
  };
}
