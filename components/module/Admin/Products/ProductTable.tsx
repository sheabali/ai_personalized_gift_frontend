"use client";

import { Search, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NRTable } from "@/components/ui/core/NRTable";
import { useProductTable } from "@/hooks/useProductTable";
import ProductTableSkeleton from "./ProductTableSkeleton";

export default function ProductTable() {
  const { products, isLoading, searchTerm, setSearchTerm, columns } = useProductTable();

  return (
    <div className="space-y-6">
      {/* Toolbar: Search + Add Button (always visible, even while loading) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <Input
            placeholder="Search products..."
            className="pl-10 h-11 rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Link href="/admin/products/create">
          <Button className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl gap-2 h-11 px-6">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Table / Skeleton */}
      {isLoading ? (
        <ProductTableSkeleton />
      ) : (
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden px-6">
          <NRTable columns={columns} data={products} emptyMessage="No products found." />
        </div>
      )}
    </div>
  );
}
