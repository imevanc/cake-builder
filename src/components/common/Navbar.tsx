"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import {
  ShoppingBasket,
  User as UserIcon,
  LogIn,
  LogOut,
  UserPlus,
  Menu,
  PackageOpen,
  Zap,
} from "lucide-react";
import { useBasket } from "@/hooks";
import { useAuth } from "@/hooks";
import { Logo } from "@/components/common";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui";
import { Separator } from "@/components/ui";

export const Navbar = () => {
  const { totalItems } = useBasket();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLink = ({
    href,
    children,
    icon,
    inSheet = false,
    onClick,
  }: {
    href: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
    inSheet?: boolean;
    onClick?: () => void;
  }) => {
    const commonClasses =
      "text-primary-foreground hover:text-accent-foreground transition-colors";
    const sheetItemClasses =
      "flex items-center gap-3 p-3 rounded-md hover:bg-accent/10 w-full text-left";

    const content = (
      <>
        {icon && (
          <span className={inSheet ? "" : "md:hidden lg:inline-block"}>
            {icon}
          </span>
        )}
        <span className={inSheet ? "flex-grow" : ""}>{children}</span>
      </>
    );

    if (inSheet) {
      return (
        <SheetClose asChild>
          <Link
            href={href}
            className={`${commonClasses} ${sheetItemClasses}`}
            onClick={() => {
              onClick?.();
              setIsMobileMenuOpen(false);
            }}
          >
            {content}
          </Link>
        </SheetClose>
      );
    }

    return (
      <Link
        href={href}
        className={`${commonClasses} flex items-center gap-1.5 py-2 px-1 lg:px-2`}
        onClick={onClick}
      >
        {content}
      </Link>
    );
  };

  const AuthButton = ({
    children,
    onClick,
    icon,
    inSheet = false,
  }: {
    children: ReactNode;
    onClick: () => void;
    icon: ReactNode;
    inSheet?: boolean;
  }) => {
    const commonClasses =
      "text-primary-foreground hover:text-accent-foreground transition-colors";
    const sheetItemClasses =
      "flex items-center gap-3 p-3 rounded-md hover:bg-accent/10 w-full text-left";

    const content = (
      <>
        {icon}
        <span className={inSheet ? "flex-grow" : ""}>{children}</span>
      </>
    );

    if (inSheet) {
      return (
        <SheetClose asChild>
          <Button
            variant="ghost"
            onClick={() => {
              onClick();
              setIsMobileMenuOpen(false);
            }}
            className={`${commonClasses} ${sheetItemClasses} justify-start`}
          >
            {content}
          </Button>
        </SheetClose>
      );
    }

    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={onClick}
        className={`${commonClasses} flex items-center gap-1.5 py-2 px-1 lg:px-2 hover:bg-primary/80`}
      >
        {content}
      </Button>
    );
  };

  return (
    <header className="bg-primary shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-2.5 flex justify-between items-center">
        <Logo />

        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          <NavLink href="/" icon={<PackageOpen size={18} />}>
            Cakes
          </NavLink>
          <NavLink href="/build-cake" icon={<Zap size={18} />}>
            Build Your Own
          </NavLink>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <Link
            href="/basket"
            className="relative text-primary-foreground hover:text-accent-foreground transition-colors p-2"
            aria-label="Shopping Basket"
          >
            <ShoppingBasket size={24} />
            {totalItems > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0.5 text-xs"
              >
                {totalItems}
              </Badge>
            )}
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {user ? (
              <>
                <NavLink href="/account" icon={<UserIcon size={18} />}>
                  Account
                </NavLink>
                <AuthButton onClick={logout} icon={<LogOut size={18} />}>
                  Logout
                </AuthButton>
              </>
            ) : (
              <>
                <NavLink href="/login" icon={<LogIn size={18} />}>
                  Login
                </NavLink>
                <NavLink href="/signup" icon={<UserPlus size={18} />}>
                  Sign Up
                </NavLink>
              </>
            )}
          </div>

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-primary-foreground hover:text-accent-foreground hover:bg-primary/80"
                >
                  <Menu size={24} />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] sm:w-[300px] bg-card p-0 flex flex-col"
              >
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>
                    <span className="sr-only">Main Menu</span>
                  </SheetTitle>
                  <SheetClose asChild>
                    <Logo />
                  </SheetClose>
                </SheetHeader>
                <div className="flex flex-col p-4 space-y-1 flex-grow">
                  <NavLink href="/" inSheet icon={<PackageOpen size={20} />}>
                    Cakes
                  </NavLink>
                  <NavLink href="/build-cake" inSheet icon={<Zap size={20} />}>
                    Build Your Own
                  </NavLink>

                  <Separator className="my-3" />

                  {user ? (
                    <>
                      <NavLink
                        href="/account"
                        inSheet
                        icon={<UserIcon size={20} />}
                      >
                        Hi, {user.name.split(" ")[0]}
                      </NavLink>
                      <AuthButton
                        onClick={logout}
                        inSheet
                        icon={<LogOut size={20} />}
                      >
                        Logout
                      </AuthButton>
                    </>
                  ) : (
                    <>
                      <NavLink href="/login" inSheet icon={<LogIn size={20} />}>
                        Login
                      </NavLink>
                      <NavLink
                        href="/signup"
                        inSheet
                        icon={<UserPlus size={20} />}
                      >
                        Sign Up
                      </NavLink>
                    </>
                  )}
                </div>
                <div className="p-4 border-t mt-auto">
                  <p className="text-xs text-muted-foreground text-center">
                    &copy; {new Date().getFullYear()} Cake Creation Station
                  </p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
};
