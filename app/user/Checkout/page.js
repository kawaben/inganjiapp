'use client';
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';


export default function Checkout() {

    const router = useRouter();
  
    const [cartItems, setCartItems] = useState([
            { id: 1, name: "Tshirt",size:"xxl", price: 15.0, quantity: 2 },
            { id: 2, name: "Beanie",size:"l", price: 15.0, quantity: 3 },
            { id: 3, name: "Glasses",size:"m", price: 15.0, quantity: 1 },
          ]);
          
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
        setCartItems(JSON.parse(storedCart));
        }
    }, []);

    const subTotalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalPrice = (subTotalPrice + 20);

    const handlePlaceOrder = () => {
  const orderId = 'TXN' + Date.now(); // Simple ID generator
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  if (cart.length === 0) {
    alert('Cart is empty!');
    return;
  }

  const order = {
    id: orderId,
    items: cart,
    date: new Date().toISOString(),
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 20, // + shipping
    status: 'Processing',
  };

  // Save order to localStorage (append to existing orders)
  const existingOrders = JSON.parse(localStorage.getItem('orders')) || [];
  existingOrders.push(order);
  localStorage.setItem('orders', JSON.stringify(existingOrders));

  // Clear cart
  localStorage.removeItem('cart');
  setCartItems([]); // Also clear state

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
                <h3 className="text-xl font-semibold mb-4">Your order</h3>
                {cartItems.length > 0 ? (
                cartItems.map((item) => (
                    <ul key={item.id} className="space-y-2">
                    <li className="flex justify-between">
                        <span>{item.name} × {item.quantity}</span>
                        <span>${item.price.toFixed(2)*item.quantity}</span>
                    </li>
                
                    </ul>

                ))
                )
                : (
                    <p className="text-gray-500">Your Cart is empty.</p>
                )
                }


                <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subTotalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Flat rate: $20.00</span>
                </div>
                <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${totalPrice}</span>
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

                <button className="w-full bg-[#e08325] cursor-pointer text-white py-3 rounded-lg mt-6 font-semibold" onClick={handlePlaceOrder}>
                Place order
                </button>

                <div className="mt-4 flex justify-center gap-3">
                <img src="../images/visa.svg" alt="Visa" className="h-6" />
                <img src="../images/paypal.svg" alt="PayPal" className="h-6" />
                <img src="../images/mastercard.svg" alt="MasterCard" className="h-6" />
                </div>
            </div>
        </div>
    </div>

  );
}
