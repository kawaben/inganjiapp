"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check login status from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const loggedIn = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedIn) {
      const user = storedUsers.find((u) => u.email === loggedIn.email);
      if (user) setCurrentUser(user);
      
    } else {
      router.push("/"); // Redirect to home if not logged in
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setCurrentUser(null);
    router.push("/");
  };

  if (!currentUser) {
    return <p className="p-10">Loading user...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-40 bg-white shadow-md rounded-md ">
      <h1 className="text-2xl font-bold mb-4">Welcome, {currentUser.email}</h1>

      <div className="space-y-2">
        <p><span className="font-semibold">Email:</span> {currentUser.email}</p>
        <p><span className="font-semibold">Password:</span> {currentUser.password}</p>
        {/* You can add more user-related info like order history, profile picture, etc. */}
      </div>

      <button
        onClick={handleLogout}
        className="mt-6 bg-[#e08325] text-white px-4 py-2 rounded hover:bg-[#c76f1f]"
      >
        Logout
      </button>
    </div>
  );
}
