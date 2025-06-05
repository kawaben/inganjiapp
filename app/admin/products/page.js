'use client'

import { useEffect, useState } from "react";
import { openDB } from 'idb';
import { MoreHorizontal, ChevronDown, Trash } from 'lucide-react';
import Link from 'next/link';
import {
  getAllProductsFromAllCategories,
  deleteProductFromCategory,
} from '../../lib/db';


const FiltersDropdown = ({ filters, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

 




  return (
    <div className="relative inline-block text-left">
      <button onClick={() => setIsOpen(!isOpen)} className="inline-flex items-center px-4 py-2 text-sm font-medium bg-[var(--primary)] border rounded-md shadow-sm">
        {selected || 'Filters'}
        <ChevronDown className="ml-2 h-4 w-4" />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-48 bg-[var(--background)] border rounded-md shadow-lg">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                onSelect(filter);
                setIsOpen(false);
              }}
              className={`block w-full px-4 py-2 text-sm text-left hover:bg-[var(--background2)] ${
                selected === filter ? 'bg-[var(--background2)] font-semibold' : ''
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const statusStyle = {
  Active: 'bg-green-400 text-white-700',
  'Out of Stock': 'bg-red-400 text-white-700',
};

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const filters = ['All', 'Active', 'Out of Stock'];

  
  useEffect(() => {
  const load = async () => {
    const products = await getAllProductsFromAllCategories();
    setProducts(products);
  };
  load();
}, []);


  const filteredProducts = products.filter(product =>
    selectedFilter === 'All' || product.status === selectedFilter
  );

  const handleDeleteProduct = async (id, category) => {
  await deleteProductFromCategory(category, id);
  const updated = await getAllProductsFromAllCategories();
  setProducts(updated);
  alert('Product deleted!');
};


  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded text-[var(--text)]">Export</button>
          <Link href="admin/addproduct" passHref>
            <button className="px-4 py-2 bg-[var(--primary)] text-[var(--text)] rounded cursor-pointer">
              New Product
            </button>
          </Link>
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <input type="text" placeholder="Search..." className="w-64 px-4 py-2 border rounded" />
        <FiltersDropdown filters={filters} selected={selectedFilter} onSelect={setSelectedFilter} />
      </div>

      <div className="bg-[var(--background)] shadow rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[var(--background2)] border-b text-[var(--text)]">
            <tr>
              <th className="p-4"><input type="checkbox" /></th>
              <th className="p-4">Product Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => {
              const firstImage = product.images ? Object.values(product.images)[0] : null;
              return (
                <tr key={product.id} className="hover:bg-[var(--background2)]">
                  <td className="p-4"><input type="checkbox" /></td>
                  <td className="p-4 flex items-center gap-3">
                    {firstImage && (
                      <img src={firstImage} alt="" className="w-10 h-10 object-cover rounded" />
                    )}
                    {product.name}
                  </td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4">{product.sku}</td>
                  <td className="p-4">In Stock: {product.stock}</td>
                  <td className="p-4 font-semibold">${product.price}</td>
                  <td className="p-4">
                    <span className={`px-2 py-2 rounded-l text-xs ${statusStyle[product.status]}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleDeleteProduct(product.id, product.category)}>
                      <Trash className="w-5 h-5 cursor-pointer" />
                    </button>

                  </td>
                  <td className="p-4">
                    <MoreHorizontal className="w-5 h-5 text-[var(--secondary)] cursor-pointer" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-[var(--secondary)]">Page 1 of 7</p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border rounded">&lt;</button>
          {[1, 2, 3].map(num => (
            <button key={num} className={`px-3 py-1 border rounded ${num === 1 ? 'bg-[var(--primary)] text-[var(--text)]' : ''}`}>
              {num}
            </button>
          ))}
          <span className="px-2">...</span>
          <button className="px-3 py-1 border rounded">&gt;</button>
        </div>
      </div>
    </div>
  );
}
