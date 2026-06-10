import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "../api/baseApi";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import productReducer from "./productSlice";
import orderReducer from "./orderSlice";
import aiDesignReducer from "./aiDesignSlice";

const rootReducer = combineReducers({
  // RTK Query
  [baseApi.reducerPath]: baseApi.reducer,

  // Feature slices
  auth: authReducer,
  cart: cartReducer,
  product: productReducer,
  order: orderReducer,
  aiDesign: aiDesignReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
