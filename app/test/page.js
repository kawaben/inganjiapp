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

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 ">
      <div className="max-w-4xl mx-auto bg-gray-50 text-[#1b1403] p-20 rounded-lg shadow border mt-30 gap-5">
        <h1 className="text-2xl font-bold text-center mb-6">My Shopping Cart</h1>

        {/* Cart Items */}
        <div className="grid grid-cols-6 gap-4 items-center font-semibold text-[#1b1403] p-2 bg-[#f8e2d2] rounded-lg">
          <div className="col-span-2">Product</div>
          <div>Size</div>
          <div>Quantity</div>
          <div>Price</div>
          <div></div>
        </div>

        {/* You can loop through this with map later */}
        {[1, 2, 3].map((item, idx) => (
          <div key={idx} className="grid grid-cols-6 gap-6 items-center py-4 shadow">
            <div className="col-span-2 flex items-center gap-4">
              <img
                src={`/images/m2.jpg`} // replace with your image paths
                alt="Product"
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <div className="font-medium">Product Name</div>
                <div className="text-sm text-gray-400">Product ID: 12345678</div>
              </div>
            </div>
            <div>L</div>
            <div className="flex items-center gap-2">
              <button className="px-2 border bg-[#e08325] rounded cursor-pointer">-</button>
              <span>02</span>
              <button className="px-2 border bg-[#e08325] rounded cursor-pointer">+</button>
            </div>
            <div className="font-semibold">$50.00</div>
            <div className="text-[#e08325] cursor-pointer w-5 h-5"><TrashIcon/></div>
          </div>
        ))}

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
              <span>$260.00</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>$280.00</span>
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
          <button className="flex-1 py-2 bg-[#e08325] text-[#f8e2d2] rounded cursor-pointer">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
