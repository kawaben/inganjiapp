import { useState, useEffect } from "react";
import "../globals.css";
import { initDB,STORE_NAMES,USERS_STORE } from "../lib/db"; 


export default function SearchPanel() {

  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);

 const handleSearchChange = async (e) => {
  const query = e.target.value;
  setSearchQuery(query);

  if (query.length === 0) {
    setFilteredSuggestions([]);
    return;
  }

  try {
    const db = await initDB();
    const allResults = [];

    // Search all product stores
    for (const storeName of STORE_NAMES) {
      const tx = db.transaction(storeName, "readonly");
      const store = tx.objectStore(storeName);
      const items = await store.getAll();
      allResults.push(
        ...items.map((item) => ({
          label: item.name,
          type: "product",
          source: storeName,
          id: item.id,
          image: Object.values(item.images)?.[0] || "/logo.svg"

        }))
      );
    }

    // Search user store
    const userTx = db.transaction(USERS_STORE, "readonly");
    const userStore = userTx.objectStore(USERS_STORE);
    const users = await userStore.getAll();

    allResults.push(
      ...users.map((user) => ({
        label: user.name || user.email,
        type: "user",
        id: user.email, 
        image: user.image || "/logo.svg" || "",
      }))
    );

    const filtered = allResults.filter((entry) =>
      entry.label?.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredSuggestions(filtered);
  } catch (err) {
    console.error("IndexedDB search error:", err);
    setFilteredSuggestions([]);
  }
};


  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    setFilteredSuggestions([]);
  };



    return (
        <div className={`fixed top-16 right-0 w-full md:w-1/3 h-screen bg-[#f8e2d2] shadow-lg transition-transform duration-300 panel p-5 z-10  "translate-x-0" : "translate-x-full"`}>
        <h2 className="text-lg font-bold uppercase text-black mb-4">Search</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="What Are You Looking For?"
          className="w-full p-3 border-none rounded-md bg-[#3a3a3a] text-[#f8e2d2] placeholder-gray-300"
        />
        {filteredSuggestions.length > 0 && (
         <ul>
            {filteredSuggestions.map((item, index) => (
              <li
                key={index}
                onClick={(e) => handleSuggestionClick(item.label, e)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <img
                  src={item.image || "/logo.svg"} 
                  alt={item.label}
                  style={{ width: 40, height: 40, objectFit: "cover", borderRadius: "6px" }}
                />
                <div>
                  <strong>{item.label}</strong>
                  <div style={{ fontSize: "12px", color: "gray" }}>
                    {item.type === "user" ? "User" : `in ${item.source}`}
                  </div>
                </div>
              </li>
            ))}
          </ul>

        )}
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery("");
              setFilteredSuggestions([]);
            }}
            className="mt-3 bg-[#e08325] text-[#f8e2d2] p-2 w-full rounded-md"
          >
            Clear All
          </button>
        )}
      </div>
    );
  }
  