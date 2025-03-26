"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  BellIcon,
  HeartIcon,
  ShoppingBagIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import "../globals.css";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(null);

  const handleIconClick = (panelName) => {
    setActivePanel(activePanel === panelName ? null : panelName);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".panel") && !event.target.closest(".icon")) {
        setActivePanel(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);


  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Tshirt", price: 15.0, quantity: 2 },
    { id: 2, name: "Beanie", price: 15.0, quantity: 3 },
    { id: 3, name: "Glasses", price: 15.0, quantity: 1 },
  ]);

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const updateQuantity = (id, amount) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    
    // Prevent the cart from closing
    setTimeout(() => setActivePanel("cart"), 0);
  };
  
  



  return (
    <nav className="fixed w-full p-3 z-50 bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.svg" alt="NOUVI RE Logo" width={120} height={40} priority />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center space-x-12">
          <Link href="/men">MEN</Link>
          <Link href="/accessories">ACCESSORIES</Link>
          <Link href="/women">WOMEN</Link>
          <Link href="/kids">KIDS</Link>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-6">
          <button onClick={() => handleIconClick("search")} className="icon">
            <MagnifyingGlassIcon className="w-6 h-6 hover:text-[#e08325]" />
          </button>
          <button onClick={() => handleIconClick("notifications")} className="icon">
            <BellIcon className="w-6 h-6 hover:text-[#e08325]" />
          </button>
          <button onClick={() => handleIconClick("wishlist")} className="icon">
            <HeartIcon className="w-6 h-6 hover:text-[#e08325]" />
          </button>
          <button onClick={() => handleIconClick("cart")} className="icon">
            <ShoppingBagIcon className="w-6 h-6 hover:text-[#e08325]" />
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 hover:text-[#e08325]"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden transition-all duration-300 bg-white p-4">
          <Link href="/men" className="block py-2">MEN</Link>
          <Link href="/accessories" className="block py-2">ACCESSORIES</Link>
          <Link href="/women" className="block py-2">WOMEN</Link>
          <Link href="/kids" className="block py-2">KIDS</Link>
        </div>
      )}

      {/* Panels */}
      {activePanel && (
        <div className={`fixed top-16 right-0 w-full md:w-1/3 h-screen bg-[#F4C198] shadow-lg transition-transform duration-300 panel p-5 z-10 ${activePanel ? "translate-x-0" : "translate-x-full"}`}>
          <button className="text-gray-500 float-right" onClick={() => setActivePanel(null)}>✕</button>

          {/* Search Panel */}
          {activePanel === "search" && (
            <>
              <h2 className="text-lg font-bold uppercase text-black mb-4">Search</h2>
              <input
                type="text"
                placeholder="What Are You Looking For?"
                className="w-full p-3 border-none rounded-md bg-[#3a3a3a] text-white placeholder-gray-300"
              />
              <h3 className="text-sm mt-6 text-gray-700 font-semibold">Suggestions</h3>
              <ul className="mt-2 space-y-2 text-gray-800">
                {["Tshirt", "Shoes", "Jacket", "Hat", "Underwear", "Glasses"].map((item) => (
                  <li key={item} className="hover:text-orange-500 cursor-pointer">
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Notifications Panel */}
          {activePanel === "notifications" && (
            <>
              <h2 className="text-lg font-bold uppercase text-black mb-4">Notifications</h2>
              <ul className="space-y-4">
                <li className="p-3 bg-white rounded shadow-sm">🔥 New Sale on Shoes!</li>
                <li className="p-3 bg-white rounded shadow-sm">📢 Your order is out for delivery!</li>
                <li className="p-3 bg-white rounded shadow-sm">🎉 New products added to Accessories</li>
              </ul>
            </>
          )}

          {/* Wishlist Panel */}
          {activePanel === "wishlist" && (
            <>
              <h2 className="text-lg font-bold uppercase text-black mb-4">Your Wishlist ❤️</h2>
              <ul className="space-y-4">
                <li className="p-3 bg-white rounded shadow-sm flex justify-between">
                  Black T-Shirt <button className="text-red-500">✕</button>
                </li>
                <li className="p-3 bg-white rounded shadow-sm flex justify-between">
                  Nike Sneakers <button className="text-red-500">✕</button>
                </li>
                <li className="p-3 bg-white rounded shadow-sm flex justify-between">
                  Leather Jacket <button className="text-red-500">✕</button>
                </li>
              </ul>
            </>
          )}

        {/* Shopping Cart Panel */}
          {activePanel === "cart" && (
            <>
              <h2 className="text-lg font-bold uppercase text-black mb-4">Your Cart</h2>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded shadow-sm">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => updateQuantity(item.id, -1)} className="bg-[#e08325] text-[#0c0805] px-2 py-1 rounded">-</button>
                      <span className="px-3">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="bg-[#e08325] text-[#0c0805] px-2 py-1 rounded">+</button>
                      <button 
                              onClick={(e) => {
                                e.stopPropagation();  // Prevent event from bubbling up
                                e.preventDefault();   // Ensure no unintended behavior
                                removeItem(item.id);
                              }}
                              className="bg-[#e08325]  p-2 rounded"
                            >
                              <TrashIcon className="w-5 h-5 text-[#0c0805]" />
                            </button>

                    </div>
                  </div>
                ))}
              </div>
              <h3 className="mt-6 text-lg font-bold">Total: ${totalPrice.toFixed(2)}</h3>
              <button className="mt-4 w-full bg-black text-white p-3 rounded-md">
                Proceed to Checkout
              </button>
            </>
          )}

        </div>
      )}
    </nav>
  );
}
