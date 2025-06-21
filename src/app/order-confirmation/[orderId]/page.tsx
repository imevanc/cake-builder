"use client";

import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import { useAuth } from "@/hooks";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui";

export default function OrderConfirmationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params.orderId as string;
  const total = searchParams.get("total");
  const points = searchParams.get("points");
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-12 px-4 flex flex-col items-center text-center">
      <Card className="w-full max-w-lg shadow-xl animate-subtle-fade-in">
        <CardHeader className="items-center">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-3xl font-headline">
            Thank You For Your Order!
          </CardTitle>
          <CardDescription className="text-lg">
            Your cake journey is about to begin!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Your order{" "}
            <span className="font-semibold text-primary-foreground">
              #{orderId}
            </span>{" "}
            has been successfully placed. A confirmation email with your order
            details has been sent (simulated).
          </p>

          {total && (
            <p className="text-2xl font-bold">
              Order Total: <span className="text-accent">£{total}</span>
            </p>
          )}

          {user && points && parseInt(points) > 0 && (
            <div className="p-4 bg-accent/10 rounded-md border border-accent/30">
              <p className="font-semibold text-accent-foreground flex items-center justify-center">
                <ShoppingBag className="mr-2 h-5 w-5" /> You've earned{" "}
                <span className="font-bold mx-1">{points}</span> loyalty points!
              </p>
            </div>
          )}

          <div className="mt-8 space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:justify-center sm:gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" /> Continue Shopping
              </Link>
            </Button>
            {user && (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link href="/account">View Account & Orders</Link>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
