'use client';
import { useEffect, useState , useRef} from "react";
import Link from "next/link";
import {TrashIcon,} from "@heroicons/react/24/solid";

import { useStore } from '../../context/StoreContext';

export default function Cart() {

const isFirstLoad = useRef(true);



const { cart } = useStore();
const { clearCart } = useStore();

const { removeItemCompletely } = useStore();
const { increaseQuantity } = useStore();
const { decreaseQuantity } = useStore();

const subTotalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
const totalPrice = subTotalPrice + 20;



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
            
                    
                    {cart.length > 0 ? (
                      cart.map((item) => (
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
                            <button className="px-2 border bg-[#e08325] rounded cursor-pointer"  onClick={() => decreaseQuantity(item)}>-</button>
                            <span>{item.quantity}</span>
                            <button className="px-2 border bg-[#e08325] rounded cursor-pointer"  onClick={() => increaseQuantity(item)}>+</button>
                          </div>
                          <div className="p-4 md:p-0">${item.price.toFixed(2)} each</div>
                          <div className="text-[#e08325] cursor-pointer w-5 h-5"  onClick={() => removeItemCompletely(item)}><TrashIcon/></div>
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
                      <div href="/" className="flex-1 py-2 bg-[#1b1403]  rounded cursor-pointer flex justify-center items-center">
                        <button onClick={clearCart} className="py-2 text-[#f8e2d2] cursor-pointer">
                          Clear Cart
                        </button>
                      </div>
                      <Link href="/user/Checkout" className="flex-1 py-2 bg-[#e08325] rounded cursor-pointer flex justify-center items-center">
                        <button className="py-2 text-[#f8e2d2] cursor-pointer">
                          Checkout
                        </button>
                      </Link>
                    </div>
              </div>
  
  );
}
