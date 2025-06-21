"use client";

import React, { createContext, useState, ReactNode, useEffect } from "react";
import type { BasketItem, Product } from "@/types";
import { toast } from "@/hooks";

interface BasketContextType {
  items: BasketItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (basketItemId: string) => void;
  updateItemQuantity: (basketItemId: string, quantity: number) => void;
  clearBasket: () => void;
  totalItems: number;
  totalPrice: number;
}

export const BasketContext = createContext<BasketContextType | undefined>(
  undefined,
);

interface BasketProviderProps {
  children: ReactNode;
}

export const BasketProvider = ({ children }: BasketProviderProps) => {
  const [items, setItems] = useState<BasketItem[]>([]);

  useEffect(() => {
    const storedBasket = localStorage.getItem("basketItems");
    if (storedBasket) {
      setItems(JSON.parse(storedBasket));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("basketItems", JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, quantity: number) => {
    let operation: "added" | "updated" | null = null;

    setItems((prevItems) => {
      const basketItemId =
        // @ts-ignore
        product.id + (product.type === "custom" ? `_custom_${Date.now()}` : "");
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.basketItemId === basketItemId && item.product.id === product.id,
      );

      // @ts-ignore
      if (existingItemIndex !== -1 && product.type !== "custom") {
        operation = "updated";
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        };
        return updatedItems;
      } else {
        operation = "added";
        return [...prevItems, { product, quantity, basketItemId }];
      }
    });

    setTimeout(() => {
      if (operation === "updated") {
        toast({
          title: "Basket Updated",
          description: `${product.name} quantity increased.`,
        });
      } else if (operation === "added") {
        toast({
          title: "Added to Basket",
          description: `${product.name} has been added.`,
        });
      }
    }, 0);
  };

  const removeItem = (basketItemId: string) => {
    let removedProductName: string | undefined;

    setItems((prevItems) => {
      const itemToRemove = prevItems.find(
        (item) => item.basketItemId === basketItemId,
      );
      if (itemToRemove) {
        removedProductName = itemToRemove.product.name;
      }
      return prevItems.filter((item) => item.basketItemId !== basketItemId);
    });

    setTimeout(() => {
      if (removedProductName) {
        toast({
          title: "Removed from Basket",
          description: `${removedProductName} has been removed.`,
        });
      }
    }, 0);
  };

  const updateItemQuantity = (basketItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(basketItemId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.basketItemId === basketItemId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearBasket = () => {
    setItems([]);
    setTimeout(() => {
      toast({
        title: "Basket Cleared",
        description: "Your shopping basket is now empty.",
      });
    }, 0);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <BasketContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItemQuantity,
        clearBasket,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </BasketContext.Provider>
  );
};
