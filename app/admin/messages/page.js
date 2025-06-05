"use client";
import { useEffect, useState } from "react";

export default function Messages() {
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
  <div className="p-4 sm:p-6">
  <h1 className="text-2xl sm:text-3xl text-[var(--text)] font-bold mb-6 text-center">Admin Messages</h1>

  {loading ? (
    <p className="text-center">Loading messages...</p>
  ) : messages.length === 0 ? (
    <p className="text-[var(--primary)] text-center">No messages yet.</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="min-w-full shadow-md rounded-lg overflow-hidden">
        <thead className="bg-[var(--background)] text-[var(--text)]">
          <tr>
            <th className="p-3 text-left whitespace-nowrap">Name</th>
            <th className="p-3 text-left whitespace-nowrap">Email</th>
            <th className="p-3 text-left whitespace-nowrap">Message</th>
            <th className="p-3 text-left whitespace-nowrap">Actions</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg) => (
            <tr key={msg.id} className="border-b">
              <td className="p-3 text-[var(--text)] whitespace-nowrap">{msg.name}</td>
              <td className="p-3 text-[var(--text)] whitespace-nowrap">{msg.email}</td>
              <td className="p-3 text-[var(--text)]">{msg.message}</td>
              <td className="p-3 text-[var(--text)]">
                <button
                  onClick={() => deleteMessage(msg.id)}
                  className="bg-[var(--primary)] text-[var(--text)] px-3 py-1 rounded hover:bg-[var(--hover)] cursor-pointer transition-colors duration-200"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>

  );
}
