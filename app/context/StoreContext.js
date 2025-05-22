'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import {
  initDB,
  getWishlistProducts,
} from '../lib/db';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
   

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, color, size, image) => {
    const exists = cart.some(
      item =>
        item.id === product.id &&
        item.color === color &&
        item.size === size
    );

    if (!exists) {
      setCart(prev => [
        ...prev,
        {
          ...product,
          color,
          size,
          image,
          quantity: 1,
        },
      ]);
    }
  };


  const isInCart = (product, color, size) => {
    return cart.some(
      item => item.id === product.id && item.color === color && item.size === size
    );
  };


    const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart'); // Or use setItem('cart', JSON.stringify([])) for consistency
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

    const increaseQuantity = (item) => {
    const updatedCart = cart.map((cartItem) => {
        if (
        cartItem.id === item.id &&
        cartItem.selectedColor === item.selectedColor &&
        cartItem.selectedSize === item.selectedSize
        ) {
        return { ...cartItem, quantity: cartItem.quantity + 1 };
        }
        return cartItem;
    });

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const decreaseQuantity = (item) => {
    const updatedCart = cart
        .map((cartItem) => {
        if (
            cartItem.id === item.id &&
            cartItem.selectedColor === item.selectedColor &&
            cartItem.selectedSize === item.selectedSize
        ) {
            return { ...cartItem, quantity: cartItem.quantity - 1 };
        }
        return cartItem;
        })
        .filter((item) => item.quantity > 0); // remove if quantity is zero

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    };



  // 🔸 Remove one unit or whole item
const removeFromCart = (item) => {
  const updatedCart = cart
    .map((cartItem) => {
      if (
        cartItem.id === item.id &&
        cartItem.selectedColor === item.selectedColor &&
        cartItem.selectedSize === item.selectedSize
      ) {
        return {
          ...cartItem,
          quantity: cartItem.quantity - 1,
        };
      }
      return cartItem;
    })
    .filter((cartItem) => cartItem.quantity > 0); // Remove if quantity becomes 0

  setCart(updatedCart);
  localStorage.setItem('cart', JSON.stringify(updatedCart));
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
        clearCart,
        removeItemCompletely,
        increaseQuantity,
        decreaseQuantity,
        isInCart
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
