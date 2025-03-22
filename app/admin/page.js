"use client";
import { useEffect, useState } from "react";

export default function AdminPanel() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch messages from API
  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    try {
      const response = await fetch("/api/messages");
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }

  // Delete message
  async function deleteMessage(id) {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const response = await fetch("/api/messages", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setMessages(messages.filter((msg) => msg.id !== id));
      }
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  }

  return (
    <div className="p-6 min-h-screen bg-gray-900">
      <h1 className="text-3xl text-yellow-600 font-bold mb-6 text-center">Admin Messages</h1>

      {loading ? (
        <p>Loading messages...</p>
      ) : messages.length === 0 ? (
        <p className="text-yellow-600 text-center">No messages yet.</p>
      ) : (
        <table className="w-full bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-700 text-yellow-600">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Message</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg) => (
              <tr key={msg.id} className="border-b">
                <td className="p-3 text-yellow-700">{msg.name}</td>
                <td className="p-3 text-yellow-700">{msg.email}</td>
                <td className="p-3 text-yellow-700">{msg.message}</td>
                <td className="p-3 text-yellow-700">
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    className="bg-red-900 text-yellow-600 px-3 py-1 rounded hover:bg-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
