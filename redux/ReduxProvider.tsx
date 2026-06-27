"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./store";
import CartSyncListener from "@/components/shared/CartSyncListener";

interface PageProps {
  children: ReactNode;
}

export default function ReduxProvider({ children }: PageProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CartSyncListener />
        {children}
      </PersistGate>
    </Provider>
  );
}
