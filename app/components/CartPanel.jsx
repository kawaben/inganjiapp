"use client";
import { useState, useEffect } from "react";
import {
    TrashIcon,
  } from "@heroicons/react/24/solid";
  
import { useRouter } from "next/navigation";
import "../globals.css";


export default function CartPanel() {

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
        };
          
    return (
        <div className={`fixed top-16 right-0 w-full md:w-1/3 h-screen bg-[#f8e2d2] shadow-lg transition-transform duration-300 panel p-5 z-10 "translate-x-0" : "translate-x-full"`}>
            <h2 className="text-lg font-bold uppercase text-black mb-4">Your Cart</h2>
            <div className="space-y-4">
            {cartItems.length > 0 ? (
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
                        removeItem(item.id);
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
                onClick={() => {setCartItems([]);}}
                className="mt-4 bg-[#e08325] text-[#f8e2d2] p-2 w-full rounded-md"
            >
                Clear All
            </button>
            )}
            <button className="mt-4 w-full bg-[#0c0805] text-[#f8e2d2] p-3 rounded-md">
            Proceed to Checkout
            </button>
      </div>
    );
  }
  