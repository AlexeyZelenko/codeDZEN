import { setActivePinia, createPinia } from 'pinia';
import { useInventoryStore } from '~/stores/inventory';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { addDoc } from 'firebase/firestore';

// Mock Firebase Firestore methods
vi.mock('firebase/firestore', () => ({
  addDoc: vi.fn(),
  collection: vi.fn(),
}));
vi.mock('~/utils/firebase', () => ({
  db: {},
}));

// Mock SweetAlert
vi.mock('sweetalert2', () => ({
  default: {
    fire: vi.fn(),
  },
}));

describe('Inventory Store', () => {
  let inventoryStore: ReturnType<typeof useInventoryStore>;

  beforeEach(() => {
    // Initialize Pinia and store
    setActivePinia(createPinia());
    inventoryStore = useInventoryStore();
  });

  it('should add a product', async () => {
    const mockProduct = { name: 'Test Product', type: 'Monitors' };

    // Mock Firestore `addDoc` response
    (addDoc as unknown as jest.Mock).mockResolvedValue({ id: '123' });

    const newProduct = await inventoryStore.addProduct(mockProduct);

    // Verify the product is added
    expect(newProduct).toEqual({ ...mockProduct, id: '123' });
    expect(inventoryStore.products).toContainEqual(newProduct);

    // Verify SweetAlert was called
    const Swal = await import('sweetalert2');
    expect(Swal.default.fire).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Продукт успешно добавлен.' })
    );
  });
});
