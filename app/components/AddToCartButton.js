'use client';

import { useStore } from '../context/StoreContext';
import { useUser } from '../context/UserContext';
import { useState, useEffect } from 'react';

const AddToCartButton = ({ product, selectedColor, selectedSize }) => {
  const { cart, addToCart } = useStore();
  const [added, setAdded] = useState(false);
  const { user } = useUser(); 

  useEffect(() => {
    const exists = cart.some(
      (item) =>
        item.id === product.id &&
        item.color === selectedColor &&
        item.size === selectedSize
    );
    setAdded(exists);
  }, [cart, product.id, selectedColor, selectedSize]);

 const handleClick = async () => {
  if (!selectedColor || !selectedSize) {
    console.warn("Color and size must be selected.");
    return;
  }

 
  const safeProduct = {
    ...product,
    id: String(product.id),
    price: Number(product.price),
    name: product.name || "Unnamed product",
    userEmail: user?.email,
  };

  await addToCart(safeProduct, selectedColor, selectedSize);
  setAdded(true);
  console.log("Product passed into AddToCartButton:", safeProduct);


  setTimeout(() => {
    setAdded(false);
  }, 1500);
};



  return (
    <button
      onClick={handleClick}
      disabled={added}
      className={`h-12 px-4 py-2 rounded ${
        added
          ? 'bg-[#1b1403] text-white'
          : 'bg-[#e08325] text-white hover:bg-[#b86819]'
      }`}
    >
      {added ? 'Added to Cart' : 'Add to Cart'}
    </button>
  );
};

export default AddToCartButton;
