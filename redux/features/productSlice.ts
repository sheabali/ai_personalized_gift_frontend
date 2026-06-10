import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// ============================================
// Types
// ============================================
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discountPrice?: number;
  category: string;
  tags: string[];
  thumbnail: string;
  images: string[];
  stock: number;
  isActive: boolean;
  isAiEnabled: boolean;
  allowedStyles: string[];
  createdAt: string;
  updatedAt: string;
}

interface ProductState {
  selectedProduct: Product | null;
  filters: {
    category: string;
    search: string;
    minPrice: number | null;
    maxPrice: number | null;
    sortBy: "price_asc" | "price_desc" | "newest" | "popular";
  };
  currentPage: number;
}

// ============================================
// Slice
// ============================================
const initialState: ProductState = {
  selectedProduct: null,
  filters: {
    category: "",
    search: "",
    minPrice: null,
    maxPrice: null,
    sortBy: "newest",
  },
  currentPage: 1,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setSelectedProduct(state, action: PayloadAction<Product | null>) {
      state.selectedProduct = action.payload;
    },

    setFilters(state, action: PayloadAction<Partial<ProductState["filters"]>>) {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1; // reset page on filter change
    },

    setCurrentPage(state, action: PayloadAction<number>) {
      state.currentPage = action.payload;
    },

    resetFilters(state) {
      state.filters = initialState.filters;
      state.currentPage = 1;
    },
  },
});

export const { setSelectedProduct, setFilters, setCurrentPage, resetFilters } =
  productSlice.actions;

export default productSlice.reducer;
