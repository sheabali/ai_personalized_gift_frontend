"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import { useSyncCartMutation, useGetCartQuery } from "@/redux/api/cartApi";
import { setCartItems } from "@/redux/features/cartSlice";

export default function CartSyncListener() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.cart.items);
  const user = useAppSelector((state) => state.auth.user);
  const [syncCart] = useSyncCartMutation();
  const [isLoadedFromDb, setIsLoadedFromDb] = useState(false);

  // Fetch the cart from backend if user is logged in and not yet loaded
  const { data: dbCartResponse, isSuccess } = useGetCartQuery(undefined, {
    skip: !user || isLoadedFromDb,
  });

  // Load from DB once when user changes or on first mount
  useEffect(() => {
    if (!user) {
      setIsLoadedFromDb(false);
      return;
    }

    if (isSuccess && dbCartResponse?.data && !isLoadedFromDb) {
      const dbItems = dbCartResponse.data.items || [];
      dispatch(setCartItems(dbItems));
      setIsLoadedFromDb(true);
    }
  }, [isSuccess, dbCartResponse, user, dispatch, isLoadedFromDb]);

  // Sync to DB when items change (only after initial load has completed)
  useEffect(() => {
    if (!user || !isLoadedFromDb) return;

    const timer = setTimeout(() => {
      syncCart({ items })
        .unwrap()
        .catch((err) => {
          console.error("Failed to sync cart to backend:", err);
        });
    }, 2000); // 2 second debounce to prevent spamming on rapid quantity changes

    return () => clearTimeout(timer);
  }, [items, user, syncCart, isLoadedFromDb]);

  return null;
}
