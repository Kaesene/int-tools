export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  slug: string;
  stock: number;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}
