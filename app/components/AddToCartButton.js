'use client';

import { useStore } from '../context/StoreContext';
import { useState, useEffect } from 'react';

const AddToCartButton = ({ product, selectedColor, selectedSize }) => {
  const { cart, addToCart } = useStore();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const exists = cart.some(
      (item) =>
        item.id === product.id &&
        item.color === selectedColor &&
        item.size === selectedSize
         );
         
    setAdded(exists);
    setTimeout(() => setAdded(false), 1500);
        }, [cart, product.id, selectedColor, selectedSize]);

  const handleClick = () => {
  if (!selectedColor || !selectedSize) return; // optionally validate
  addToCart(product, selectedColor, selectedSize);
};


  return (
    <button
      onClick={handleClick}
      disabled={added}
      className={`px-4 py-2 rounded  ${
        added ? 'bg-green-600 text-white' : 'bg-[#1b1403] text-white hover:bg-[#e08325]'
      }`}
    >
      {added ? 'Added to Cart' : 'Add to Cart'}
    </button>
  );
};

export default AddToCartButton;
