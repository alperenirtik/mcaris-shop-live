"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from"react";
import type { ProductWithCategory } from"@/lib/types";

export interface CartItemType {
  id: string;
  quantity: number;
  product: ProductWithCategory;
}

export interface CartDataType {
  items: CartItemType[];
  subtotal: string;
  count: number;
}

interface CartDrawerContextType {
  isOpen: boolean;
  cartData: CartDataType;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  refreshCart: () => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  addItemToCart: (productId: string, quantity?: number) => Promise<boolean>;
}

const EVENT_KEY ="mcaris_cart_updated";

const defaultCartData: CartDataType = {
  items: [],
  subtotal:"0.00",
  count: 0,
};

const CartDrawerContext = createContext<CartDrawerContextType | undefined>(undefined);

export function CartDrawerProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [cartData, setCartData] = useState<CartDataType>(defaultCartData);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/sepet", { method:"GET", cache:"no-store" });
      if (res.ok) {
        const data = await res.json();
        setCartData({
          items: data.items || [],
          subtotal: data.subtotal ||"0.00",
          count: data.count || 0,
        });
      }
    } catch (err) {
      console.error("Sepet çekilirken hata:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();

    const handleSync = () => {
      fetchCart();
    };

    window.addEventListener(EVENT_KEY, handleSync);
    return () => {
      window.removeEventListener(EVENT_KEY, handleSync);
    };
  }, [fetchCart]);

  const openCart = useCallback(() => {
    fetchCart();
    setIsOpen(true);
  }, [fetchCart]);

  const closeCart = useCallback(() => {
    setIsOpen(false);
  }, []);

  const refreshCart = useCallback(async () => {
    await fetchCart();
    window.dispatchEvent(new Event(EVENT_KEY));
  }, [fetchCart]);

  const updateQuantity = async (itemId: string, quantity: number) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/sepet", {
        method:"POST",
        headers: {"Content-Type":"application/json" },
        body: JSON.stringify({ action:"update", itemId, quantity }),
      });
      if (res.ok) {
        const data = await res.json();
        setCartData({
          items: data.items || [],
          subtotal: data.subtotal ||"0.00",
          count: data.count || 0,
        });
        window.dispatchEvent(new Event(EVENT_KEY));
      }
    } catch (err) {
      console.error("Miktar güncellenirken hata:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (itemId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/sepet", {
        method:"POST",
        headers: {"Content-Type":"application/json" },
        body: JSON.stringify({ action:"remove", itemId }),
      });
      if (res.ok) {
        const data = await res.json();
        setCartData({
          items: data.items || [],
          subtotal: data.subtotal ||"0.00",
          count: data.count || 0,
        });
        window.dispatchEvent(new Event(EVENT_KEY));
      }
    } catch (err) {
      console.error("Ürün silinirken hata:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const addItemToCart = async (productId: string, quantity = 1): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/sepet", {
        method:"POST",
        headers: {"Content-Type":"application/json" },
        body: JSON.stringify({ action:"add", productId, quantity }),
      });
      if (res.ok) {
        const data = await res.json();
        setCartData({
          items: data.items || [],
          subtotal: data.subtotal ||"0.00",
          count: data.count || 0,
        });
        window.dispatchEvent(new Event(EVENT_KEY));
        setIsOpen(true);
        return true;
      }
      return false;
    } catch (err) {
      console.error("Sepete ürün eklenirken hata:", err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartDrawerContext.Provider
      value={{
        isOpen,
        cartData,
        isLoading,
        openCart,
        closeCart,
        refreshCart,
        updateQuantity,
        removeItem,
        addItemToCart,
      }}
    >
      {children}
    </CartDrawerContext.Provider>
  );
}

const defaultContext: CartDrawerContextType = {
  isOpen: false,
  cartData: defaultCartData,
  isLoading: false,
  openCart: () => {},
  closeCart: () => {},
  refreshCart: async () => {},
  updateQuantity: async () => {},
  removeItem: async () => {},
  addItemToCart: async () => false,
};

export function useCartDrawer() {
  const context = useContext(CartDrawerContext);
  return context || defaultContext;
}
