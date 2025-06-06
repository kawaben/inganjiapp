import { useState, useEffect } from "react";
import "../globals.css";
import { useRouter } from "next/navigation";
import { initDB,STORE_NAMES,USERS_STORE } from "../lib/db"; 


export default function SearchPanel() {
  const router = useRouter();
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
    const queryLower = query.toLowerCase();

    const matchingUsers = users
  .filter((user) =>
    (user.email && user.email.toLowerCase().includes(queryLower)) ||
    (user.firstname && user.firstname.toLowerCase().includes(queryLower)) ||
    (user.lastname && user.lastname.toLowerCase().includes(queryLower))
  )
  .map((user) => {
    let label = user.email; 
    if (user.lastname?.toLowerCase().includes(queryLower)) {
      label = user.lastname;
    } else if (user.email?.toLowerCase().includes(queryLower)) {
      label = user.email;
    } else if (user.firstname?.toLowerCase().includes(queryLower)) {
      label = user.firstname;
    }

    return {
      label,
      type: "user",
      email: user.email,
      id:user.email,
      image: user.image || "/logo.svg",
    };
  });

allResults.push(...matchingUsers);

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
  setSearchQuery(suggestion.label);
  setFilteredSuggestions([]);

  if (suggestion.type === "product") {
    router.push(`/products/${suggestion.id}`);
  } else if (suggestion.type === "user") {
    router.push(`/users/${encodeURIComponent(suggestion.id)}`);
  }
};







    return (
        <div className={`fixed top-16 right-0 w-full md:w-1/3 h-screen bg-[var(--background)] shadow-lg transition-transform duration-300 panel p-5 z-10  "translate-x-0" : "translate-x-full"`}>
        <h2 className="text-lg font-bold uppercase text-[var(--text)] mb-4">Search</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="What Are You Looking For ?"
          className="w-full p-3 border-none rounded-md bg-[var(--background2)] text-[var(--secondary)] placeholder-[var(--secondary)]"
        />
        {filteredSuggestions.length > 0 && (
         <ul>
          {filteredSuggestions.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(item)}
              className="flex alignItems:center gap-3 p-3 cursor-pointer border-b border-[var(--secondary)]"
            >
              <img
                src={item.image}
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
            className="mt-3 bg-[var(--primary)] text-[var(--text)] p-2 w-full rounded-md cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>
    );
  }
  