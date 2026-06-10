import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// ============================================
// Types
// ============================================
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED" | "CANCELLED";

export interface Order {
  id: string;
  orderNumber: string;
  totalPrice: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentMethod: string;
  createdAt: string;
}

interface OrderState {
  currentOrder: Order | null;
  checkoutStep: "cart" | "address" | "payment" | "confirmation";
}

// ============================================
// Slice
// ============================================
const initialState: OrderState = {
  currentOrder: null,
  checkoutStep: "cart",
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    setCurrentOrder(state, action: PayloadAction<Order | null>) {
      state.currentOrder = action.payload;
    },

    setCheckoutStep(state, action: PayloadAction<OrderState["checkoutStep"]>) {
      state.checkoutStep = action.payload;
    },

    resetOrderState(state) {
      state.currentOrder = null;
      state.checkoutStep = "cart";
    },
  },
});

export const { setCurrentOrder, setCheckoutStep, resetOrderState } = orderSlice.actions;

export default orderSlice.reducer;
