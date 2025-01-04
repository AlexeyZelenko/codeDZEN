// Price calculation worker
self.onmessage = (e) => {
    const { type, data } = e.data;

    switch (type) {
        case 'calculateOrderTotal':
            const total = calculateOrderTotal(data.products);
            self.postMessage({ type: 'orderTotal', data: total });
            break;

        case 'convertCurrency':
            const converted = convertCurrency(data.amount, data.from, data.to, data.rates);
            self.postMessage({ type: 'currencyConverted', data: converted });
            break;
    }
};

function calculateOrderTotal(products: any[]) {
    return products.reduce((acc, product) => {
        const usdPrice = product.price.find((p: any) => p.symbol === 'USD')?.value || 0;
        const uahPrice = product.price.find((p: any) => p.symbol === 'UAH')?.value || 0;

        return {
            usd: acc.usd + usdPrice,
            uah: acc.uah + uahPrice
        };
    }, { usd: 0, uah: 0 });
}

function convertCurrency(amount: number, from: string, to: string, rates: Record<string, number>) {
    const baseAmount = from === 'USD' ? amount : amount / rates[from];
    return to === 'USD' ? baseAmount : baseAmount * rates[to];
}