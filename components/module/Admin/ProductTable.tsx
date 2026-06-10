"use client";

import { 
  useGetAllProductsQuery, 
  useDeleteProductMutation 
} from "@/redux/api/productApi";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  Trash2, 
  Plus, 
  Eye, 
  MoreHorizontal,
  Search,
  Filter
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function ProductTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useGetAllProductsQuery({ search: searchTerm });
  const [deleteProduct] = useDeleteProductMutation();

  const products = data?.data || [];

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id).unwrap();
        toast.success("Product deleted successfully");
      } catch (error: any) {
        toast.error(error?.data?.message || "Failed to delete product");
      }
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
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

      <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-neutral-50/50">
            <TableRow>
              <TableHead className="w-[100px] font-bold text-neutral-900">Image</TableHead>
              <TableHead className="font-bold text-neutral-900">Name</TableHead>
              <TableHead className="font-bold text-neutral-900">Category</TableHead>
              <TableHead className="font-bold text-neutral-900">Price</TableHead>
              <TableHead className="font-bold text-neutral-900">Stock</TableHead>
              <TableHead className="font-bold text-neutral-900">Status</TableHead>
              <TableHead className="text-right font-bold text-neutral-900">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-neutral-500">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product: any) => (
                <TableRow key={product.id} className="hover:bg-neutral-50/50 transition-colors">
                  <TableCell>
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-neutral-100 bg-neutral-50">
                      <Image
                        src={product.thumbnail}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-neutral-900">
                    <div className="flex flex-col">
                      <span>{product.name}</span>
                      <span className="text-xs text-neutral-400 font-normal">{product.isAiEnabled ? "AI Enabled" : "Standard"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-full px-2 text-[10px] uppercase font-bold text-neutral-500">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold text-neutral-900">
                    ${product.discountPrice || product.price}
                  </TableCell>
                  <TableCell>
                    <span className={`text-sm font-medium ${product.stock < 5 ? "text-red-500" : "text-neutral-600"}`}>
                      {product.stock} in stock
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={product.isActive ? "bg-green-500/10 text-green-600 border-none rounded-full" : "bg-neutral-100 text-neutral-400 border-none rounded-full"}>
                      {product.isActive ? "Active" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-neutral-100 rounded-full">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl p-2 min-w-[160px]">
                        <DropdownMenuLabel className="text-xs text-neutral-400 font-medium">Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/products/${product.id}`} className="flex items-center gap-2 cursor-pointer py-2">
                            <Eye className="w-4 h-4" /> View Live
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/products/edit/${product.id}`} className="flex items-center gap-2 cursor-pointer py-2">
                            <Edit className="w-4 h-4" /> Edit Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(product.id)}
                          className="flex items-center gap-2 text-red-500 focus:text-red-500 cursor-pointer py-2"
                        >
                          <Trash2 className="w-4 h-4" /> Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
