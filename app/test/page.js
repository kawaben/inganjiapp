// pages/cart.js
"use client";
import React from "react";
import {
    MagnifyingGlassIcon,
    BellIcon,
    HeartIcon,
    ShoppingBagIcon,
    TrashIcon,
    UserIcon
  } from "@heroicons/react/24/solid";


export default function CheckoutPage() {
    return (
      <div className="min-h-screen bg-white py-10 px-4 md:px-20">
        <div className="mt-30">
            <h2 className="text-2xl font-semibold mb-8">Checkout</h2>
    
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Billing Details */}
            <div className="lg:col-span-2">
                <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="First name" className="input" />
                    <input type="text" placeholder="Last name" className="input" />
                </div>
                <input type="text" placeholder="Company name (optional)" className="input" />
                <input type="text" placeholder="Street address" className="input" />
                <input type="text" placeholder="Apartment, suite, etc. (optional)" className="input" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Town / City" className="input" />
                    <input type="text" placeholder="State" className="input" />
                    <input type="text" placeholder="ZIP Code" className="input" />
                </div>
                <input type="text" placeholder="Phone" className="input" />
                <input type="email" placeholder="Email address" className="input" />
    
                <div className="flex items-center space-x-2">
                    <input type="checkbox" id="create-account" />
                    <label htmlFor="create-account">Create an account?</label>
                </div>
    
                <textarea placeholder="Order notes (optional)" className="input h-24" />
                </form>
            </div>
    
            {/* Order Summary */}
            <div className="border border-gray-200 p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">Your order</h3>
                <ul className="space-y-2">
                <li className="flex justify-between">
                    <span>Jogging Top × 1</span>
                    <span>$15.00</span>
                </li>
                <li className="flex justify-between">
                    <span>Neo Wear Bottle × 1</span>
                    <span>$10.00</span>
                </li>
                <li className="flex justify-between">
                    <span>Beanie Hat × 1</span>
                    <span>$19.99</span>
                </li>
                </ul>
    
                <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>$44.99</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Flat rate: $4.99</span>
                </div>
                <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>$49.98</span>
                </div>
                </div>
    
                <div className="mt-6 space-y-3">
                <div>
                    <input type="radio" id="bank" name="payment" className="mr-2" />
                    <label htmlFor="bank">Direct bank transfer</label>
                </div>
                <div>
                    <input type="radio" id="check" name="payment" className="mr-2" />
                    <label htmlFor="check">Check payments</label>
                </div>
                </div>
    
                <div className="mt-4">
                <input type="checkbox" id="terms" className="mr-2" />
                <label htmlFor="terms">
                    I have read and agree to the website <a href="#" className="text-blue-600 underline">terms and conditions</a>
                </label>
                </div>
    
                <button className="w-full bg-[#e08325] cursor-pointer text-white py-3 rounded-lg mt-6 font-semibold">
                Place order
                </button>
    
                <div className="mt-4 flex justify-center gap-3">
                <img src="images/visa.svg" alt="Visa" className="h-6" />
                <img src="images/paypal.svg" alt="PayPal" className="h-6" />
                <img src="images/mastercard.svg" alt="MasterCard" className="h-6" />
                </div>
            </div>
            </div>
        </div>
      </div>
    );
  }
  