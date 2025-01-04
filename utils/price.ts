import type { Price } from '~/types/inventory'

export const getPriceValue = (prices: Price[] | { usd: number, uah: number }, currency: string): number => {
    if (Array.isArray(prices)) {
        return prices.find(p => p.symbol === currency)?.value ?? 0
    }
    return prices[currency.toLowerCase() as keyof typeof prices] ?? 0
}

export const formatPrice = (price: number, currency: string): string => {
    return `${currency === 'UAH' ? '₴' : '$'}${price.toFixed(2)}`
}