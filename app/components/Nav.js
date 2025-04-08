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
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const allSuggestions = ["Tshirt", "Shoes", "Jacket", "Hat", "Underwear", "Glasses"];

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

  const [wishlistItems, setWishlistItems] = useState([
    { id: 1, name: "Black T-Shirt" },
    { id: 2, name: "Nike Sneakers" },
    { id: 3, name: "Leather Jacket" },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: "🔥 New Sale on Shoes!" },
    { id: 2, message: "📢 Your order is out for delivery!" },
    { id: 3, message: "🎉 New products added to Accessories" },
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
  
  
  const removeFromWishlist = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
     // Prevent the wishlist from closing
     setTimeout(() => setActivePanel("wishlist"), 0);
  };
  
  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
     // Prevent the notification from closing
     setTimeout(() => setActivePanel("notifications"), 0);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  
    if (query.length > 0) {
      const filtered = allSuggestions.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };
  // searcbar suggestion 
  
  const handleSuggestionClick = (suggestion, event) => {
    setSearchQuery(suggestion);
    setFilteredSuggestions([]); // Hide the suggestions after selection
    setTimeout(() => setActivePanel("search"), 0);// Prevent closing the panel
  };
  
  
  return (
    <nav className="">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.svg" alt="NOUVI RE Logo" width={120} height={40} priority />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center space-x-12">
          <Link href="/shop/men">MEN</Link>{' '}
          <Link href="/shop/accessories">ACCESSORIES</Link>
          <Link href="/shop/women">WOMEN</Link>
          <Link href="/shop/kids">KIDS</Link>
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
        <div className="md:hidden transition-all duration-300  p-4">
          <Link href="/shop/men" className="block py-2">MEN</Link>
          <Link href="/shop/accessories" className="block py-2">ACCESSORIES</Link>
          <Link href="/shop/women" className="block py-2">WOMEN</Link>
          <Link href="/shop/kids" className="block py-2">KIDS</Link>
        </div>
      )}

      {/* Panels */}
      {activePanel && (
        <div className={`fixed top-16 right-0 w-full md:w-1/3 h-screen bg-[#f8e2d2] shadow-lg transition-transform duration-300 panel p-5 z-10 ${activePanel ? "translate-x-0" : "translate-x-full"}`}>
          <button className="text-gray-500 float-right" onClick={() => setActivePanel(null)}>✕</button>

          {/* Search Panel */}
            {activePanel === "search" && (
            <>
              <h2 className="text-lg font-bold uppercase text-black mb-4">Search</h2>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="What Are You Looking For?"
                className="w-full p-3 border-none rounded-md bg-[#3a3a3a] text-[#f8e2d2] placeholder-gray-300"
              />
              {filteredSuggestions.length > 0 && (
                <ul className="mt-2 bg-white shadow-md rounded-md max-h-40 overflow-y-auto">
                  {filteredSuggestions.map((item) => (
                    <li
                      key={item}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={(e) => handleSuggestionClick(item, e)}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilteredSuggestions([]);
                    setTimeout(() => setActivePanel("search"), 0);
                  }}
                  className="mt-3 bg-[#e08325] text-[#f8e2d2] p-2 w-full rounded-md"
                >
                  Clear All
                </button>
              )}
            </>
          )}



          {/* Notifications Panel */}
          {activePanel === "notifications" && (
            <>
              <h2 className="text-lg font-bold uppercase text-black mb-4">Notifications 🔔</h2>
              <ul className="space-y-4">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <li key={notification.id} className="p-3 bg-white rounded shadow-sm flex justify-between">
                      {notification.message}
                      <button onClick={() => dismissNotification(notification.id)} className="text-[#e08325]">
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-500">No new notifications.</p>
                )}
              </ul>
              {notifications.length > 0 && (
                <button
                  onClick={() => {setNotifications([]);setTimeout(() => setActivePanel("notifications"), 0);}}
                  
                  className="mt-4 bg-[#e08325] text-[#f8e2d2] p-2 w-full rounded-md"
                >
                  Clear All
                </button>
              )}
            </>
          )}



          {/* Wishlist Panel */}
          {activePanel === "wishlist" && (
              <>
                <h2 className="text-lg font-bold uppercase text-black mb-4">Your Wishlist ❤️</h2>
                <ul className="space-y-4">
                  {wishlistItems.length > 0 ? (
                    wishlistItems.map((item) => (
                      <li key={item.id} className="p-3 bg-white rounded shadow-sm flex justify-between">
                        {item.name}
                        <button onClick={() => removeFromWishlist(item.id)} className="text-[#e08325]">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </li>
                    ))
                  ) : (
                    <p className="text-gray-500">Your wishlist is empty.</p>
                  )}
                </ul>
                {wishlistItems.length > 0 && (
                  <button
                    onClick={() => {setWishlistItems([]);setTimeout(() => setActivePanel("wishlist"), 0);}}
                    className="mt-4 bg-[#e08325] text-[#f8e2d2] p-2 w-full rounded-md"
                  >
                    Clear All
                  </button>
                )}
              </>
            )}


        {/* Shopping Cart Panel */}
        {activePanel === "cart" && (
              <>
                <h2 className="text-lg font-bold uppercase text-black mb-4">Your Cart</h2>
                <div className="space-y-4">
                {wishlistItems.length > 0 ? (
                  cartItems.map((item) => (
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
                            e.stopPropagation();
                            e.preventDefault();
                            removeItem(item.id);setTimeout(() => setActivePanel("cart"), 0);
                          }}
                          className="bg-[#e08325]  p-2 rounded"
                        >
                          <TrashIcon className="w-5 h-5 text-[#0c0805]" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">Your Cart is empty.</p>
                )
                }
                </div>
                <h3 className="mt-6 text-lg font-bold">Total: ${totalPrice.toFixed(2)}</h3>
                {cartItems.length > 0 && (
                  <button
                    onClick={() => {setCartItems([]);setTimeout(() => setActivePanel("cart"), 0);}}
                    className="mt-4 bg-[#e08325] text-[#f8e2d2] p-2 w-full rounded-md"
                  >
                    Clear All
                  </button>
                )}
                <button className="mt-4 w-full bg-[#0c0805] text-[#f8e2d2] p-3 rounded-md">
                  Proceed to Checkout
                </button>
              </>
            )}

        </div>
      )}
    </nav>
  );
}
