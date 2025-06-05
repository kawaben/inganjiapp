"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from '../hooks/useAdminAuth';
import { usePathname } from 'next/navigation'
import { Home, Package, ClipboardList, Users, LogOut,MessageSquare } from 'lucide-react'
import Dashboard from "./dashboard/page";
import Orders from "./orders/page";
import User from "./users/page";
import Products from "./products/page";
import Messages from "./messages/page";
import ThemeToggle from "../components/ThemeButton";


export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const { user, loading } = useAdminAuth();
  const pathname = usePathname()
  if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen  bg-[var(--background)] p-6">
      <h1 className="text-2xl font-bold mb-2 pt-20">Hi, {user?.name ?? 'Admin'}</h1>
      <div className="flex flex-col md:flex-row bg-[var(--background2)] rounded shadow mt-5">
        

        <aside className="w-full  md:w-64 rounded p-4 pt-6 ">
              <h2 className="text-2xl font-bold text-[var(--text)] mb-8">Admin</h2>
              <div className=" gap-4 ">
                <ul className="space-y-3">
                  <li className={`flex items-center gap-3 px-4 py-2 rounded-md transition cursor-pointer hover:bg-[var(--secondary)] ${activeSection === "Dashboard" ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "text-[var(--text)]"}`} onClick={() => setActiveSection("Dashboard")}> <Home size={18} /> Dashboard</li>
                  <li className={`flex items-center gap-3 px-4 py-2 rounded-md transition cursor-pointer hover:bg-[var(--secondary)] ${activeSection === "Products" ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "text-[var(--text)]"}`} onClick={() => setActiveSection("Products")}> <Package size={18} />Products </li>
                  <li className={`flex items-center gap-3 px-4 py-2 rounded-md transition cursor-pointer hover:bg-[var(--secondary)] ${activeSection === "User" ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "text-[var(--text)]"}`} onClick={() => setActiveSection("User")}><Users size={18} /> Users </li>
                   <li className={`flex items-center gap-3 px-4 py-2 rounded-md transition cursor-pointer hover:bg-[var(--secondary)] ${activeSection === "Orders" ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "text-[var(--text)]"}`} onClick={() => setActiveSection("Orders")}><ClipboardList size={18} /> Orders </li>
                   <li className={`flex items-center gap-3 px-4 py-2 rounded-md transition cursor-pointer hover:bg-[var(--secondary)] ${activeSection === "Messages" ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "text-[var(--text)]"}`} onClick={() => setActiveSection("Messages")}><MessageSquare size={18} /> Messages </li>
                </ul>
              </div>
             {/*Theme Button*/}
              <div className="mt-auto pt-10">
                <ThemeToggle/>
              </div>
                {/*Logout Button*/}
              <div className="mt-auto pt-10">
                <button className="flex items-center gap-3 px-4 py-2 rounded-md text-[var(--hover)] hover:bg-[var(--hover)]/10 cursor-pointer transition">
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

          {activeSection === "Messages" && (
            <Messages />
          )}


        </main>
      </div>
    </div>
  );
}
