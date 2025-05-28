'use client';

import Link from "next/link";
import Image from 'next/image';
import { TrashIcon } from "@heroicons/react/24/solid";
import { useStore } from '../../context/StoreContext';


export default function Cart() {
  
  
  const {
    cart,
    handleClearCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useStore();





  const subTotalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalPrice = subTotalPrice + 20;

  return (
    <div className="max-w-4xl text-[#1b1403] rounded-lg shadow gap-5">
      <h1 className="text-2xl font-bold text-center mb-6">My Shopping Cart</h1>

      {/* Header */}
      <div className="grid grid-cols-6 gap-4 items-center font-semibold text-[#1b1403] p-2 bg-[#f8e2d2] rounded-lg">
        <div className="col-span-2">Product</div>
        <div>Size</div>
        <div>Quantity</div>
        <div>Price</div>
        <div></div>
      </div>

      {/* Cart Items */}
     {cart.length > 0 ? (
      cart.map((item, index) => {
        const fallbackImage = '/images/f1-blue.jpg';

        // Use item.image directly (set during addToCart), or fallback
        const imageSrc = item.image || fallbackImage;

    return (
      <div
        key={`${item.id}-${item.color}-${item.size}-${index}-${item.userEmail}`}
        className="grid grid-cols-6 gap-4 items-center py-2 shadow text-sm md:text-base lg:text-lg font-medium tracking-wide"
      >
        {/* Image & Details */}
        <div className="col-span-2 flex items-center gap-4">
          <div className="w-20 h-20 relative">
            <Image
              src={imageSrc}
              alt={item.name}
              fill
              className="object-contain rounded"
            />
          </div>
          <div>
            <div className="font-medium">{item.name}</div>
            <div className="text-sm text-gray-400">ID: {item.id}</div>
          </div>
        </div>

        {/* Size */}
        <div>{item.size || 'N/A'}</div>

        {/* Quantity */}
        <div className="flex items-center gap-2">
          <button
            className="px-2 border bg-[#e08325] rounded cursor-pointer"
            onClick={() => decreaseQuantity(item)}
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            className="px-2 border bg-[#e08325] rounded cursor-pointer"
            onClick={() => increaseQuantity(item)}
          >
            +
          </button>
        </div>

        {/* Price */}
        <div className="p-4 md:p-0">
          ${item.price?.toFixed(2) || '0.00'} each
        </div>

        {/* Remove */}
        <div
          className="text-[#e08325] cursor-pointer w-5 h-5"
          onClick={() => removeFromCart(item)}
        >
          <TrashIcon />
        </div>
      </div>
    );
  })
      ) : (
        <p className="text-gray-500 mt-4">Your Cart is empty.</p>
      )}


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
          className="w-full p-2 border rounded text-sm mb-2"
        />
        <button className="float-right text-sm bg-[#e08325] text-[#f8e2d2] px-4 py-2 rounded">
          Apply Discount
        </button>
      </div>

      {/* Actions */}
      <div className="mt-10 flex justify-between gap-4">
        <button
          onClick={handleClearCart}
          className="flex-1 py-2 bg-[#1b1403] text-[#f8e2d2] rounded cursor-pointer"
        >
          Clear Cart
        </button>
        <Link
          href="/user/Checkout"
          className="flex-1 py-2 bg-[#e08325] text-[#f8e2d2] rounded cursor-pointer text-center"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}
