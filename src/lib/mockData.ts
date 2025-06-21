import type { Cake, CustomCakeProduct } from "@/types";

export const mockCakes: Cake[] = [
  {
    id: "1",
    name: "Classic Chocolate Fudge",
    description:
      "A rich and decadent chocolate fudge cake, perfect for any chocoholic.",
    price: 30.0,
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "chocolate cake",
    category: "Classic",
  },
  {
    id: "2",
    name: "Vanilla Bean Dream",
    description: "Elegant vanilla bean cake with a light buttercream frosting.",
    price: 28.0,
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "vanilla cake",
    category: "Classic",
  },
  {
    id: "3",
    name: "Red Velvet Delight",
    description: "Smooth red velvet cake with a tangy cream cheese frosting.",
    price: 32.0,
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "red velvet",
    category: "Signature",
  },
  {
    id: "4",
    name: "Lemon Zest Celebration",
    description:
      "A refreshing lemon cake with a zesty lemon glaze, perfect for celebrations.",
    price: 35.0,
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "lemon cake",
    category: "Celebration",
  },
  {
    id: "5",
    name: "Strawberry Shortcake Fantasy",
    description:
      "Light sponge cake layered with fresh strawberries and whipped cream.",
    price: 30.0,
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "strawberry shortcake",
    category: "Seasonal",
  },
  {
    id: "6",
    name: "Carrot Cake Heaven",
    description:
      "Moist carrot cake packed with nuts and spices, topped with cream cheese frosting.",
    price: 32.5,
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "carrot cake",
    category: "Signature",
  },
];

export const cakeFlavors: string[] = [
  "Vanilla",
  "Chocolate",
  "Red Velvet",
  "Lemon",
  "Carrot",
  "Strawberry",
  "Coffee",
];
export const cakeFrostings: string[] = [
  "Buttercream",
  "Cream Cheese",
  "Chocolate Ganache",
  "Whipped Cream",
  "Lemon Glaze",
];
export const cakeSizes: CustomCakeProduct["size"][] = [
  "Small (6-8 servings)",
  "Medium (10-12 servings)",
  "Large (15-20 servings)",
];
export const cakeToppings: string[] = [
  "Fresh Berries",
  "Chocolate Shavings",
  "Sprinkles",
  "Edible Flowers",
  "Nuts (Walnuts, Pecans)",
  "Fruit Compote",
];

export const getCakeById = (id: string): Cake | undefined =>
  mockCakes.find((cake) => cake.id === id);
