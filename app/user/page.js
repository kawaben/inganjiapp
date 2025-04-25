"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import '../globals.css';

import useAuth from "../hooks/useAuth";
import Profile from "./Myprofile";
import Cart from "./Cart";
import Wishlist from "./Wishlist";
import Notifications from "./Notifications";
import Settings from "./Settings";
import Checkout from "./Checkout";

export default function UserPage() {
  const { authenticated, loading } = useAuth();
  const [activeSection, setActiveSection] = useState("My Profile");


  const [user, setUser] = useState(null);
 

  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Tshirt",size:"xxl", price: 15.0, quantity: 2 },
    { id: 2, name: "Beanie",size:"l", price: 15.0, quantity: 3 },
    { id: 3, name: "Glasses",size:"m", price: 15.0, quantity: 1 },
  ]);

  const subTotalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalPrice = (subTotalPrice + 20);

  const router = useRouter();

  useEffect(() => {
    if (!loading && authenticated) {
      const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (storedUser) {
        setUser(storedUser);
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
  
  


  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    router.push("/");
  };

  
  



  return (
    <div className="min-h-screen  bg-[#f8e2d2] p-2">
      <div className="flex flex-col md:flex-row bg-[#f7eee8] border border-gray-300 rounded shadow mt-30">
            {/* Sidebar */}
            <aside className="w-full md:w-64 rounded p-4 pt-6">
                <ul className="space-y-3">
                <li className={`cursor-pointer ${activeSection === "My Profile" ? "text-blue-600 font-semibold" : "text-black"}`} onClick={() => setActiveSection("My Profile")}>  My Profile</li>
                <li className={`cursor-pointer ${activeSection === "Cart" ? "text-blue-600 font-semibold" : "text-black"}`} onClick={() => setActiveSection("Cart")}> Cart </li>


                <li className={`cursor-pointer ${activeSection === "Notifications" ? "text-blue-600 font-semibold" : "text-black"}`} onClick={() => setActiveSection("Notifications")}> Notifications </li>
                <li className={`cursor-pointer ${activeSection === "Wishlist" ? "text-blue-600 font-semibold" : "text-black"}`} onClick={() => setActiveSection("Wishlist")}> Wishlist </li>
                <li className={`cursor-pointer ${activeSection === "Settings" ? "text-blue-600 font-semibold" : "text-black"}`} onClick={() => setActiveSection("Settings")}> Settings </li>
                <li><button className="ml-auto text-sm text-[#1b1403] border border-gray-300 bg-[#e08325] rounded p-2 cursor-pointer" onClick={handleLogout}>Log Out</button></li>
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
              {activeSection === "Settings" && (
                <Settings />
              )}

              {activeSection === "Checkout" && (
                <Checkout />
              )}

            </main>
        </div>
    </div>
  );
}
