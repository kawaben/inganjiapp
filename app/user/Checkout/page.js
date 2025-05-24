'use client';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useStore } from '../../context/StoreContext';
import {  addOrder, updateStockForOrder, clearCart } from '../../lib/db';


export default function Checkout() {

  const router = useRouter();
  const { handleClearCart,cart } = useStore();

  

  
 const subTotalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalPrice = subTotalPrice + 20;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    const orderId = 'TXN' + Date.now();
    const shippingCost = 20;
    const totalAmount = subTotalPrice + shippingCost;

    const newOrder = {
      id: orderId,
      items: cart,
      date: new Date().toISOString(),
      total: totalAmount,
      status: 'Processing',
    };

    await addOrder(newOrder);
    await updateStockForOrder(cart);
    await clearCart();
    handleClearCart();

    router.push('/user/orders');
  };

  return (
   
    <div className="pt-23 p-6">
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
  <h3 className="text-xl font-semibold mb-4">Your Order</h3>

  {cart.length > 0 ? (
    <ul className="divide-y divide-gray-200 mb-4">
      {cart.map((item, index) => (
        <li key={`${item.id}-${item.color}-${item.size}-${index}`} className="py-2 flex justify-between text-sm">
          <div>
            <span className="font-medium">{item.name}</span>{' '}
            <span className="text-gray-500">× {item.quantity}</span>
            <div className="text-gray-400 text-xs">
              {item.color && <span>Color: {item.color}</span>}
              {item.size && <span className="ml-2">Size: {item.size}</span>}
            </div>
          </div>
          <div className="font-semibold">
            ${(item.price * item.quantity).toFixed(2)}
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500">Your Cart is empty.</p>
  )}

  {/* Totals */}
  <div className="border-t mt-4 pt-4 space-y-2 text-sm">
    <div className="flex justify-between">
      <span>Subtotal</span>
      <span>${subTotalPrice.toFixed(2)}</span>
    </div>
    <div className="flex justify-between">
      <span>Shipping</span>
      <span>Flat rate: $20.00</span>
    </div>
    <div className="flex justify-between font-semibold text-base">
      <span>Total</span>
      <span>${totalPrice.toFixed(2)}</span>
    </div>
  </div>

  {/* Payment Options */}
  <div className="mt-6 space-y-3 text-sm">
    <div>
      <input type="radio" id="bank" name="payment" className="mr-2" />
      <label htmlFor="bank">Direct bank transfer</label>
    </div>
    <div>
      <input type="radio" id="check" name="payment" className="mr-2" />
      <label htmlFor="check">Check payments</label>
    </div>
  </div>

  {/* Terms */}
  <div className="mt-4 text-sm">
    <input type="checkbox" id="terms" className="mr-2" />
    <label htmlFor="terms">
      I have read and agree to the website{' '}
      <a href="#" className="text-blue-600 underline">
        terms and conditions
      </a>
    </label>
  </div>

  {/* Place Order Button */}
  <button
    className="w-full bg-[#e08325] text-white py-3 rounded-lg mt-6 font-semibold hover:bg-[#c96e1d] transition"
    onClick={handlePlaceOrder}
  >
    Place order
  </button>

  {/* Payment Logos */}
  <div className="mt-4 flex justify-center gap-3">
    <img src="/images/visa.svg" alt="Visa" className="h-6" />
    <img src="/images/paypal.svg" alt="PayPal" className="h-6" />
    <img src="/images/mastercard.svg" alt="MasterCard" className="h-6" />
  </div>
</div>

        </div>
    </div>

  );
}
