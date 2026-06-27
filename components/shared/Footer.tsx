"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

const Footer = () => {
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for newsletter signup
    console.log("Subscribed");
  };

  return (
    <footer className="bg-muted py-12 border-t border-border">
      <div className="container mx-auto max-w-7xl px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center space-x-2 mb-4">
            <span className="font-heading font-bold text-2xl text-primary">
              GiftAI
            </span>
          </Link>
          <p className="text-sm text-muted-foreground mb-4">
            Turn your memories into unique, beautiful art gifts with the power of AI. From custom anime portraits to Pixar-style 3D cartoons.
          </p>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-4 text-foreground">
            Product
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link
                href="/#features"
                className="hover:text-primary transition-colors"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                href="/pricing"
                className="hover:text-primary transition-colors"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="/#how-it-works"
                className="hover:text-primary transition-colors"
              >
                How it Works
              </Link>
            </li>
            <li>
              <Link
                href="/#faq"
                className="hover:text-primary transition-colors"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="/blogs"
                className="hover:text-primary transition-colors"
              >
                Blogs & Gift Guides
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-4 text-foreground">
            Company & Legal
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link
                href="/about"
                className="hover:text-primary transition-colors"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="hover:text-primary transition-colors"
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                href="/privacy"
                className="hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className="hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading font-semibold mb-4 text-foreground">
            Newsletter
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            Get the latest AI styles, custom gift collections, and exclusive discount codes.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-background"
              required
            />
            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Subscribe
            </Button>
          </form>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl px-4 mt-12 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} GiftAI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
