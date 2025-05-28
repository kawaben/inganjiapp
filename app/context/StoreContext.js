'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import {
  initDB,
  getWishlistProducts,
   addCartItem, removeCartItem, clearCart,getCartItems
} from '../lib/db';

import { useUser } from './UserContext';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
   const { user } = useUser();
const userEmail = user?.email;


 useEffect(() => {
  const loadCart = async () => {
    

    if (userEmail) {
      const userCart = await getCartItems(userEmail);
      setCart(userCart);
    }
  };

  loadCart();
}, []);




  

 const addToCart = async (product, color, size) => {
  if (!product?.id || !color || !size || !product.userEmail) {
    console.error("Invalid input to addToCart:", { product, color, size });
    return;
  }

  const newItem = {
    id: String(product.id),
    name: product.name || "Unnamed Product",
    price: Number(product.price),
    image:
      product.images?.[color] || Object.values(product.images || {})[0] || "",
    color,
    size,
    quantity: 1,
    userEmail: product.userEmail,
  };

  try {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem),
    });

    if (!res.ok) {
      const error = await res.json();
      console.error("Failed to add to cart:", error);
      return;
    }

    // Ideally, your API returns the updated cart for that user
    const { cart } = await res.json();
    setCart(cart); // Updates context state
  } catch (err) {
    console.error("Error adding to cart:", err);
  }
};

  const isInCart = (product, color, size) => {
    return cart.some(
      item => item.id === product.id && item.color === color && item.size === size
    );
  };

 const handleClearCart = async () => {
  if (!cart.length || !cart[0]?.userEmail) {
    console.warn("Cart is empty or missing userEmail.");
    return;
  }

  try {
    const responses = await Promise.all(
      cart.map(item =>
        fetch('/api/cart', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: item.id,
            color: item.color,
            size: item.size,
            userEmail: item.userEmail, // 👈 IMPORTANT
          }),
        })
      )
    );

    const allSuccessful = responses.every(res => res.ok);

    if (allSuccessful) {
      setCart([]);
    } else {
      console.error('Some items failed to delete from the cart.');
    }
  } catch (error) {
    console.error('Error clearing cart:', error);
  }
};

const fetchCartByUser = async (userEmail) => {
  if (!userEmail) return;

  try {
    const res = await fetch(`/api/cart?userEmail=${userEmail}`);
    const data = await res.json();

    if (res.ok) {
      setCart(data);
    } else {
      console.error("Failed to fetch cart:", data.error);
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
  }
};






    const removeItemCompletely = (item) => {
        const updatedCart = cart.filter(
            (cartItem) =>
            !(
                cartItem.id === item.id &&
                cartItem.selectedColor === item.selectedColor &&
                cartItem.selectedSize === item.selectedSize
            )
        );

        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        };

    const increaseQuantity = async (item) => {
  const updatedCart = cart.map((cartItem) => {
    if (
      cartItem.id === item.id &&
      cartItem.color === item.color &&
      cartItem.size === item.size
    ) {
      return { ...cartItem, quantity: cartItem.quantity + 1 };
    }
    return cartItem;
  });

  await addCartItem({
    ...item,
    quantity: item.quantity + 1,userEmail,
  });
  setCart(updatedCart);
};


    const decreaseQuantity = async (item) => {
  const updatedCart = cart
    .map((cartItem) => {
      if (
        cartItem.id === item.id &&
        cartItem.color === item.color &&
        cartItem.size === item.size
      ) {
        return { ...cartItem, quantity: cartItem.quantity - 1 };
      }
      return cartItem;
    })
    .filter((item) => item.quantity > 0);

  await removeCartItem(item);
  setCart(updatedCart);
};




  // 🔸 Remove one unit or whole item
   const removeFromCart = async (item) => {
  try {
    const res = await fetch('/api/cart', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: item.id,
        color: item.color,
        size: item.size,
      }),
    });

    if (!res.ok) {
      console.error("Failed to remove from cart:", await res.json());
      return;
    }

    const data = await res.json();
    setCart(data.cart); 
  } catch (err) {
    console.error("Error removing from cart:", err);
  }
};







useEffect(() => {
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
}, [wishlist]);

  // 🔸 Add / Remove Wishlist Toggle
   useEffect(() => {
    const loadWishlist = async () => {
      await initDB(); 
      const items = await getWishlistProducts();
      setWishlist(items);
    };
    loadWishlist();
  }, []);

  const toggleWishlist = async (item) => {
    const inWishlist = wishlist.some((w) => w.id === item.id);

    if (inWishlist) {
      await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
      });
      setWishlist(wishlist.filter((w) => w.id !== item.id));
    } else {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      setWishlist([...wishlist, item]);
    }
  };

  const clearWishlist = async () => {
    for (let item of wishlist) {
      await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id }),
      });
    }
    setWishlist([]);
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
        setWishlist, 
        addToCart,
        removeFromCart,
        toggleWishlist,
        clearWishlist,
        handleClearCart,
        removeItemCompletely,
        increaseQuantity,
        decreaseQuantity,
        isInCart,
        fetchCartByUser
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
