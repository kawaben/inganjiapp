"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import '../globals.css';
import { Home, Package, ClipboardList,Settings, LogOut,User,ShoppingCart,Heart,Bell } from 'lucide-react'
import useAuth from "../hooks/useAuth";
import Profile from "./Myprofile/page";
import Cart from "./Cart/page";
import Wishlist from "./Wishlist/page";
import Notifications from "./Notifications/page";
import Setting from "./Settings/page";
import Checkout from "./Checkout/page";
import Orders from "./orders/page";
import { useUser } from '../context/UserContext';

export default function UserPage() {
  const { authenticated, loading } = useAuth();
  const [activeSection, setActiveSection] = useState("My Profile");


  const { user, login, logout } = useUser(); 
 

  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Tshirt",size:"xxl", price: 15.0, quantity: 2 },
    { id: 2, name: "Beanie",size:"l", price: 15.0, quantity: 3 },
    { id: 3, name: "Glasses",size:"m", price: 15.0, quantity: 1 },
  ]);

  function promoteUserToAdmin(email) {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const updatedUsers = users.map(user => {
    if (user.email === email) {
      return { ...user, role: "admin" };
    }
    return user;
  });

  localStorage.setItem("users", JSON.stringify(updatedUsers));
}

  const subTotalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalPrice = (subTotalPrice + 20);

  const router = useRouter();

  useEffect(() => {
    if (!loading && authenticated) {
      const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (storedUser) {
        login(storedUser);
      } else {
        router.push("/");
      }
    }
  }, [loading, authenticated]);
  
  if (loading) return null;
  
  if (!authenticated || !user) {
    return (
      <div className="min-h-screen bg-[#f8e2d2] flex items-center justify-center text-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-xl font-semibold mb-2">You're not logged in</h2>
          <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
          <a
            href="/"
            className="inline-block bg-[#e08325] text-white px-4 py-2 rounded hover:bg-[#c46d1d]"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }
  


  return (
    <div className="min-h-screen  bg-[#f8e2d2] p-2">
      <div className="flex flex-col md:flex-row bg-[#f7eee8] border border-gray-300 rounded shadow mt-30">
            {/* Sidebar */}
            <aside className="w-full md:w-64 rounded p-4 pt-6">
                <ul className="space-y-3">
                <li className={`flex items-center gap-3 px-4 py-2 rounded-md transition cursor-pointer hover:bg-gray-100 ${activeSection === "My Profile" ? "text-[#c9711a] font-semibold" : "text-black"}`} onClick={() => setActiveSection("My Profile")}> <User size={18} /> My Profile</li>
                <li className={`flex items-center gap-3 px-4 py-2 rounded-md transition cursor-pointer hover:bg-gray-100 ${activeSection === "Cart" ? "text-[#c9711a] font-semibold" : "text-black"}`} onClick={() => setActiveSection("Cart")}> <ShoppingCart size={18} />Cart </li>
                <li className={`flex items-center gap-3 px-4 py-2 rounded-md transition cursor-pointer hover:bg-gray-100 ${activeSection === "Notifications" ? "text-[#c9711a] font-semibold" : "text-black"}`} onClick={() => setActiveSection("Notifications")}><Bell size={18} /> Notifications </li>
                <li className={`flex items-center gap-3 px-4 py-2 rounded-md transition cursor-pointer hover:bg-gray-100 ${activeSection === "Wishlist" ? "text-[#c9711a] font-semibold" : "text-black"}`} onClick={() => setActiveSection("Wishlist")}><Heart size={18} /> Wishlist </li>
                <li className={`flex items-center gap-3 px-4 py-2 rounded-md transition cursor-pointer hover:bg-gray-100 ${activeSection === "Setting" ? "text-[#c9711a] font-semibold" : "text-black"}`} onClick={() => setActiveSection("Setting")}><Settings size={18} /> Settings </li>
                <li className={`flex items-center gap-3 px-4 py-2 rounded-md transition cursor-pointer hover:bg-gray-100 ${activeSection === "Orders" ? "text-[#c9711a] font-semibold" : "text-black"}`} onClick={() => setActiveSection("Orders")}><ClipboardList size={18} /> Orders </li>
                <li><button className="flex items-center gap-3 px-4 py-2 rounded-md text-red-600 hover:bg-red-100 transition" onClick={logout}>
                  <LogOut size={18} />
                  Log Out
                  </button></li>
                                </ul>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8">
              
              {activeSection === "My Profile" && (
                  <Profile/>
                )}

              {activeSection === "Cart" && (
                <Cart />
              )}

              {activeSection === "Wishlist" && (
                <Wishlist />
              )}

              {activeSection === "Notifications" && (
                <Notifications />
              )}
              {activeSection === "Setting" && (
                <Setting />
              )}

              {activeSection === "Checkout" && (
                <Checkout />
              )}

              {activeSection === "Orders" && (
                <Orders />
              )}

            </main>
        </div>
    </div>
  );
}
