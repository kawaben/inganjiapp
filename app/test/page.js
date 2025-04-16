// app/user/page.tsx (or .jsx)
"use client";

import React, { useState, useEffect } from "react";

export default function UserPage() {
   


  const [user, setUser] = useState({
    firstname: "Jack",
    lastname: "Adams",
    username: "JD",
    email: "jackadams@gmail.com",
    phone: "(213) 555-1234",
    bio: "Product Designer",
    location: "Los Angeles, California, USA",
    country: "United States of America",
    state: "California, USA",
    image: "https://randomuser.me/api/portraits/men/92.jpg",
  });

  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  return (
    <div className="bg-[#f8e2d2] p-10 ">
        <div className="flex bg-[#f7eee8] border border-gray-300 rounded shadow m-30">
            {/* Sidebar */}
            <aside className="w-64 rounded p-4 pt-15">
                <ul className="space-y-3">
                <li className="text-blue-600 font-medium">My Profile</li>
                <li>Security</li>
                <li>Notification</li>
                <li>Billing</li>
                <li>Settings</li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <h1 className="text-2xl font-bold mb-4">My Profile</h1>

                {/* Top Profile Card */}
                <div className="border border-gray-300 rounded  p-4 flex items-center gap-4 mb-6">
                <img
                    src={user.image}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                    <h2 className="text-xl font-semibold">{user.firstname} {user.lastname} ({user.username})</h2>
                    <p className="text-gray-500">{user.bio}</p>
                    <p className="text-gray-400 text-sm">{user.location}</p>
                </div>
                <button className="ml-auto text-sm text-[#1b1403] border border-gray-300 bg-[#e08325] rounded p-1 cursor-pointer" onClick={openEditModal}>✎ Edit</button>
                </div>

                {/* Personal Info */}
                <div className="border border-gray-300 rounded  p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Personal Information</h3>
                    <button className="ml-auto text-sm text-[#1b1403] border border-gray-300 bg-[#e08325] rounded p-1 cursor-pointer">✎ Edit</button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>First Name:</strong> {user.firstname}</div>
                    <div><strong>Last Name:</strong> {user.lastname}</div>
                    <div><strong>Username:</strong> {user.username}</div>
                    <div><strong>Email:</strong> {user.email}</div>
                    <div><strong>Phone:</strong> {user.phone}</div>
                    <div className="col-span-2"><strong>Bio:</strong> {user.bio}</div>
                </div>
                </div>

                {/* Address Info */}
                <div className="border border-gray-300 rounded  p-4">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Address</h3>
                    <button className="ml-auto text-sm text-[#1b1403] border border-gray-300 bg-[#e08325] rounded p-1 cursor-pointer">✎ Edit</button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Country:</strong> {user.country}</div>
                    <div><strong>City/State:</strong> {user.location}</div>
                </div>
                </div>
            </main>
        </div>
    </div>
  );
}
