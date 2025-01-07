import { defineStore } from "pinia";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "~/utils/firebase";
import type { InventoryState, Order, Product } from "~/types/inventory";
import { saveToStorage, getFromStorage } from "~/utils/storage";
import Swal from "sweetalert2";

const STORAGE_KEY = "inventory";

export const useInventoryStore = defineStore("inventory", {
  state: (): InventoryState =>
    getFromStorage<InventoryState>(STORAGE_KEY, {
      orders: [],
      products: [],
      productTypes: [
        "Monitors",
        "Laptops",
        "Smartphones",
        "Tablets",
        "Accessories",
      ],
      isOpenMenu: false,
      selectedProductType: "",
    }),

  actions: {
    toggleMenu() {
      this.isOpenMenu = !this.isOpenMenu;
    },

    setSelectedProductType(type: string) {
      this.selectedProductType = type;
    },

    async addProduct(product: Omit<Product, "id">): Promise<Product> {
      const isLoadingStore = useIsLoadingStore();
      try {
        isLoadingStore.set(true);
        const docRef = await addDoc(collection(db, "products"), product);
        const newProduct: Product = {
          ...product,
          id: docRef.id,
        };
        this.products.push(newProduct);
        saveToStorage(STORAGE_KEY, this.$state);

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Продукт успешно добавлен.",
          showConfirmButton: false,
          timer: 1500,
        });

        return newProduct;
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
        console.error("Error adding product:", { product, error });
        throw error;
      } finally {
        isLoadingStore.set(false);
      }
    },

    async fetchProducts(): Promise<void> {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        this.products = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as unknown as Product[];
        saveToStorage(STORAGE_KEY, this.$state);
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },

    async updateProduct(
      productId: string,
      updatedData: Partial<Product>,
    ): Promise<void> {
      const isLoadingStore = useIsLoadingStore();
      try {
        isLoadingStore.set(true);
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("id", "==", productId));

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const productDoc = querySnapshot.docs[0];
          const firebaseDocId = productDoc.id;

          // Выполняем обновление
          await updateDoc(doc(db, "products", firebaseDocId), updatedData);

          console.log(`Продукт с productId ${productId} обновлен успешно.`);

          Swal.fire({
            position: "top-end",
            icon: "success",
            title: `Продукт обновлен успешно.`,
            showConfirmButton: false,
            timer: 1500,
          });

          const router = useRouter();
          await router.push("/products");
        } else {
          Swal.fire({
            icon: "error",
            title: `Продукт не найден.`,
            text: "Something went wrong!",
            footer: '<a href="#">Why do I have this issue?</a>',
          });
          throw new Error(`Продукт с productId ${productId} не найден.`);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: `Ошибка обновления продукта`,
          text: error,
          footer: '<a href="#">Why do I have this issue?</a>',
        });
        console.error("Ошибка обновления продукта:", error);
        throw error;
      } finally {
        saveToStorage(STORAGE_KEY, this.$state);
      }
    },

    async deleteProduct(productId: string): Promise<void> {
      const isLoadingStore = useIsLoadingStore();
      try {
        isLoadingStore.set(true);

        // Найти продукт в локальном состоянии
        const product = this.products.find((p) => p.id === productId);
        if (!product) {
          throw new Error(`Продукт с ID ${productId} не найден.`);
        }

        // Удаление изображения, если оно существует
        if (product.photo) {
          const filePathEncoded = product.photo.split("/").slice(-1)[0];
          const filePath = decodeURIComponent(filePathEncoded.split("?")[0]);

          try {
            const { deleteFile } = useFileUpload();
            await deleteFile(filePath);
            console.log(`Файл изображения "${filePath}" успешно удален.`);
          } catch (error) {
            console.warn("Не удалось удалить файл изображения:", error);
          }
        }

        const productsRef = collection(db, "products");
        const q = query(productsRef, where("id", "==", productId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const productDoc = querySnapshot.docs[0];
          const firebaseDocId = productDoc.id;

          await deleteDoc(doc(db, "products", firebaseDocId));
          console.log(`Продукт с ID ${productId} успешно удален из Firestore.`);
        } else {
          throw new Error(`Продукт с ID ${productId} не найден в Firestore.`);
        }

        // Удаление из локального состояния
        this.products = this.products.filter(
          (product) => product.id !== productId,
        );
        saveToStorage(STORAGE_KEY, this.$state);

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Продукт успешно удален.`,
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Ошибка при удалении продукта",
          text: error instanceof Error ? error.message : "Что-то пошло не так!",
        });
        console.error("Ошибка при удалении продукта:", error);
      } finally {
        isLoadingStore.set(false);
      }
    },

    async fetchOrders(): Promise<void> {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        this.orders = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];
        saveToStorage(STORAGE_KEY, this.$state);
      } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }
    },

    async addOrder(order: Omit<Order, "id">): Promise<Order> {
      try {
        const docRef = await addDoc(collection(db, "orders"), order);
        const newOrder: Order = { ...order, id: docRef.id };

        this.orders.push(newOrder);

        // Update products linked to the order
        newOrder.products.forEach((product) => {
          const existingProduct = this.products.find(
            (p) => p.id === product.id,
          );
          if (existingProduct) {
            existingProduct.orderId = docRef.id;
          }
        });

        saveToStorage(STORAGE_KEY, this.$state);

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Order added successfully.",
          showConfirmButton: false,
          timer: 1500,
        });

        return newOrder;
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error adding order",
          text: error.message || "Something went wrong!",
        });
        throw error;
      }
    },

    async updateOrder(
      orderId: string,
      updatedData: Partial<Order>,
    ): Promise<void> {
      try {
        const orderIndex = this.orders.findIndex(
          (order) => order.id === orderId,
        );

        if (orderIndex === -1)
          throw new Error(`Order with ID ${orderId} not found.`);

        // Reset product references for the old order
        this.orders[orderIndex].products.forEach((product) => {
          const existingProduct = this.products.find(
            (p) => p.id === product.id,
          );
          if (existingProduct) existingProduct.orderId = null;
        });

        // Update the order in Firestore
        await updateDoc(doc(db, "orders", orderId), updatedData);

        // Update the order in local state
        this.orders[orderIndex] = {
          ...this.orders[orderIndex],
          ...updatedData,
        };

        // Update product references for the updated order
        updatedData.products?.forEach((product) => {
          const existingProduct = this.products.find(
            (p) => p.id === product.id,
          );
          if (existingProduct) existingProduct.orderId = orderId;
        });

        saveToStorage(STORAGE_KEY, this.$state);

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Order updated successfully.",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error updating order",
          text: error.message || "Something went wrong!",
        });
        throw error;
      }
    },

    async deleteOrder(orderId: string): Promise<void> {
      try {
        const orderIndex = this.orders.findIndex(
          (order) => order.id === orderId,
        );

        if (orderIndex === -1)
          throw new Error(`Order with ID ${orderId} not found.`);

        // Remove associated products' references
        this.orders[orderIndex].products.forEach((product) => {
          const existingProduct = this.products.find(
            (p) => p.id === product.id,
          );
          if (existingProduct) existingProduct.orderId = null;
        });

        // Delete the order from Firestore
        await deleteDoc(doc(db, "orders", orderId));

        // Remove the order from local state
        this.orders.splice(orderIndex, 1);

        saveToStorage(STORAGE_KEY, this.$state);

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Order deleted successfully.",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error deleting order",
          text: error.message || "Something went wrong!",
        });
        throw error;
      }
    },
  },
});

export const useIsLoadingStore = defineStore("isLoading", {
  state: () => ({
    isLoading: true,
  }),
  actions: {
    set(data: boolean) {
      this.$patch({ isLoading: data });
    },
  },
});
