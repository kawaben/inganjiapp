'use client';
import { useState } from 'react';

export default function AddToCartButton({ product, selectedSize, selectedColor }) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const image = product.images[selectedColor];

    const newItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1,
    size: selectedSize,
    color: selectedColor,
    image, // <-- store specific image URL here
  };

    // Check if same item (same id, color, size) exists
    const existingIndex = cart.findIndex(
      (item) =>
        item.id === newItem.id &&
        item.selectedSize === newItem.selectedSize &&
        item.selectedColor === newItem.selectedColor
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push(newItem);
      localStorage.setItem('cart', JSON.stringify(cart));
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    setAdded(true);
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
