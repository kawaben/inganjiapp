'use client';

import { createContext, useContext, useState, useEffect } from 'react';

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


  // 🔸 Add / Remove Wishlist Toggle
  const toggleWishlist = (item) => {
    const exists = wishlist.some((w) => w.id === item.id);
    const updatedWishlist = exists
      ? wishlist.filter((w) => w.id !== item.id)
      : [...wishlist, item];

    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  // 🔸 Clear Wishlist
  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('wishlist');
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        wishlist,
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
