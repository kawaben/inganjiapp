"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus("Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("Network error. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl text-[#1b1403] font-bold mb-6">Contact Us</h1>
      <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-md w-full max-w-md">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-3 text-[#1b1403] border border-gray-700 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-600"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 text-[#1b1403] border border-gray-700 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-600"
        />
        <textarea
          name="message"
          placeholder="Message"
          value={formData.message}
          onChange={handleChange}
          required
          className="w-full p-3 text-[#1b1403] border border-gray-700 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-600"
        />
        <button
          type="submit"
          className="w-full bg-[#c9711a] text-[#1b1403] p-3 rounded-lg hover:bg-[#FF4500] cursor-pointer transition"
        >
          Send Message
        </button>
      </form>
      {status && <p className="mt-4 text-yellow-600">{status}</p>}
    </div>
  );
}
