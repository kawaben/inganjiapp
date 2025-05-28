'use client';

import { TrashIcon } from "@heroicons/react/24/solid";
import { useStore } from '../context/StoreContext';
import "../globals.css";

export default function CartPanel() {

  const {
    cart,
    handleClearCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useStore();

  

  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div className="fixed overflow-y-auto bottom-16 top-16 right-0 w-full md:w-1/3 h-screen bg-[#f8e2d2] shadow-lg transition-transform duration-300 panel p-5 z-10">
      <div className="overflow-y-auto flex-grow space-y-4">
        <h2 className="text-lg font-bold uppercase text-black mb-4">Your Cart</h2>
        <div className="space-y-4">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div
                key={`${item.id}-${item.color}-${item.size}-${item.userEmail}`}
                className="flex items-center justify-between bg-white p-3 rounded shadow-sm"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-600">${Number(item.price || 0).toFixed(2)} each</p>
                  <p className="text-xs text-gray-500 capitalize">Color: {item.color}, Size: {item.size}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={() => decreaseQuantity(item)} className="bg-[#e08325] text-[#0c0805] px-2 py-1 rounded">-</button>
                  <span className="px-3">{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item)} className="bg-[#e08325] text-[#0c0805] px-2 py-1 rounded">+</button>
                  <button onClick={() => removeFromCart(item)} className="bg-[#e08325] p-2 rounded">
                    <TrashIcon className="w-5 h-5 text-[#0c0805]" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Your Cart is empty.</p>
          )}
        </div>

        <h3 className="mt-6 text-lg font-bold">Total: ${Number(totalPrice || 0).toFixed(2)}</h3>

        {cart.length > 0 && (
          <button
            onClick={handleClearCart}
            className="mt-4 bg-[#e08325] text-[#f8e2d2] hover:bg-[#0c0805] p-2 w-full rounded-md"
          >
            Clear All
          </button>
        )}

        <button className="mt-4 w-full bg-[#0c0805] text-[#f8e2d2] hover:bg-[#e08325] p-3 rounded-md">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
