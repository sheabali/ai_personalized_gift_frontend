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
  Gift,
  ChevronLeft,
  ChevronRight,
  FilterX
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";

const CATEGORIES = ["All", "t-shirt", "mug", "hoodie", "canvas", "accessories"];
const OCCASIONS = ["birthday", "anniversary", "wedding", "corporate", "valentine"];

export default function ProductListPage() {
  const searchParams = useSearchParams();
  const aiDesignId = searchParams.get("aiDesignId");

  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const limit = 8;

  const [showFilters, setShowFilters] = useState(false);

  // Debounced Filter State for API
  const [apiFilters, setApiFilters] = useState({
    search: "",
    category: "",
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
    tags: "",
    page: 1,
    limit: 8
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setApiFilters({
        search: searchTerm,
        category: category === "All" ? "" : category,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        tags: selectedOccasions.join(","),
        page,
        limit
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, category, minPrice, maxPrice, selectedOccasions, page]);

  const { data, isLoading, isFetching } = useGetAllProductsQuery(apiFilters);

  const products = data?.data || [];
  const meta = data?.meta || { total: 0, page: 1, limit: 8 };
  const totalPages = Math.ceil(meta.total / meta.limit) || 1;

  const handleOccasionToggle = (occ: string) => {
    setSelectedOccasions(prev => 
      prev.includes(occ) ? prev.filter(o => o !== occ) : [...prev, occ]
    );
    setPage(1); // Reset page on filter change
  };

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    setPage(1);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setCategory("All");
    setMinPrice("");
    setMaxPrice("");
    setSelectedOccasions([]);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-neutral-100">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <Gift className="w-5 h-5" />
              <span>Personalized Gifts</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 tracking-tight">
              {aiDesignId ? "Select a New Product" : "All Collections"}
            </h1>
            <p className="text-neutral-500 max-w-lg">
              {aiDesignId 
                ? "Choose a product to apply your saved AI design onto!" 
                : "Explore our range of customizable products. Turn your memories into unique pieces of art."}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input 
                placeholder="Search products..." 
                className="pl-10 h-12 rounded-xl bg-neutral-50 border-neutral-200 focus:ring-primary focus:bg-white shadow-sm transition-all"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <Button 
              onClick={() => setShowFilters(!showFilters)}
              variant={showFilters ? "default" : "outline"} 
              className={`h-12 rounded-xl border-neutral-200 gap-2 transition-all lg:hidden ${showFilters ? 'bg-primary text-white' : 'bg-white text-neutral-600'}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar Filters */}
          <AnimatePresence>
            {(showFilters || (typeof window !== 'undefined' && window.innerWidth >= 1024)) && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full lg:w-72 flex-shrink-0 bg-white p-6 rounded-3xl shadow-sm border border-neutral-100 overflow-hidden lg:block lg:h-auto lg:opacity-100"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg text-neutral-900 flex items-center gap-2">
                    <SlidersHorizontal className="w-5 h-5 text-primary" />
                    Filters
                  </h3>
                  <button onClick={clearFilters} className="text-xs text-neutral-500 hover:text-primary transition-colors flex items-center gap-1 font-medium">
                    <FilterX className="w-3 h-3" /> Clear
                  </button>
                </div>

                <div className="space-y-8">
                  {/* Category Filter */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">Category</h4>
                    <div className="flex flex-col gap-2">
                      {CATEGORIES.map((cat) => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="category"
                            checked={category === cat}
                            onChange={() => handleCategorySelect(cat)}
                            className="w-4 h-4 text-primary bg-neutral-100 border-neutral-300 focus:ring-primary" 
                          />
                          <span className={`text-sm capitalize transition-colors ${category === cat ? 'text-primary font-bold' : 'text-neutral-600 group-hover:text-neutral-900'}`}>
                            {cat}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-neutral-100 w-full"></div>

                  {/* Price Filter */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">Price Range</h4>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">৳</span>
                        <Input 
                          type="number" 
                          placeholder="Min" 
                          value={minPrice}
                          onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                          className="pl-7 h-10 rounded-lg text-sm"
                        />
                      </div>
                      <span className="text-neutral-400">-</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">৳</span>
                        <Input 
                          type="number" 
                          placeholder="Max" 
                          value={maxPrice}
                          onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                          className="pl-7 h-10 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-neutral-100 w-full"></div>

                  {/* Occasion Filter (Tags) */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider">Occasion</h4>
                    <div className="flex flex-col gap-2">
                      {OCCASIONS.map((occ) => (
                        <label key={occ} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="checkbox" 
                            checked={selectedOccasions.includes(occ)}
                            onChange={() => handleOccasionToggle(occ)}
                            className="w-4 h-4 rounded text-primary bg-neutral-100 border-neutral-300 focus:ring-primary" 
                          />
                          <span className={`text-sm capitalize transition-colors ${selectedOccasions.includes(occ) ? 'text-neutral-900 font-bold' : 'text-neutral-600 group-hover:text-neutral-900'}`}>
                            {occ}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product Grid Area */}
          <div className="flex-1 w-full space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-neutral-100">
              <p className="text-sm text-neutral-500 font-medium">
                Showing <span className="text-neutral-900 font-bold">{products.length}</span> of <span className="text-neutral-900 font-bold">{meta.total}</span> products
              </p>
              
              <div className="hidden sm:flex items-center gap-4">
                <span className="text-sm text-neutral-400 font-medium">Sort by:</span>
                <button className="text-sm font-bold flex items-center gap-1 text-neutral-900 hover:text-primary transition-colors">
                  Newest <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Grid */}
            {isLoading || isFetching ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="aspect-[4/5] bg-neutral-200 rounded-3xl animate-pulse"></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {products.map((product: any) => (
                  <ProductCard key={product.id} product={product} aiDesignId={aiDesignId} />
                ))}
              </motion.div>
            ) : (
              <div className="py-24 text-center bg-white rounded-3xl border border-neutral-100 shadow-sm">
                <div className="bg-neutral-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-100">
                  <Search className="w-10 h-10 text-neutral-300" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">No products found</h3>
                <p className="text-neutral-500 max-w-sm mx-auto mb-6">We couldn't find anything matching your current filters. Try adjusting them.</p>
                <Button onClick={clearFilters} variant="outline" className="rounded-xl">
                  Clear All Filters
                </Button>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center pt-8 gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-xl border-neutral-200 text-neutral-600 w-10 h-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    // Show dots if too many pages (simple logic for now)
                    if (totalPages > 5 && Math.abs(page - pageNum) > 1 && pageNum !== 1 && pageNum !== totalPages) {
                      if (pageNum === 2 || pageNum === totalPages - 1) return <span key={pageNum} className="px-2 text-neutral-400">...</span>;
                      return null;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "ghost"}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-xl font-bold ${page === pageNum ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-neutral-600 hover:bg-neutral-100'}`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-xl border-neutral-200 text-neutral-600 w-10 h-10"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
