import { ref, onUnmounted } from 'vue';

export function usePriceWorker() {
    const worker = ref<Worker | null>(null);
    const loading = ref(false);
    const error = ref<string | null>(null);

    const initWorker = () => {
        if (process.client && !worker.value) {
            worker.value = new Worker(
                new URL('../workers/priceCalculator.worker.ts', import.meta.url),
                { type: 'module' }
            );
        }
    };

    const sanitizeProducts = (products: any[]) => {
        return products.map((product) => ({
            price: product.price.map((price: any) => ({
                symbol: price.symbol,
                value: price.value,
            })),
        }));
    };

    const calculateTotal = (order: any): Promise<{ usd: number; uah: number }> => {
        return new Promise((resolve, reject) => {
            try {
                initWorker();
                if (!worker.value) throw new Error('Worker not initialized');

                loading.value = true;
                error.value = null;

                const sanitizedProducts = sanitizeProducts(order.products);

                const handleMessage = (e: MessageEvent) => {
                    if (e.data.type === 'orderTotal') {
                        worker.value?.removeEventListener('message', handleMessage);
                        loading.value = false;
                        resolve(e.data.data);
                    }
                };

                worker.value.addEventListener('message', handleMessage);
                worker.value.postMessage({
                    type: 'calculateOrderTotal',
                    data: { products: sanitizedProducts },
                });
            } catch (e: any) {
                loading.value = false;
                error.value = e.message;
                reject(e);
            }
        });
    };

    const terminateWorker = () => {
        if (worker.value) {
            worker.value.terminate();
            worker.value = null;
        }
    };

    onUnmounted(() => {
        terminateWorker();
    });

    return {
        loading,
        error,
        calculateTotal,
        terminateWorker,
    };
}
