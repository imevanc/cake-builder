"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useBasket } from "@/hooks";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Separator,
} from "@/components/ui";

export default function BasketPage() {
  const {
    items,
    removeItem,
    updateItemQuantity,
    totalItems,
    totalPrice,
    clearBasket,
  } = useBasket();

  if (totalItems === 0) {
    return (
      <div className="text-center py-20">
        <ShoppingCart
          size={64}
          className="mx-auto text-muted-foreground mb-6"
        />
        <h1 className="text-3xl font-headline font-semibold mb-4">
          Your Basket is Empty
        </h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven't added any delicious cakes yet.
        </p>
        <Button asChild size="lg">
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-headline font-bold mb-8">
        Your Shopping Basket
      </h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <Card
              key={item.basketItemId}
              className="flex flex-col sm:flex-row gap-4 p-4 shadow-md"
            >
              <div className="relative w-full sm:w-32 h-32 sm:h-auto aspect-square rounded-md overflow-hidden shrink-0">
                <Image
                  src={
                    item.product.imageUrl || "https://placehold.co/150x150.png"
                  }
                  alt={item.product.name}
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={item.product.dataAiHint || "cake product"}
                />
              </div>
              <div className="flex-grow space-y-2">
                <h2 className="text-lg font-semibold">{item.product.name}</h2>
                {/*@ts-ignore*/}
                {item.product.type === "custom" && (
                  <p className="text-xs text-muted-foreground italic">
                    Custom Design
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Price: £{item.product.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      updateItemQuantity(item.basketItemId, item.quantity - 1)
                    }
                    disabled={item.quantity <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </Button>
                  <span className="w-8 text-center" aria-live="polite">
                    {item.quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      updateItemQuantity(item.basketItemId, item.quantity + 1)
                    }
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col justify-between items-end sm:items-start mt-4 sm:mt-0">
                <p className="font-semibold text-lg">
                  £{(item.product.price * item.quantity).toFixed(2)}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => removeItem(item.basketItemId)}
                  aria-label={`Remove ${item.product.name} from basket`}
                >
                  <Trash2 size={16} className="mr-1" /> Remove
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-xl">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>
                  Subtotal ({totalItems} item{totalItems === 1 ? "" : "s"})
                </span>
                <span>£{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Estimated Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>£{totalPrice.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button asChild size="lg" className="w-full">
                <Link href="/checkout">
                  Proceed to Checkout <ArrowRight size={18} className="ml-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={clearBasket}
                className="w-full"
              >
                Clear Basket
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
