import type { Cake } from "@/types";
import { CakeCard } from "@/components/cakes";

export const CakeList = ({ cakes }: { cakes: Cake[] }) => {
  if (!cakes.length) {
    return (
      <p className="text-center text-muted-foreground">
        No cakes available at the moment. Please check back later!
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {cakes.map((cake) => (
        <CakeCard key={cake.id} cake={cake} />
      ))}
    </div>
  );
};
