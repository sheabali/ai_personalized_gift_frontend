import { Button } from "@/components/ui/button";
import Link from "next/link";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-heading font-bold text-2xl text-primary">
            GiftAI
          </span>
        </Link>
        <nav className="hidden md:flex gap-8 items-center">
          <Link
            href="/#features"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            How it Works
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/#faq"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            FAQ
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground hover:text-primary hidden sm:block transition-colors"
          >
            Sign In
          </Link>
          <Button
            asChild
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
          >
            <Link href="/login">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
