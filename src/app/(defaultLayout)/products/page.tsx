"use client";

import { useGetAllProductsQuery } from "@/redux/api/productApi";
import ProductCard from "@/components/module/Product/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  SlidersHorizontal, 
  LayoutGrid, 
  List,
  ChevronDown,
  Gift
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ProductListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, isLoading } = useGetAllProductsQuery({ search: searchTerm });

  const products = data?.data || [];

  return (
    <div className="min-h-screen bg-neutral-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Gift className="w-5 h-5" />
              <span>Personalized Gifts</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
              All Collections
            </h1>
            <p className="text-neutral-500 max-w-lg">
              Explore our range of customizable products. Turn your memories into unique pieces of art with our AI tools.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input 
                placeholder="Search products..." 
                className="pl-10 h-12 rounded-xl bg-white border-neutral-100 focus:ring-primary shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-12 rounded-xl border-neutral-100 bg-white gap-2 text-neutral-600">
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-6">
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {["All", "Home Decor", "Clothing", "Accessories", "Art Prints"].map((cat) => (
              <button 
                key={cat}
                className={`text-sm font-semibold whitespace-nowrap transition-colors ${
                  cat === "All" ? "text-primary border-b-2 border-primary pb-2" : "text-neutral-400 hover:text-neutral-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <span className="text-sm text-neutral-400 font-medium">Sort by:</span>
            <button className="text-sm font-bold flex items-center gap-1 text-neutral-900">
              Featured <ChevronDown className="w-4 h-4" />
            </button>
            <div className="w-px h-4 bg-neutral-200 mx-2"></div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-primary bg-primary/5 rounded-lg">
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-neutral-400 rounded-lg">
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-white rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          <div className="py-20 text-center">
            <div className="bg-neutral-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-neutral-900">No products found</h3>
            <p className="text-neutral-500">Try adjusting your search or filters.</p>
          </div>
        )}

      </div>
    </div>
  );
}
