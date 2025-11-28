'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, CartContextType } from '@/types/cart';

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar carrinho do localStorage na montagem
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Salvar carrinho no localStorage quando items mudar
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((i) => i.productId === item.productId);

      if (existingItem) {
        // Atualiza quantidade (respeitando estoque)
        return currentItems.map((i) =>
          i.productId === item.productId
            ? { ...i, quantity: Math.min(i.quantity + (item.quantity || 1), item.stock) }
            : i
        );
      }

      // Adiciona novo item
      return [...currentItems, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(quantity, item.stock) }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
