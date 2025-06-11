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
    <div className={`fixed top-28 right-0 h-3/4 rounded-md w-full  md:w-1/3 md:right-1  bg-[var(--background)] shadow-lg transition-transform duration-300 panel p-5 z-10  "translate-x-0" : "translate-x-full"`}>
      <div className="overflow-y-auto flex-grow space-y-4">
        <h2 className="text-lg font-bold uppercase text-[var(--text)] mb-4">Your Cart</h2>
        <div className="space-y-4">
          {cart.length > 0 ? (
            cart.map((item) => {
  const colorHex = typeof item.color === "object" ? Object.keys(item.color)[0] : item.color;

  return (
    <div
      key={`${item.id}-${colorHex}-${item.size}-${item.userEmail}`}
      className="flex items-center justify-between bg-[var(--background2)] p-3 rounded shadow-sm"
    >
      <div>
        <p className="font-semibold">{item.name}</p>
        <p className="text-sm text-[var(--secondary)]">${Number(item.price || 0).toFixed(2)} each</p>
        <p className="text-xs text-[var(--secondary)] capitalize">
          Color: {colorHex}, Size: {item.size}
        </p>
      </div>

                <div className="flex items-center space-x-2">
                  <button onClick={() => decreaseQuantity(item)} className="bg-[var(--primary)] text-[var(--foreground)] px-2 py-1 rounded cursor-pointer">-</button>
                  <span className="px-3">{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item)} className="bg-[var(--primary)] text-[var(--foreground)] px-2 py-1 rounded cursor-pointer">+</button>
                  <button onClick={() => removeFromCart(item)} className="bg-[var(--primary)] p-2 rounded cursor-pointer">
                    <TrashIcon className="w-5 h-5 text-[var(--foreground)]" />
                  </button>
                </div>
              </div>
            );})
          ) : (
            <p className="text-gray-500">Your Cart is empty.</p>
          )}
        </div>

        <h3 className="mt-6 text-lg font-bold">Total: ${Number(totalPrice || 0).toFixed(2)}</h3>

        {cart.length > 0 && (
          <button
            onClick={handleClearCart}
            className="mt-4 bg-[var(--primary)] text-[var(--foreground)] cursor-pointer p-2 w-full rounded-md"
          >
            Clear All
          </button>
        )}

        <button className="mt-4 w-full bg-[var(--secondary)] text-[var(--background)] hover:bg-[#e08325] p-3 rounded-md">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
