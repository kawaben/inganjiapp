'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import {
  initDB,
  getWishlistProducts,
   addCartItem, removeCartItem, clearCart,
} from '../lib/db';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
   

  useEffect(() => {
  const loadCart = async () => {
    const db = await initDB();
    const tx = db.transaction('cart', 'readonly');
    const store = tx.objectStore('cart');
    const allItems = await store.getAll();
    setCart(allItems);
  };

  loadCart();
}, []);



  

  const addToCart = async (product, color, size) => {
  if (!product?.id || !color || !size) {
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
};


  try {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem),
    });

    if (!res.ok) {
      console.error("Failed to add to cart:", await res.json());
      return;
    }

    const data = await res.json();
    setCart(data.cart); // Set the entire updated cart from the server
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
  try {
    const responses = await Promise.all(
      cart.map(item =>
        fetch('/api/cart', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.id, color: item.color, size: item.size }), 
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
    quantity: item.quantity + 1,
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
        isInCart
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
