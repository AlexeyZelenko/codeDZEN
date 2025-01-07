interface Product {
    price: { symbol: string; value: number }[];
}

interface CalculateOrderTotalData {
    products: Product[];
}

interface OrderTotal {
    usd: number;
    uah: number;
}

// Обработчик события для Web Worker
self.addEventListener('message', (e: MessageEvent) => {
    const { type, data }: { type: string; data: CalculateOrderTotalData } = e.data;

    if (type === 'calculateOrderTotal') {
        const { products } = data;

        const total = products.reduce(
            (acc: OrderTotal, product: Product) => {
                const priceUSD = product.price.find((p) => p.symbol === 'USD')?.value || 0;
                const priceUAH = product.price.find((p) => p.symbol === 'UAH')?.value || 0;

                return {
                    usd: acc.usd + priceUSD,
                    uah: acc.uah + priceUAH,
                };
            },
            { usd: 0, uah: 0 }
        );

        postMessage({ type: 'orderTotal', data: total });
    }
});
