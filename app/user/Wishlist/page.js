'use client';
import { useState, useEffect } from "react";
import Image from "next/image";
import { FaSearch, FaBell, FaHeart, FaShoppingCart, FaUser } from 'react-icons/fa';

  export default function Wishlist() {
  
    const [wishlistItems, setWishlistItems] = useState([
            { id: 1, name: "King of Club" ,image: '/images/m1-blue.jpg',price: 25.99,},
            { id: 2, name: "Pen on Tee",image: '/images/f1-red.png',price: 25.99, },
            { id: 3, name: "Queen of Club",image: '/images/f1-blue.jpg',price: 25.99, },
          ]);


  return (
   
    <div className="max-w-4xl text-[#1b1403] rounded-lg shadow gap-5">
          <h1 className="text-2xl font-bold text-center mb-6">My Wishlist</h1>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-9 p-4" >
            <h2 className="p-3">Find Your Saved Items And Get Ready To Order Them</h2>
            <input type="text" placeholder="What Are You Looking For ?" className="p-3 border border-[#e08325] rounded-md  text-[#1b1403] placeholder-gray-700"/>
          </div>
          
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4">
                {wishlistItems.length > 0 ? (
                          wishlistItems.map((item) => (   
                      <div key={item.id} className="p-4 rounded-lg shadow-lg cursor-pointer bg-red-100 transition">
                        <div className={`flex items-center justify-center rounded-lg`}>
                          <Image src={item.image} alt="image" layout="responsive" width={1200} height={675} className="object-contain rounded" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">{item.name}</h3>
                        <p className="text-gray-700">$ {item.price}</p>
                        <div className="grid grid-cols-2">
                          <button><FaHeart className="w-6 h-6 text-[#e08325] hover:text-[#1b1403] cursor-pointer"/></button>
                          <button className="flex-1 py-2 bg-[#e08325] hover:bg-[#1b1403] text-[#f8e2d2] rounded cursor-pointer">Buy</button>
                        </div>
                      </div>
                ))
                ) : (
                  <p className="text-gray-500">No Wishlist Yet.</p>
                )}

            </div>
          </div>
          {wishlistItems.length > 0 && (
                  <button
                    onClick={() => {setWishlistItems([]);}}
                    className="mt-4 bg-[#e08325] text-[#f8e2d2] p-2 w-full rounded-md"
                  >
                    Clear All
                  </button>
                )}
    </div>
  
  );
}
