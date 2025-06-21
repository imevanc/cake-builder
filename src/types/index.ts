import type { Timestamp } from "firebase/firestore";

export interface ProductBase {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  category: "Signature" | "Classic" | "Celebration" | "Seasonal" | "Custom";
  dataAiHint?: string;
}

export interface Cake extends ProductBase {
  category: "Signature" | "Classic" | "Celebration" | "Seasonal";
}

export interface CustomCakeInput {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;

  occasion: string;
  dietaryRestrictions?: string;
  colorPreferences?: string;
  aiInitialSuggestion?: string;
  aiRefinedSuggestion?: string;

  baseFlavor: string;
  frosting: string;
  size:
    | "Small (6-8 servings)"
    | "Medium (10-12 servings)"
    | "Large (15-20 servings)";
  specificToppings: string[];
  customMessage?: string;
}

export interface CustomCakeProduct extends ProductBase {
  type: "custom";
  category: "Custom";
  baseFlavor: string;
  frosting: string;
  size:
    | "Small (6-8 servings)"
    | "Medium (10-12 servings)"
    | "Large (15-20 servings)";
  specificToppings: string[];
  customMessage?: string;
  aiInitialSuggestion?: string;
  aiRefinedSuggestion?: string;
}

export type Product = Cake | CustomCakeProduct;

// Simplified Product for storing in Order items to avoid deep nesting of complex types
export interface OrderProductInfo {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category: string; // General string for category in orders
  type: "custom" | "standard";
}

export interface BasketItem {
  product: Product;
  quantity: number;
  basketItemId: string;
}

export interface OrderBasketItem {
  product: OrderProductInfo; // Simplified product for order storage
  quantity: number;
  basketItemId: string; // Still useful for some context if needed
}

export interface User {
  id: string;
  email: string;
  name: string;
  loyaltyPoints: number;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
  country: string;
  phoneNumber?: string;
}

export type ShippingOption = "delivery" | "collection";
export type PaymentMethod = "stripe" | "paypal" | "card";

export interface Order {
  id: string;
  userId?: string;
  items: OrderBasketItem[]; // Use OrderBasketItem here
  totalAmount: number;
  shippingAddress?: ShippingAddress;
  shippingOption: ShippingOption;
  shippingCost: number;
  paymentMethod: PaymentMethod;
  status:
    | "Pending"
    | "Processing"
    | "Shipped"
    | "Delivered"
    | "Collected"
    | "Cancelled";
  orderDate: string | Timestamp; // Can be ISO string or Firestore Timestamp
  guestEmail?: string;
  loyaltyPointsEarned: number;
}
