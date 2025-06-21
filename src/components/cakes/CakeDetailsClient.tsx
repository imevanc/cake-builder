"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useBasket } from "@/hooks";
import type { Cake } from "@/types";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { Label } from "@/components/ui";

export const CakeDetailsClient = ({ cake }: { cake: Cake }) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useBasket();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => addItem(cake, quantity);

  return (
    <div className="space-y-6 mt-6 pt-6 border-t">
      <div className="flex items-center gap-4">
        <Label htmlFor={`quantity-${cake.id}`} className="text-lg">
          Quantity:
        </Label>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
          >
            <Minus size={16} />
          </Button>
          <Input
            id={`quantity-${cake.id}`}
            type="number"
            value={quantity}
            readOnly // Use buttons to change, or implement controlled input with validation
            className="w-16 text-center"
            aria-label="Current quantity"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= 10}
            aria-label="Increase quantity"
          >
            <Plus size={16} />
          </Button>
        </div>
      </div>
      <Button size="lg" onClick={handleAddToCart} className="w-full md:w-auto">
        <ShoppingCart size={20} className="mr-2" /> Add to Basket
      </Button>
    </div>
  );
};
