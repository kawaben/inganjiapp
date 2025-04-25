'use client';
import { useEffect, useState } from "react";
import {TrashIcon,} from "@heroicons/react/24/solid";


export default function Cart() {
    const [activeSection, setActiveSection] = useState(false);
    const [cartItems, setCartItems] = useState([
        { id: 1, name: "Tshirt",size:"xxl", price: 15.0, quantity: 2 },
        { id: 2, name: "Beanie",size:"l", price: 15.0, quantity: 3 },
        { id: 3, name: "Glasses",size:"m", price: 15.0, quantity: 1 },
      ]);
    
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
      const subTotalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
      const totalPrice = (subTotalPrice + 20);
    
  
  



  return (
   
<div className="max-w-4xl text-[#1b1403] rounded-lg shadow gap-5">
                    <h1 className="text-2xl font-bold text-center mb-6">My Shopping Cart</h1>
            
                    {/* Cart Items */}
                    <div className="grid grid-cols-6 gap-4 items-center font-semibold text-[#1b1403] p-2 bg-[#f8e2d2] rounded-lg">
                      <div className="col-span-2">Product</div>
                      <div>Size</div>
                      <div>Quantity</div>
                      <div>Price</div>
                      <div></div>
                    </div>
            
                    
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <div key={item.id} className="grid grid-cols-6 gap-4 items-center py-2 shadow text-sm md:text-base lg:text-lg font-medium tracking-wide">
                          <div className="col-span-2 flex items-center gap-4">
                            <img
                              src={`/images/m2.jpg`} 
                              alt="Product"
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-400">Product ID: {item.id}</div>
                            </div>
                          </div>
                          <div>{item.size}</div>
                          <div className="flex items-center gap-2">
                            <button className="px-2 border bg-[#e08325] rounded cursor-pointer"  onClick={() => updateQuantity(item.id, -1)}>-</button>
                            <span>{item.quantity}</span>
                            <button className="px-2 border bg-[#e08325] rounded cursor-pointer"  onClick={() => updateQuantity(item.id, 1)}>+</button>
                          </div>
                          <div className="p-4 md:p-0">${item.price.toFixed(2)} each</div>
                          <div className="text-[#e08325] cursor-pointer w-5 h-5"  onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            removeItem(item.id);
                          }}><TrashIcon/></div>
                        </div>
                      ))
                    )
                    : (
                      <p className="text-gray-500">Your Cart is empty.</p>
                    )
                    }
            
                    {/* Totals */}
                    <div className="grid grid-cols-2 mt-6 gap-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Discount</span>
                          <span>$0.00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Delivery</span>
                          <span>$20.00</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal</span>
                          <span>${subTotalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>${totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
            
                    {/* Promo Code */}
                    <div className="mt-6">
                      <input
                        type="text"
                        placeholder="Please enter promo code"
                        className="w-100% p-2 border rounded text-sm mb-2"
                      />
                      <button className="float-right text-sm bg-[#e08325] cursor-pointer text-[#f8e2d2] px-4 py-2 rounded">
                        Apply Discount
                      </button>
                    </div>
            
                    {/* Bottom Buttons */}
                    <div className="mt-10 flex justify-between gap-4">
                      <button className="flex-1 py-2 bg-[#1b1403] text-[#f8e2d2] rounded cursor-pointer">
                        Back to Shop
                      </button>
                      <button className="flex-1 py-2 bg-[#e08325] text-[#f8e2d2] rounded cursor-pointer" onClick={() => setActiveSection("Checkout")}>
                        Checkout
                      </button>
                    </div>
              </div>
  
  );
}
