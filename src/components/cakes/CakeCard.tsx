"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, ShoppingCart } from "lucide-react";
import { useBasket } from "@/hooks";
import type { Cake } from "@/types";
import { Button } from "@/components/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export const CakeCard = ({ cake }: { cake: Cake }) => {
  const { addItem } = useBasket();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(cake, 1);
  };

  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full animate-subtle-fade-in">
      <Link
        href={`/cakes/${cake.id}`}
        aria-label={`View details for ${cake.name}`}
      >
        <CardHeader className="p-0">
          <div className="aspect-video relative w-full">
            <Image
              src={cake.imageUrl}
              alt={cake.name}
              layout="fill"
              objectFit="cover"
              data-ai-hint={cake.dataAiHint || "cake image"}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-headline mb-1">
            {cake.name}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground mb-2">
            {/*@ts-ignore*/}
            {cake.description.substring(0, 70)}...
          </CardDescription>
          <p className="text-base font-semibold text-primary-foreground">
            £{cake.price.toFixed(2)}
          </p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0 border-t border-border/50 mt-auto">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button
            variant="outline"
            asChild
            className="w-full sm:w-1/3 lg:gap-0.5"
          >
            <Link href={`/cakes/${cake.id}`}>
              <Eye size={16} /> View
            </Link>
          </Button>
          <Button onClick={handleAddToCart} className="w-full sm:w-2/3">
            <ShoppingCart size={16} className="mr-2" /> Add to Basket
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
