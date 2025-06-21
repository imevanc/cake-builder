"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle, ShoppingCart } from "lucide-react";
import { useBasket } from "@/hooks";
import type { CustomCakeProduct } from "@/types";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export const ReviewAndAddCustomCake = ({
  cakeProduct,
}: {
  cakeProduct: CustomCakeProduct;
}) => {
  const { addItem } = useBasket();
  const router = useRouter();

  const handleAddToCart = () => {
    addItem(cakeProduct, 1);
    router.push("/basket");
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold font-headline text-center mb-6">
        Your Cake Masterpiece is Ready!
      </h2>

      <Card className="shadow-lg">
        <CardHeader className="items-center text-center">
          <Image
            src={
              cakeProduct.imageUrl ||
              "https://placehold.co/300x200.png?text=Your+Cake"
            }
            alt={cakeProduct.name}
            width={300}
            height={200}
            className="rounded-md mb-4 object-cover"
            data-ai-hint={cakeProduct.dataAiHint || "custom cake"}
          />
          <CardTitle className="text-2xl">{cakeProduct.name}</CardTitle>
          <CardDescription>
            Review the details of your custom designed cake.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {cakeProduct.aiInitialSuggestion && (
            <div className="p-3 bg-secondary/20 rounded-md">
              <h4 className="font-semibold text-sm text-secondary-foreground">
                AI's Initial Spark:
              </h4>
              <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                {cakeProduct.aiInitialSuggestion}
              </p>
            </div>
          )}
          {cakeProduct.aiRefinedSuggestion && (
            <div className="p-3 bg-accent/20 rounded-md">
              <h4 className="font-semibold text-sm text-accent-foreground">
                AI's Refined Vision:
              </h4>
              <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                {cakeProduct.aiRefinedSuggestion}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-4 border-t">
            <div>
              <span className="font-semibold">Base Flavor:</span>{" "}
              {cakeProduct.baseFlavor}
            </div>
            <div>
              <span className="font-semibold">Frosting:</span>{" "}
              {cakeProduct.frosting}
            </div>
            <div>
              <span className="font-semibold">Size:</span> {cakeProduct.size}
            </div>
            {cakeProduct.specificToppings.length > 0 && (
              <div className="md:col-span-2">
                <span className="font-semibold">Additional Toppings:</span>{" "}
                {cakeProduct.specificToppings.join(", ")}
              </div>
            )}
            {cakeProduct.customMessage && (
              <div className="md:col-span-2">
                <span className="font-semibold">Message on Cake:</span> "
                {cakeProduct.customMessage}"
              </div>
            )}
          </div>
          <p className="text-2xl font-bold text-right text-primary-foreground mt-6">
            Total: £{cakeProduct.price.toFixed(2)}
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={handleAddToCart} size="lg" className="w-full">
            <ShoppingCart className="mr-2 h-5 w-5" /> Add to Basket
          </Button>
        </CardFooter>
      </Card>
      <div className="text-center mt-4 text-muted-foreground flex items-center justify-center gap-2">
        <CheckCircle size={20} className="text-green-500" />
        <span>Your cake is designed! Ready to proceed?</span>
      </div>
    </div>
  );
};
