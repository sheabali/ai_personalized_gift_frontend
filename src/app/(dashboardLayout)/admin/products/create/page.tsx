import ProductForm from "@/components/module/Admin/ProductForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Add New Product | GiftAI Admin",
  description: "Create a new product for your gift collection",
};

export default function CreateProductPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Add New Product</h1>
          <p className="text-neutral-500">Fill in the details to list a new product in your store.</p>
        </div>
      </div>
      
      <ProductForm />
    </div>
  );
}
