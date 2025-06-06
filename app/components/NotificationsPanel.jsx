import { useState, useEffect } from "react";
import {
    TrashIcon,
  } from "@heroicons/react/24/solid";
  
import "../globals.css";
export default function NotificationsPanel() {

    const [notifications, setNotifications] = useState([
        { id: 1, message: "🔥 New Sale on Shoes!" },
        { id: 2, message: "📢 Your order is out for delivery!" },
        { id: 3, message: "🎉 New products added to Accessories" },
    ]);

    const dismissNotification = (id) => {
        setNotifications((prev) => prev.filter((notification) => notification.id !== id));
        };


    return (
        <div className={`fixed top-16 right-0 w-full md:w-1/3 h-screen bg-[var(--background)] shadow-lg transition-transform duration-300 panel p-5 z-10 "translate-x-0" : "translate-x-full"`}>
        <h2 className="text-lg font-bold uppercase text-[var(--text)] mb-4">Notifications 🔔</h2>
        <ul className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <li key={notification.id} className="p-3 bg-[var(--background2)] rounded shadow-sm flex justify-between">
                {notification.message}
                <button onClick={() => dismissNotification(notification.id)} className="text-[var(--primary)] cursor-pointer">
                  <TrashIcon className="w-5 h-5" />
                </button>
              </li>
            ))
          ) : (
            <p className="text-[var(--secondary)]">No new notifications.</p>
          )}
        </ul>
        {notifications.length > 0 && (
          <button
            onClick={() => {setNotifications([]);}}
            
            className="mt-4 bg-[var(--primary)] text-[var(--text)] p-2 w-full rounded-md"
          >
            Clear All
          </button>
        )}
      </div>
    );
  }
  