self.addEventListener('message', (e) => {
    const { type, data } = e.data;

    if (type === 'calculateOrderTotal') {
        const { products } = data;

        const total = products.reduce(
            (acc: { usd: number; uah: number }, product: any) => {
                const priceUSD = product.price.find((p: any) => p.symbol === 'USD')?.value || 0;
                const priceUAH = product.price.find((p: any) => p.symbol === 'UAH')?.value || 0;

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
