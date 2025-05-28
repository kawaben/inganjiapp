"use client";

import { useEffect } from "react";
import { useStore } from "../context/StoreContext";
import { useUser } from "../context/UserContext";

export default function CartLoader() {
  const { loadCart } = useStore();
  const { user } = useUser();

  useEffect(() => {
    if (user?.email) {
      loadCart(user.email);
    }
  }, [user?.email]);

  return null; 
}
