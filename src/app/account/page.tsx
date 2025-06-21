"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Edit3,
  Gift,
  LogOut,
  PackageOpen,
  ShoppingBag,
  UserCircle,
} from "lucide-react";
import { format } from "date-fns";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { useAuth } from "@/hooks";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import type { Order } from "@/types";
import { db } from "@/lib";

export default function AccountPage() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user && user.id) {
      const fetchOrders = async () => {
        setIsLoadingOrders(true);
        try {
          const ordersRef = collection(db!, "orders");
          // FIRESTORE_INDEX_REQUIRED:
          // This query requires a composite index on the 'orders' collection:
          // Fields: 'userId' (Ascending), 'orderDate' (Descending).
          // You can create this in your Firebase console.
          // The error message from Firebase usually provides a direct link.
          const q = query(
            ordersRef,
            where("userId", "==", user.id),
            orderBy("orderDate", "desc"),
          );
          const querySnapshot = await getDocs(q);
          const fetchedOrders: Order[] = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            // Ensure orderDate is correctly handled if it's a Firestore Timestamp
            const orderDate =
              data.orderDate instanceof Timestamp
                ? data.orderDate.toDate().toISOString()
                : data.orderDate;
            fetchedOrders.push({ id: doc.id, ...data, orderDate } as Order);
          });
          setOrders(fetchedOrders);
        } catch (error) {
          console.error("Error fetching orders: ", error);
          // Handle error (e.g., show a toast)
        }
        setIsLoadingOrders(false);
      };
      fetchOrders();
    }
  }, [user]);

  if (authLoading || !user) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <p className="text-muted-foreground">Loading account details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-headline font-bold text-primary-foreground">
          Your Account
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Manage your profile and view your loyalty rewards.
        </p>
      </header>

      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-2 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <UserCircle size={28} className="mr-3 text-accent" /> Profile
                Information
              </CardTitle>
              <CardDescription>Your personal details.</CardDescription>
            </div>
            <Button variant="outline" size="sm" disabled>
              <Edit3 size={14} className="mr-2" /> Edit (coming soon)
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 text-lg">
            <p>
              <span className="font-semibold text-muted-foreground">Name:</span>{" "}
              {user.name}
            </p>
            <p>
              <span className="font-semibold text-muted-foreground">
                Email:
              </span>{" "}
              {user.email}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-gradient-to-br from-primary to-accent/30 text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center">
              <Gift size={28} className="mr-3" /> Loyalty Points
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Your sweet rewards!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-6xl font-bold">
              {(user.loyaltyPoints || 0).toLocaleString()}
            </p>
            <p className="text-sm mt-1 text-primary-foreground/90">points</p>
            <p className="text-xs mt-4 text-primary-foreground/80">
              Earn 2% back on every purchase. 100 points = £1 off! (Example)
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-12 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <ShoppingBag size={28} className="mr-3 text-accent" /> Order History
          </CardTitle>
          <CardDescription>Your past delicious orders.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingOrders ? (
            <p className="text-muted-foreground text-center py-8">
              Loading your orders...
            </p>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <PackageOpen
                size={48}
                className="mx-auto text-muted-foreground mb-4"
              />
              <p className="text-muted-foreground mb-6">
                You haven't placed any orders yet.
              </p>
              <Button onClick={() => router.push("/")}>Start Shopping</Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order.id} className="shadow-md">
                  <CardHeader className="flex flex-row justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.id.substring(0, 12)}...
                      </CardTitle>
                      <CardDescription>
                        Placed on:{" "}
                        {order.orderDate
                          ? // @ts-ignore
                            format(new Date(order.orderDate), "PPP p")
                          : "Date not available"}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        order.status === "Delivered" ||
                        order.status === "Collected"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {order.status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {order.items.map((item) => (
                        <li
                          key={item.basketItemId || item.product.id}
                          className="flex justify-between items-center"
                        >
                          <span>
                            {item.product.name} (x{item.quantity})
                          </span>
                          <span>
                            £{(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center text-md font-semibold">
                    <span>Total: £{order.totalAmount.toFixed(2)}</span>
                    {order.loyaltyPointsEarned > 0 && (
                      <span className="text-xs text-green-600">
                        +{order.loyaltyPointsEarned} points earned
                      </span>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-12 text-center">
        <Button
          variant="destructive"
          size="lg"
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          <LogOut size={18} className="mr-2" /> Log Out
        </Button>
      </div>
    </div>
  );
}
