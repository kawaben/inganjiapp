
import { useState } from 'react';
import { MoreHorizontal,ChevronDown } from 'lucide-react';
import Link from 'next/link';
import AddProductPage from '../addproduct/page';

const FiltersDropdown = ({ filters, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 text-sm font-medium bg-gray-100 border rounded-md shadow-sm"
      >
        {selected || 'Filters'}
        <ChevronDown className="ml-2 h-4 w-4" />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-2 w-48 bg-white border rounded-md shadow-lg">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => {
                onSelect(filter);
                setIsOpen(false);
              }}
              className={`block w-full px-4 py-2 text-sm text-left hover:bg-gray-100 ${
                selected === filter ? 'bg-gray-100 font-semibold' : ''
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


const sampleProducts = [
  
  { id: 1, image:'/images/f1-blue.jpg', variant: '11', name: 'Solid Lapel Neck Blouse', category: 'CLOTHING', sku: 'TS38790', price: '$24', status: 'Active' },
  { id: 2, image:'/images/f1-blue.jpg', variant: '11', name: 'Point Toe Heeled Pumps', category: 'SHOES', sku: 'TS38843', price: '$56', status: 'Out of Stock' },
  { id: 3, image:'/images/f1-blue.jpg', variant: '11', name: 'Crop Tank Top', category: 'CLOTHING', sku: 'TS77545', price: '$19', status: 'Active' },
  { id: 4, image:'/images/f1-blue.jpg', variant: '11', name: 'Pineapple Earrings', category: 'JEWELRY', sku: 'TS84432', price: '$8', status: 'Out of Stock' },
];

const statusStyle = {
  Active: 'bg-green-400 text-white-700',
  'Out of Stock': 'bg-red-400 text-white-700',
};

export default function ProductTable() {
  const [products, setProducts] = useState(sampleProducts);

   const filters = ['All', 'Active', 'Out of Stock'];
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredProducts = products.filter(product => {
    if (selectedFilter === 'All') return true;
    return product.status === selectedFilter;
  });

  return (
    <div className="p-6  min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded text-gray-600">Export</button>
          
          <Link href="admin/addproduct" passHref>
            
              <button className="px-4 py-2 bg-[#c9711a] text-white rounded">
                New Product
              </button>
            
          </Link>

          
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="w-64 px-4 py-2 border rounded"
        />
        <FiltersDropdown
            filters={filters}
            selected={selectedFilter}
            onSelect={setSelectedFilter}
          />
      </div>

      <div className="bg-white shadow rounded-lg overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 border-b text-gray-700">
            <tr>
              <th className="p-4"><input type="checkbox" /></th>
              <th className="p-4">Product Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Variant</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product =>  (
              <tr key={product.id} className="hover:bg-gray-200">
                <td className="p-4"><input type="checkbox" /></td>
                <td className="p-4 flex items-center gap-3">
                  <img src={product.image} alt="" className="w-10 h-10 object-cover rounded" />
                  {product.name}
                </td>
                <td className="p-4">{product.category}</td>
                <td className="p-4">{product.sku}</td>
                <td className="p-4">Varies on: {product.variant}</td>
                <td className="p-4 font-semibold">${product.price}</td>
                <td className="p-4">
                  <span className={`px-2 py-2 rounded-l text-xs ${statusStyle[product.status]}`}>
                    {product.status}
                  </span>
                </td>
                <td className="p-4">
                  <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-500">Page 1 of 7</p>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 border rounded">&lt;</button>
          {[1, 2, 3].map(num => (
            <button
              key={num}
              className={`px-3 py-1 border rounded ${num === 1 ? 'bg-[#c9711a] text-white' : ''}`}
            >
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
