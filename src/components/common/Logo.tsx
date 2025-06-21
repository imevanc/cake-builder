import Link from "next/link";
import { CakeSlice } from "lucide-react";

export const Logo = () => (
  <Link
    href="/"
    className="flex items-center gap-2 text-xl font-headline font-bold text-primary-foreground hover:text-accent-foreground transition-colors"
  >
    <CakeSlice className="h-7 w-7 text-accent" />
    <span>Cake Creation Station</span>
  </Link>
);
