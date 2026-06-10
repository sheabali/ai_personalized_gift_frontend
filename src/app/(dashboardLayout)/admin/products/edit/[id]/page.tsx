"use client";

import ProductForm from "@/components/module/Admin/ProductForm";
import { Button } from "@/components/ui/button";
import { useGetProductByIdQuery } from "@/redux/api/productApi";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function EditProductPage() {
  const { id } = useParams();
  const { data, isLoading } = useGetProductByIdQuery(id as string);

  const product = data?.data;

  if (isLoading) {
    return <div className="p-8 text-center">Loading product data...</div>;
  }

  if (!product) {
    return <div className="p-8 text-center text-red-500 font-bold text-xl">Product not found!</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Edit Product</h1>
          <p className="text-neutral-500">Update the information for <span className="font-bold text-neutral-900">&quot;{product.name}&quot;</span></p>
        </div>
      </div>
      
      <ProductForm initialData={product} isEdit={true} />
    </div>
  );
}
