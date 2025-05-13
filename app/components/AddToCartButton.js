'use client';
import { useState } from 'react';

export default function AddToCartButton({ product }) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the item already exists (match by id + size)
    const existingItemIndex = cart.findIndex(
      (item) => item.id === product.id && item.size === product.size
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart[existingItemIndex].quantity += product.quantity || 1;
    } else {
      // Add new item
      cart.push({ ...product, quantity: product.quantity || 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setAdded(true);

    // Optionally revert the button state after a delay
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`px-4 py-2 rounded text-white ${
        added ? 'bg-green-600' : 'bg-black hover:bg-gray-800'
      }`}
    >
      {added ? 'Added!' : 'Add to Cart'}
    </button>
    
  );
}
