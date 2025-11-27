// app/context/cart-context.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Product } from "../lib/products-data";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string; // ★ サイズ
};

type CartContextType = {
  items: CartItem[];
  total: number;
  pointsToEarn: number;
  addToCart: (
    product: Product,
    options?: { size?: string; quantity?: number }
  ) => void;
  removeItem: (id: string, size?: string) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "era-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // 初期ロード
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  // 保存
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  // 仮ルール：100円 = 1ポイント
  const pointsToEarn = useMemo(() => Math.floor(total / 100), [total]);

  const addToCart = (
    product: Product,
    options?: { size?: string; quantity?: number }
  ) => {
    const { size, quantity = 1 } = options || {};

    setItems((prev) => {
      const existing = prev.find(
        (p) => p.id === product.id && p.size === size
      );
      if (existing) {
        return prev.map((p) =>
          p.id === product.id && p.size === size
            ? { ...p, quantity: p.quantity + quantity }
            : p
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          size,
        },
      ];
    });
  };

  const removeItem = (id: string, size?: string) => {
    setItems((prev) => prev.filter((p) => !(p.id === id && p.size === size)));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{ items, total, pointsToEarn, addToCart, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
