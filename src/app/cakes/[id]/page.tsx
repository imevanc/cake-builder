import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCakeById, mockCakes } from "@/lib";
import { Button } from "@/components/ui";
import { CakeDetailsClient } from "@/components/cakes";

interface CakeDetailPageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  return mockCakes.map((cake) => ({
    id: cake.id,
  }));
}

export default async function CakeDetailPage({ params }: CakeDetailPageProps) {
  await new Promise((resolve) => setTimeout(resolve, 50));
  const cake = getCakeById(params.id);

  if (!cake) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" asChild className="mb-8">
        <Link href="/">
          <ArrowLeft size={16} className="mr-2" /> Back to Cakes
        </Link>
      </Button>
      <div className="grid md:grid-cols-2 gap-8 items-start bg-card p-6 rounded-lg shadow-lg">
        <div className="aspect-square relative w-full rounded-md overflow-hidden shadow-md">
          <Image
            src={cake.imageUrl}
            alt={cake.name}
            layout="fill"
            objectFit="cover"
            priority
            data-ai-hint={cake.dataAiHint || "cake image"}
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-headline font-bold text-primary-foreground">
            {cake.name}
          </h1>
          <p className="text-2xl font-semibold text-accent">
            £{cake.price.toFixed(2)}
          </p>
          <p className="text-muted-foreground text-lg">{cake.description}</p>
          <div className="py-2 px-3 bg-secondary/50 rounded-md">
            <p className="text-sm text-secondary-foreground">
              Category: <span className="font-semibold">{cake.category}</span>
            </p>
          </div>

          <CakeDetailsClient cake={cake} />

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Why you'll love it:</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Made with the finest ingredients</li>
              <li>Baked fresh to order</li>
              <li>Perfect for any occasion</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
