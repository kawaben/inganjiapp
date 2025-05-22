'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaHeart } from 'react-icons/fa';
import AddToCartButton from '../../components/AddToCartButton';
import { useStore } from '../../context/StoreContext';

export default function Wishlist() {
  const { wishlist, setWishlist, toggleWishlist, clearWishlist } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch('/api/wishlist'); 
        if (!res.ok) throw new Error('Failed to load wishlist');
        const data = await res.json();
        setWishlist(data);
      } catch (err) {
        console.error('Error loading wishlist:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [setWishlist]);

  return (
    <div className="max-w-4xl text-[#1b1403] rounded-lg shadow gap-5">
      <h1 className="text-2xl font-bold text-center mb-6">My Wishlist</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-9 p-4">
        <h2 className="p-3">Find Your Saved Items And Get Ready To Order Them</h2>
        <input
          type="text"
          placeholder="What Are You Looking For?"
          className="p-3 border border-[#e08325] rounded-md text-[#1b1403] placeholder-gray-700"
        />
      </div>

      {loading ? (
        <p className="text-center">Loading your wishlist...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
          {wishlist.length > 0 ? (
            wishlist.map((item) => (
              
              

              <div
                key={item.id}
                className="p-4 rounded-lg shadow-lg cursor-pointer bg-red-100 transition"
              >
                <div className="flex items-center justify-center rounded-lg">
                  <Image
                    src={item.image || Object.values(item.images || {})[0] || '/images/f1-blue.jpg'}
                    alt={item.name}
                    layout="responsive"
                    width={1200}
                    height={675}
                    className="object-contain rounded"
                  />

                </div>
                <h3 className="mt-4 text-lg font-semibold grid grid-cols-2 gap-6">
                  {item.name}
                  <button onClick={() => toggleWishlist(item)}>
                    <FaHeart className="w-6 h-6 text-[#e08325] hover:text-[#1b1403]" />
                  </button>
                </h3>
                <p className="text-gray-700">$ {item.price}</p>
                <div className="grid grid-cols-1 mt-2">
                  <AddToCartButton
                    product={item}
                    selectedColor={item.colors?.[0] || '#FFA500'}
                    selectedSize={item.size || 'M'}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">Your wishlist is empty.</p>
          )}
        </div>
      )}

      {!loading && wishlist.length > 0 && (
        <button
          onClick={clearWishlist}
          className="mt-4 bg-[#e08325] text-[#f8e2d2] p-2 w-full rounded-md"
        >
          Clear All
        </button>
      )}
    </div>
  );
}
