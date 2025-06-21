"use client";

import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building,
  CreditCard,
  Loader2,
  Package,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { CheckoutFormSchema, type CheckoutFormValues, db } from "@/lib";
import { toast, useAuth, useBasket } from "@/hooks";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RadioGroup,
  RadioGroupItem,
  Separator,
} from "@/components/ui";
import type { Order } from "@/types";

const mockUuidv4 = () =>
  "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
const finalUuidv4 = typeof uuidv4 === "function" ? uuidv4 : mockUuidv4;

export default function CheckoutPage() {
  const router = useRouter();
  const { user, updateLoyaltyPoints } = useAuth();
  const { items, totalPrice, totalItems, clearBasket } = useBasket();
  const [isLoading, setIsLoading] = useState(false);

  const formMethods = useForm<CheckoutFormValues>({
    resolver: zodResolver(CheckoutFormSchema),
    defaultValues: {
      guestEmail: "",
      shippingOption: "delivery",
      paymentMethod: "card",
      shippingAddress: {
        fullName: "",
        addressLine1: "",
        city: "",
        postalCode: "",
        country: "",
      },
    },
  });
  const { handleSubmit, control, watch, setValue, reset } = formMethods;
  const shippingOption = watch("shippingOption");

  useEffect(() => {
    if (user) {
      setValue("shippingAddress.fullName", user.name);
      setValue("guestEmail", "");
    } else {
      setValue("shippingAddress.fullName", "");
    }
  }, [user, setValue]);

  useEffect(() => {
    if (totalItems === 0 && !isLoading) {
      router.replace("/basket");
    }
  }, [totalItems, isLoading, router]);

  if (totalItems === 0 && !isLoading) {
    return (
      <p className="text-center py-10">Your basket is empty. Redirecting...</p>
    );
  }

  const calculateShippingCost = (option: "delivery" | "collection") =>
    option === "delivery" ? 3.5 : 0.0;
  const currentShippingCost = calculateShippingCost(shippingOption);
  const orderTotal = totalPrice + currentShippingCost;
  const loyaltyPointsEarned = Math.floor(totalPrice * 0.02); // Using 2% of totalPrice in GBP

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsLoading(true);

    const orderId = `CCS-${finalUuidv4().substring(0, 8).toUpperCase()}`;

    const orderData: Omit<Order, "id" | "orderDate"> & { orderDate: any } = {
      userId: user?.id || undefined,
      guestEmail: !user ? data.guestEmail : undefined,
      items: items.map((item) => ({
        product: {
          id: item.product.id,
          name: item.product.name,
          price: item.product.price,
          imageUrl: item.product.imageUrl,
          category: item.product.category,
          type: (item.product as any).type === "custom" ? "custom" : "standard",
        },
        quantity: item.quantity,
        basketItemId: item.basketItemId,
      })),
      totalAmount: orderTotal,
      shippingAddress:
        data.shippingOption === "delivery" ? data.shippingAddress : undefined,
      shippingOption: data.shippingOption,
      shippingCost: currentShippingCost,
      paymentMethod: data.paymentMethod,
      status: "Pending",
      orderDate: serverTimestamp(),
      loyaltyPointsEarned: user ? loyaltyPointsEarned : 0,
    };

    try {
      const orderRef = doc(db!, "orders", orderId);
      await setDoc(orderRef, orderData);
      console.log("Order placed and saved to Firestore with ID:", orderId);

      if (user && loyaltyPointsEarned > 0) {
        await updateLoyaltyPoints(loyaltyPointsEarned);
      }

      clearBasket();
      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${orderId} has been confirmed. Thank you for your purchase!`,
        duration: 7000,
      });
      router.push(
        `/order-confirmation/${orderId}?total=${orderTotal.toFixed(2)}&points=${loyaltyPointsEarned}`,
      );
    } catch (error) {
      console.error("Error placing order: ", error);
      toast({
        title: "Order Placement Failed",
        description: "There was an issue placing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-headline font-bold mb-8 text-center">
        Checkout
      </h1>
      <FormProvider {...formMethods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid lg:grid-cols-3 gap-8 items-start"
        >
          <div className="lg:col-span-2 space-y-8">
            {!user && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={control}
                    name="guestEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          For order updates (as guest).
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Delivery Method</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={control}
                  name="shippingOption"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => {
                            field.onChange(value);
                          }}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-md hover:bg-accent/50 has-[[data-state=checked]]:bg-accent has-[[data-state=checked]]:border-accent-foreground transition-colors">
                            <FormControl>
                              <RadioGroupItem value="delivery" />
                            </FormControl>
                            <FormLabel className="font-normal w-full cursor-pointer">
                              <div className="flex justify-between items-center">
                                <span className="flex items-center">
                                  <Package className="mr-2 h-5 w-5 text-primary" />{" "}
                                  Standard Delivery (2-3 working days)
                                </span>
                                <span>
                                  £
                                  {calculateShippingCost("delivery").toFixed(2)}
                                </span>
                              </div>
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-md hover:bg-accent/50 has-[[data-state=checked]]:bg-accent has-[[data-state=checked]]:border-accent-foreground transition-colors">
                            <FormControl>
                              <RadioGroupItem value="collection" />
                            </FormControl>
                            <FormLabel className="font-normal w-full cursor-pointer">
                              <div className="flex justify-between items-center">
                                <span className="flex items-center">
                                  <Building className="mr-2 h-5 w-5 text-primary" />{" "}
                                  Collect In-Store (2 working days)
                                </span>
                                <span>
                                  £
                                  {calculateShippingCost("collection").toFixed(
                                    2,
                                  )}
                                </span>
                              </div>
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {shippingOption === "delivery" && (
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={control}
                    name="shippingAddress.fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="shippingAddress.addressLine1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 1</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Street address, P.O. box"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="shippingAddress.addressLine2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address Line 2 (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Apartment, suite, unit, building"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={control}
                      name="shippingAddress.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="City" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="shippingAddress.postalCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="Postal Code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={control}
                    name="shippingAddress.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input placeholder="Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={control}
                    name="shippingAddress.phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="For delivery updates"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-md hover:bg-accent/50 has-[[data-state=checked]]:bg-accent has-[[data-state=checked]]:border-accent-foreground transition-colors">
                            <FormControl>
                              <RadioGroupItem value="card" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer flex items-center">
                              <CreditCard className="mr-2 h-5 w-5 text-primary" />{" "}
                              Credit/Debit Card
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-md hover:bg-accent/50 has-[[data-state=checked]]:bg-accent has-[[data-state=checked]]:border-accent-foreground transition-colors">
                            <FormControl>
                              <RadioGroupItem value="paypal" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer flex items-center">
                              <svg
                                className="mr-2 h-5 w-5 text-[#00457C]"
                                role="img"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <title>PayPal</title>
                                <path d="M7.076 21.337H2.478L.002 3.141h4.76L6.08 12.56a.629.629 0 00.61.503l.066-.002c.228-.04.403-.21.473-.43l1.027-4.085 2.05-8.403h4.56L12.61 14.25a.623.623 0 00.587.536h.084c.23-.04.406-.21.476-.431l.56-2.235 1.202-4.81h4.566L17.04 21.337H12.2s-.087 0-.132.003c-.382.006-.688.26-.819.607l-.6 1.747s-.02.064-.033.093l-.068.196c-.05.149-.12.292-.205.426a3.802 3.802 0 01-3.16 2.128h-.002zm15.21-17.825c-.09-.373-.34-.658-.664-.804a1.017 1.017 0 00-.837-.016l-3.95 1.017c-.304.081-.52.295-.616.586L14.36 13.3l.188 1.194.003.015a.628.628 0 00.61.503l.067-.002c.227-.04.403-.21.473-.43l.338-1.354 2.049-8.401z" />
                              </svg>
                              PayPal
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 p-4 border rounded-md hover:bg-accent/50 has-[[data-state=checked]]:bg-accent has-[[data-state=checked]]:border-accent-foreground transition-colors">
                            <FormControl>
                              <RadioGroupItem value="stripe" />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer flex items-center">
                              <svg
                                className="mr-2 h-5 w-5 text-[#635BFF]"
                                role="img"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <title>Stripe</title>
                                <path d="M20.208 15.516c.365-.43.58-.964.58-1.536 0-.628-.262-1.186-.786-1.564L14.92 9.13v-.002c1.31-1.386 1.31-3.456 0-4.83S11.555 2.91 10.246 4.3v.001L5.164 7.683c-.393.31-.608.77-.608 1.248s.239.915.608 1.224l5.082 3.387v.002C3.77 14.928 3.77 17.92 5.164 19.305s3.372 1.388 4.682-.002l.402-.303v.002l4.878-3.486zm-5.016-6.24c.002-.002.004-.003.005-.005l4.02 3.187c.13.104.18.276.18.421s-.05.317-.18.42L15.192 16.5c-.002.002-.004.003-.005.005l-4.02-3.187c-.13-.104-.18-.276-.18-.421s.05-.317.18-.42l4.02-3.187zm-5.03 1.61L6.144 8.33c-.05-.04-.104-.056-.156-.056-.058 0-.117.016-.181.056l-.025.02-.024.02c-.104.078-.156.208-.156.364s.052.286.156.364l4.02 2.557v5.59c0 .028.002.054.005.08l.006.057c.004.04.006.08.006.125 0 .208-.078.39-.208.52L5.76 20.26c-1.145 1.144-1.145 3.036 0 4.18s3.04 1.145 4.184 0l3.846-3.846c1.144-1.145 1.144-3.04 0-4.184l-3.82-3.821zM18.83 20.26c-1.144 1.144-1.144 3.036 0 4.18s3.04 1.145 4.184 0L24 23.614v-5.59l-5.17-3.766z" />
                              </svg>
                              Stripe
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-4 p-4 border-dashed border-2 rounded-md text-center text-muted-foreground">
                  <ShieldCheck className="mx-auto h-10 w-10 mb-2 text-green-500" />
                  <p>
                    Secure payment form will appear here based on your
                    selection.
                  </p>
                  <p className="text-xs">
                    (Payment integration is mocked for this prototype)
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24 shadow-xl">
              <CardHeader>
                <CardTitle>Your Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.basketItemId}
                    className="flex items-center gap-4 py-2 border-b last:border-b-0"
                  >
                    <Image
                      src={
                        item.product.imageUrl ||
                        "https://placehold.co/64x64.png"
                      }
                      alt={item.product.name}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                      data-ai-hint={item.product.dataAiHint || "product image"}
                    />
                    <div className="flex-grow">
                      <p className="font-semibold text-sm">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      £{(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                <Separator />
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>£{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>£{currentShippingCost.toFixed(2)}</span>
                  </div>
                  {user && loyaltyPointsEarned > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span className="flex items-center">
                        <ShoppingBag className="mr-1 h-4 w-4" />
                        Loyalty Points Earned
                      </span>
                      <span>+{loyaltyPointsEarned}</span>
                    </div>
                  )}
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-xl">
                  <span>Order Total</span>
                  <span>£{orderTotal.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isLoading
                    ? "Processing..."
                    : `Place Order & Pay £${orderTotal.toFixed(2)}`}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
