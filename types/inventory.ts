export interface Price {
  value: number
  symbol: string
  isDefault: number
}

export interface Guarantee {
  start: string
  end: string
}

export interface Product {
  id: number
  serialNumber: number
  isNew: number
  photo: string
  title: string
  type: string
  specification: string
  guarantee: Guarantee
  price: Price[]
  order: number
  date: string
}

export interface Order {
  id: number
  name: string
  date: string
  products: Product[]
}

export interface InventoryState {
  orders: Order[]
  products: Product[]
  productTypes: string[]
  isOpenMenu: boolean
  selectedProductType: string
}