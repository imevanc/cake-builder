import { CustomCakeBuilder } from "@/components/custom-cake-builder";

export default function BuildCakePage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-headline font-bold text-primary-foreground">
          Build Your Dream Cake
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          Let our AI help you design the perfect cake, or refine it with your
          own creative touches!
        </p>
      </header>
      <CustomCakeBuilder />
    </div>
  );
}
