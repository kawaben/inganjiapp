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


 const loadCart = async (userEmail) => {
  if (!userEmail) return;

  try {
    const res = await fetch(`/api/cart?userEmail=${userEmail}`);
    const data = await res.json();

    if (res.ok) {
      setCart(data); 
    } else {
      console.error("Failed to load cart:", data.error);
    }
  } catch (err) {
    console.error("Error loading cart:", err);
  }
};




  

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

    
    const { cart } = await res.json();
    setCart(cart); 
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

    const removeFromCart = async (item) => {
      try {
        const response = await fetch('/api/cart', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: item.id,
            color: item.color,
            size: item.size,
            userEmail: item.userEmail,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to remove from cart:', errorData);
          return;
        }

        const { cart } = await response.json();
        setCart(cart);
      } catch (error) {
        console.error('Error removing from cart:', error);
      }
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

      await removeFromCart(item);
      setCart(updatedCart);
    };

   








  // Wishlist Toggle
  useEffect(() => {
  const loadWishlist = async () => {
    await initDB();
    const items = await getWishlistProducts(); 
    setWishlist(items);
  };
  loadWishlist();
}, []);

const toggleWishlist = async (item) => {
  const userEmail = item.email; 
  const key = { id: item.id, color: item.color, size: item.size, email: userEmail };

  const inWishlist = wishlist.some(
    (w) =>
      w.id === item.id &&
      w.color === item.color &&
      w.size === item.size &&
      w.email === userEmail
  );

  if (inWishlist) {
    await fetch('/api/wishlist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(key),
    });
    setWishlist(
      wishlist.filter(
        (w) =>
          !(
            w.id === item.id &&
            w.color === item.color &&
            w.size === item.size &&
            w.email === userEmail
          )
      )
    );
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
    const key = {
      id: item.id,
      color: item.color,
      size: item.size,
      email: item.email,
    };
    await fetch('/api/wishlist', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(key),
    });
  }
  setWishlist([]);
};

  return (
    <StoreContext.Provider
      value={{
        cart,
        loadCart,
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
