'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {  addOrder, updateStockForOrder, clearCart } from '../../lib/db';
import { useUser } from '../../context/UserContext';


export default function Checkout() {

  const router = useRouter();
  const { handleClearCart,cart } = useStore();
  const { user } = useUser();

  
 const subTotalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalPrice = subTotalPrice + 20;

   const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    companyname: '',
    shipingAddress: '',
    housenumber:'',
    location:'',
    country: '',
    zipcode: '',
    email: '',
    note: '',
    payment: '',
  });

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
    userEmail:formData.email || user?.email,
    image: user?.image || '/logo.svg',
    name: formData.firstname ||user?.firstname && user?.lastname
        ? `${user.firstname} ${user.lastname}`
        : 'Unknown User',
    shipingAddress: formData.shipingAddress ||user?.location ,
    country: formData.country || user?.country,
    phone: formData.phone || user?.phone ,
    payment: formData.payment,
    housenumber: formData.housenumber,
    location: formData.location,
    country: formData.country,
    zipcode: formData.zipcode,
    note: formData.note,
  };

  await addOrder(newOrder);
  await updateStockForOrder(cart);
  await clearCart();
  handleClearCart();

  setFormData({
    firstname: '',
    lastname: '',
    companyname: '',
    shipingAddress: '',
    housenumber:'',
    location:'',
    country: '',
    zipcode: '',
    email: '',
    note: '',
    payment: '',
  });

  router.push('/user/orders');
};


  return (
   
    <div className="pt-23 p-6">
        <h2 className="text-2xl font-semibold mb-8">Checkout</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Billing Details */}
            <div className="lg:col-span-2">
                <form  className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="First name" value={formData.firstname}
                      onChange={e => setFormData({ ...formData, firstname: e.target.value })}
                      required className="input" />
                      
                    <input type="text" placeholder="Last name" value={formData.lastname}
                      onChange={e => setFormData({ ...formData, lastname: e.target.value })}
                      required className="input" />
                </div>
                <input type="text" placeholder="Company name (optional)" value={formData.companyname}
                      onChange={e => setFormData({ ...formData, companyname: e.target.value })}
                      required className="input" />

                <input type="text" placeholder="Street address" value={formData.shipingAddress}
                      onChange={e => setFormData({ ...formData, shipingAddress: e.target.value })}
                      required className="input" />

                <input type="text" placeholder="Apartment, suite, etc. (optional)" value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      required className="input" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input type="text" placeholder="Town / City" value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                        required className="input" />

                    <input type="text" placeholder="State" value={formData.country}
                        onChange={e => setFormData({ ...formData, country: e.target.value })}
                        required className="input" />

                    <input type="text" placeholder="ZIP Code (optional)" value={formData.zipcode}
                        onChange={e => setFormData({ ...formData, zipcode: e.target.value })}
                        required className="input" />
                </div>

                <input type="text" placeholder="Phone" value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      required className="input" />

                <input type="email" placeholder="Email address" value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      required className="input" />

                <div className="flex items-center space-x-2">
                    <input type="checkbox" id="create-account" />
                    <label htmlFor="create-account">Create an account?</label>
                </div>

                <textarea placeholder="Order notes (optional)" value={formData.note}
                      onChange={e => setFormData({ ...formData, note: e.target.value })}
                      required className="input h-24" />
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
                  <input type="radio" id="bank"  name="payment" value={formData.payment}
                      onChange={e => setFormData({ ...formData, payment:'Bank Transfer' })}
                      required className="mr-2" />
                  <label htmlFor="bank">Direct bank transfer</label>
                </div>

                <div>
                  <input type="radio" id="check" name="payment" value={formData.payment}
                      onChange={e => setFormData({ ...formData, payment:'Check' })}
                      required className="mr-2" />
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
