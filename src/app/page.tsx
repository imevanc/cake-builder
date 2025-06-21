import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { CakeList } from "@/components/cakes";
import { Button } from "@/components/ui";
import type { Cake } from "@/types";
import { mockCakes } from "@/lib";

async function getCakes(): Promise<Cake[]> {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return mockCakes;
}

export default async function HomePage() {
  const cakes = await getCakes();

  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-card rounded-lg shadow-sm">
        <h1 className="text-4xl font-headline font-bold text-primary-foreground mb-4 animate-subtle-slide-in">
          Welcome to Cake Creation Station!
        </h1>
        <p
          className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto animate-subtle-slide-in"
          style={{ animationDelay: "0.2s" }}
        >
          Discover our delightful range of pre-designed cakes or unleash your
          creativity with our custom cake builder.
        </p>
        <Button
          asChild
          size="lg"
          className="animate-subtle-slide-in"
          style={{ animationDelay: "0.4s" }}
        >
          <Link href="/build-cake">
            <PlusCircle className="mr-2 h-5 w-5" /> Build Your Custom Cake
          </Link>
        </Button>
      </section>

      <section>
        <h2 className="text-3xl font-headline font-semibold mb-8 text-center">
          Our Signature Cakes
        </h2>
        <CakeList cakes={cakes} />
      </section>
    </div>
  );
}
