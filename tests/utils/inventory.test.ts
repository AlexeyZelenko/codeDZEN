import { setActivePinia, createPinia } from 'pinia';
import { useInventoryStore } from '~/stores/inventory';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addDoc } from 'firebase/firestore';

// Мокаем Firestore
vi.mock('firebase/firestore', () => ({
  addDoc: vi.fn(),
  collection: vi.fn(),
  getFirestore: vi.fn().mockReturnValue({}),
}));

// Мокаем SweetAlert
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

// Мокаем useRouter из Vue Router
vi.mock('vue-router', () => ({
  useRouter: vi.fn().mockReturnValue({
    push: vi.fn(), // Мокаем метод push
  }),
}));

describe('Inventory Store', () => {
  let inventoryStore: ReturnType<typeof useInventoryStore>;

  beforeEach(() => {
    // Инициализация Pinia и хранилища
    setActivePinia(createPinia());
    inventoryStore = useInventoryStore();
  });

  it('should add a product', async () => {
    const mockProduct = { name: 'Test Product', type: 'Monitors' };

    // Мокаем ответ addDoc
    addDoc.mockResolvedValue({ id: '123' });

    const newProduct = await inventoryStore.addProduct(mockProduct);

    // Проверяем, что продукт был добавлен
    expect(newProduct).toEqual({ ...mockProduct, id: '123' });
    expect(inventoryStore.products).toContainEqual(newProduct);

    // Проверяем, что был вызван SweetAlert
    const Swal = await import('sweetalert2');
    expect(Swal.default.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Продукт успешно добавлен.' })
    );
  });
});
