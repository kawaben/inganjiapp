import { useState, useEffect } from "react";
import "../globals.css";

export default function SearchPanel() {

    const allSuggestions = ["Tshirt", "Shoes", "Jacket", "Hat", "Underwear", "Glasses"];
    
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredSuggestions, setFilteredSuggestions] = useState([]);

    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
      
        if (query.length > 0) {
          const filtered = allSuggestions.filter((item) =>
            item.toLowerCase().includes(query.toLowerCase())
          );
          setFilteredSuggestions(filtered);
        } else {
          setFilteredSuggestions([]);
        }
      };


      const handleSuggestionClick = (suggestion, event) => {
        setSearchQuery(suggestion);
        setFilteredSuggestions([]); // Hide the suggestions after selection
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
          <ul className="mt-2 bg-white shadow-md rounded-md max-h-40 overflow-y-auto">
            {filteredSuggestions.map((item) => (
              <li
                key={item}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={(e) => handleSuggestionClick(item, e)}
              >
                {item}
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
  