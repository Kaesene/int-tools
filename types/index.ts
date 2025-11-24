// Tipos do projeto INT Tools

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  comparePrice?: number; // Preço "De" para mostrar desconto
  images: string[];
  category: string;
  subcategory?: string;
  brand?: string;
  sku: string;
  stock: number;
  specs?: ProductSpec[];
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductSpec {
  name: string;
  value: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  subcategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  verified: boolean;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  cpf?: string;
  addresses?: Address[];
  createdAt: Date;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export enum PaymentMethod {
  PIX = 'pix',
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BOLETO = 'boleto',
}

export interface ShippingOption {
  id: string;
  name: string;
  price: number;
  deliveryTime: string;
  company: string;
}
