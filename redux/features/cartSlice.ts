import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// ============================================
// Types
// ============================================
export interface CartItem {
  id: string; // Internal cart item ID
  productId: string;
  name: string;
  thumbnail: string;
  category: string;
  price: number;
  quantity: number;
  aiDesignId?: string | null;
  aiDesign?: {
    generatedImage: string;
  } | null;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  subTotal: number;
  totalAmount: number;
}

// ============================================
// Helpers
// ============================================
const calcTotals = (items: CartItem[]) => {
  const subTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return {
    totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
    subTotal: subTotal,
    totalAmount: subTotal, // Add tax/shipping logic here if needed
  };
};

// ============================================
// Slice
// ============================================
const initialState: CartState = {
  items: [],
  totalItems: 0,
  subTotal: 0,
  totalAmount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      // Find if item with same product AND same AI design exists
      const existing = state.items.find(
        (i) => i.productId === action.payload.productId && i.aiDesignId === action.payload.aiDesignId
      );
      
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push({
          ...action.payload,
          id: `${action.payload.productId}-${action.payload.aiDesignId || "no-ai"}-${Date.now()}`
        });
      }
      
      const totals = calcTotals(state.items);
      state.totalItems = totals.totalItems;
      state.subTotal = totals.subTotal;
      state.totalAmount = totals.totalAmount;
    },

    removeFromCart(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
      const totals = calcTotals(state.items);
      state.totalItems = totals.totalItems;
      state.subTotal = totals.subTotal;
      state.totalAmount = totals.totalAmount;
    },

    updateQuantity(
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (item) {
        item.quantity = Math.max(1, action.payload.quantity);
      }
      const totals = calcTotals(state.items);
      state.totalItems = totals.totalItems;
      state.subTotal = totals.subTotal;
      state.totalAmount = totals.totalAmount;
    },

    clearCart(state) {
      state.items = [];
      state.totalItems = 0;
      state.subTotal = 0;
      state.totalAmount = 0;
    },

    setCartItems(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload;
      const totals = calcTotals(state.items);
      state.totalItems = totals.totalItems;
      state.subTotal = totals.subTotal;
      state.totalAmount = totals.totalAmount;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCartItems } =
  cartSlice.actions;

export default cartSlice.reducer;
