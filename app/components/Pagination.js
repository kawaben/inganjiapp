// components/Pagination.jsx
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [...Array(totalPages).keys()].map((num) => num + 1);

  return (
    <div className="flex justify-center mt-6 space-x-2">
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 border rounded ${
            currentPage === page
              ? "bg-orange-500 text-white"
              : "bg-white text-gray-700 hover:bg-orange-100"
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
