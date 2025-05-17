"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from '../hooks/useAdminAuth';
import { usePathname } from 'next/navigation'
import { Home, Package, ClipboardList, Users, LogOut } from 'lucide-react'
import Link from 'next/link'
import Dashboard from "./dashboard/page";
import Orders from "./orders/page";
import User from "./users/page";
import Products from "./products/page";


export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const { user, loading } = useAdminAuth();
  const pathname = usePathname()
  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen  bg-[#f8e2d2] p-2">
      <h1 className="text-2xl font-bold mb-2 pt-20">Hi, {user?.name ?? 'Admin'}</h1>
      <div className="flex flex-col md:flex-row bg-[#f7eee8] border border-gray-300 rounded shadow mt-5">
        

        <aside className="w-full  md:w-64 rounded p-4 pt-6 ">
              <h2 className="text-2xl font-bold text-gray-800 mb-8">Admin</h2>
              <div className=" gap-4 ">
                <ul className="space-y-3">
                  <li className={`flex items-center gap-3 px-4 py-2 rounded-md transition cursor-pointer hover:bg-gray-100 ${activeSection === "Dashboard" ? "bg-[#e08325]/10 text-[#e08325]" : "text-black"}`} onClick={() => setActiveSection("Dashboard")}> <Home size={18} /> Dashboard</li>
                  <li className={`flex items-center gap-3 px-4 py-2 rounded-md transition cursor-pointer hover:bg-gray-100 ${activeSection === "Products" ? "bg-[#e08325]/10 text-[#e08325]" : "text-black"}`} onClick={() => setActiveSection("Products")}> <Package size={18} />Products </li>
                  <li className={`flex items-center gap-3 px-4 py-2 rounded-md transition cursor-pointer hover:bg-gray-100 ${activeSection === "User" ? "bg-[#e08325]/10 text-[#e08325]" : "text-black"}`} onClick={() => setActiveSection("User")}><Users size={18} /> Users </li>
                   <li className={`flex items-center gap-3 px-4 py-2 rounded-md transition cursor-pointer hover:bg-gray-100 ${activeSection === "Orders" ? "bg-[#e08325]/10 text-[#e08325]" : "text-black"}`} onClick={() => setActiveSection("Orders")}><ClipboardList size={18} /> Orders </li>
                </ul>
              </div>
             
                
              <div className="mt-auto pt-10">
                <button className="flex items-center gap-3 px-4 py-2 rounded-md text-red-600 hover:bg-red-100 transition">
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
        </aside>

        <main className="flex-1 p-4 md:p-8">

          {activeSection === "Dashboard" && (
                            <Dashboard/>
                          )}
          
          {activeSection === "Orders" && (
            <Orders />
          )}

          {activeSection === "User" && (
            <User />
          )}

          {activeSection === "Products" && (
            <Products />
          )}

        </main>
      </div>
    </div>
  );
}
