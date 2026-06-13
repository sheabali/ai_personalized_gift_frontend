"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/features/authSlice";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ShoppingCart,
  Menu,
  User,
  LogOut,
  LayoutDashboard,
  Gift,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Safety hydration hook
  useEffect(() => {
    setMounted(true);
  }, []);

  const { totalItems } = useAppSelector((state) => state.cart);
  const { token, user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Successfully logged out!");
    router.push("/");
  };

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-backdrop-filter:bg-background/60 shadow-xs">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 transition-transform active:scale-95 duration-200">
          <Gift className="h-6 w-6 text-primary animate-pulse" />
          <span className="font-heading font-bold text-2xl text-primary">
            GiftAI
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex gap-8 items-center">
          <Link
            href="/products"
            className={`text-sm font-semibold transition-colors hover:text-primary ${pathname === "/products" ? "text-primary" : "text-muted-foreground"
              }`}
          >
            Products
          </Link>
          <Link
            href="/ai-design"
            className={`text-sm font-semibold transition-colors hover:text-primary ${pathname === "/ai-design" ? "text-primary" : "text-muted-foreground"
              }`}
          >
            AI Design
          </Link>
        </nav>

        {/* Actions Section (Desktop) */}
        <div className="hidden md:flex items-center gap-4">
          {/* Cart Icon */}
          <Link
            href="/cart"
            className="relative p-2.5 text-muted-foreground hover:text-primary transition-all rounded-full hover:bg-muted active:scale-95"
            aria-label="View Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-extrabold text-white animate-in zoom-in duration-200">
                {totalItems}
              </span>
            )}
          </Link>

          {/* User Profile / Access Buttons */}
          {mounted && token ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1.5 focus:outline-hidden cursor-pointer hover:opacity-90 transition-all active:scale-95">
                  <Avatar className="h-9 w-9 border border-border">
                    {user?.avatar && <AvatarImage src={user.avatar} alt={user?.name || "User"} />}
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                      {getInitials(user?.name, user?.email)}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mt-2 rounded-xl shadow-lg border border-border/50" align="end">
                <DropdownMenuLabel className="font-normal py-3">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none text-foreground">{user?.name || "User"}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="rounded-lg">
                  <Link
                    href={user?.role === "ADMIN" ? "/admin/dashboard" : "/user"}
                    className="flex items-center cursor-pointer w-full"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="rounded-lg">
                  <Link href="/user" className="flex items-center cursor-pointer w-full">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>My Orders</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer rounded-lg"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Button
                asChild
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-xl px-5 h-10 transition-transform active:scale-95"
              >
                <Link href="/login">Get Started</Link>
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Action Buttons & Hamburger Menu */}
        <div className="flex items-center gap-2 md:hidden">
          {/* Cart Icon on mobile next to hamburger */}
          <Link
            href="/cart"
            className="relative p-2.5 text-muted-foreground hover:text-primary transition-all rounded-full hover:bg-muted active:scale-95"
            aria-label="View Cart"
          >
            <ShoppingCart className="h-5 w-5" />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-extrabold text-white animate-in zoom-in duration-200">
                {totalItems}
              </span>
            )}
          </Link>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-muted active:scale-95">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] flex flex-col justify-between p-6 rounded-l-3xl border-l border-border/50">
              <div className="space-y-6">
                <SheetHeader className="text-left px-0 pb-4 border-b border-border/50">
                  <SheetTitle>
                    <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                      <Gift className="h-6 w-6 text-primary animate-pulse" />
                      <span className="font-heading font-bold text-xl text-primary">
                        GiftAI
                      </span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-4">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg font-semibold py-2 transition-colors border-b border-border/10 ${pathname === "/" ? "text-primary" : "text-foreground"
                      }`}
                  >
                    Home
                  </Link>
                  <Link
                    href="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg font-semibold py-2 transition-colors border-b border-border/10 ${pathname === "/products" ? "text-primary" : "text-foreground"
                      }`}
                  >
                    Products
                  </Link>
                  <Link
                    href="/ai-design"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg font-semibold py-2 transition-colors border-b border-border/10 ${pathname === "/ai-design" ? "text-primary" : "text-foreground"
                      }`}
                  >
                    AI Design
                  </Link>
                </nav>
              </div>

              <div className="pt-6 border-t border-border/50 mt-auto">
                {mounted && token ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 py-2 px-1">
                      <Avatar className="h-10 w-10 border border-border">
                        {user?.avatar && <AvatarImage src={user.avatar} />}
                        <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                          {getInitials(user?.name, user?.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{user?.name || "User"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        asChild
                        variant="outline"
                        className="w-full justify-start rounded-xl font-semibold h-11 border-neutral-200 cursor-pointer"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link href={user?.role === "ADMIN" ? "/admin/dashboard" : "/user"}>
                          <LayoutDashboard className="mr-2 h-4 w-4 text-muted-foreground" />
                          Dashboard
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="w-full justify-start rounded-xl font-semibold h-11 border-neutral-200 cursor-pointer"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link href="/user">
                          <User className="mr-2 h-4 w-4 text-muted-foreground" />
                          My Orders
                        </Link>
                      </Button>
                      <Button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleLogout();
                        }}
                        variant="destructive"
                        className="w-full rounded-xl font-semibold h-11 bg-destructive hover:bg-destructive/90 text-white cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full h-11 rounded-xl font-semibold border-neutral-200 cursor-pointer"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button
                      asChild
                      className="w-full h-11 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl cursor-pointer"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Link href="/login">Get Started</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
