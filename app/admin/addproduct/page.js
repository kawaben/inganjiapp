'use client';

import { useState } from 'react';
import { addProductToCategory } from '../../lib/db';
import Link from "next/link";

const categories = ['men', 'women', 'kids', 'accessories'];

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    oldPrice: '',
    rating: '',
    sizes: '',
    colors: '',
    category: 'men',
    images: {}, 
    stock: '',
  });

  const [currentColor, setCurrentColor] = useState('');
  const [currentImage, setCurrentImage] = useState('');

  const handleAddImage = () => {
    if (currentColor && currentImage) {
      setFormData(prev => ({
        ...prev,
        images: {
          ...prev.images,
          [currentColor]: currentImage,
        }
      }));
      setCurrentColor('');
      setCurrentImage('');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const newProduct = {
      id: Date.now(),
      name: formData.name,
      price: parseFloat(formData.price),
      oldPrice: parseFloat(formData.oldPrice),
      rating: parseFloat(formData.rating),
      sizes: formData.sizes.split(',').map(s => s.trim()),
      colors: formData.colors.split(',').map(c => c.trim()),
      images: formData.images,
      stock: parseInt(formData.stock),
    };

    await addProductToCategory(formData.category, newProduct);
    alert('Product added successfully!');

    // Reset form
    setFormData({
      name: '',
      price: '',
      oldPrice: '',
      rating: '',
      sizes: '',
      colors: '',
      category: 'men',
      images: {},
      stock: '',
    });
  };

  return (
    <div className='p-25'>
      <button  type="button">
        <Link className="flex items-center gap-3 px-4 py-2 rounded-md text-white bg-[#e08325] hover:bg-black cursor-pointer m-5 transition" href="/admin">GO BACK</Link>
      </button>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem', maxWidth: '600px' }}>
        <input
          className="w-full p-3 border border-[#e08325] rounded-md text-[#1b1403] placeholder-gray-700 mt-3"
          placeholder="Name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <input
          className="w-full p-3 border border-[#e08325] rounded-md text-[#1b1403] placeholder-gray-700 mt-3"
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={e => setFormData({ ...formData, price: e.target.value })}
          required
        />

        <input
          className="w-full p-3 border border-[#e08325] rounded-md text-[#1b1403] placeholder-gray-700 mt-3"
          type="number"
          placeholder="Old Price"
          value={formData.oldPrice}
          onChange={e => setFormData({ ...formData, oldPrice: e.target.value })}
        />

        <input
          className="w-full p-3 border border-[#e08325] rounded-md text-[#1b1403] placeholder-gray-700 mt-3"
          type="number"
          step="0.1"
          placeholder="Rating"
          value={formData.rating}
          onChange={e => setFormData({ ...formData, rating: e.target.value })}
        />

        <input
          className="w-full p-3 border border-[#e08325] rounded-md text-[#1b1403] placeholder-gray-700 mt-3"
          placeholder="Sizes (comma-separated, e.g. S,M,L)"
          value={formData.sizes}
          onChange={e => setFormData({ ...formData, sizes: e.target.value })}
        />

        <input
          className="w-full p-3 border border-[#e08325] rounded-md text-[#1b1403] placeholder-gray-700 mt-3"
          placeholder="Colors (comma-separated hex codes)"
          value={formData.colors}
          onChange={e => setFormData({ ...formData, colors: e.target.value })}
        />

        <div>
          <label>Category:</label>
          <select
            className="w-full p-3 border border-[#e08325] rounded-md text-[#1b1403] placeholder-gray-700 mt-3"
            value={formData.category}
            onChange={e => setFormData({ ...formData, category: e.target.value })}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Images by Color:</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              className="w-full p-3 border border-[#e08325] rounded-md text-[#1b1403] placeholder-gray-700 mt-3"
              placeholder="Color Hex (e.g. #ff0000)"
              value={currentColor}
              onChange={e => setCurrentColor(e.target.value)}
            />

            <input
              type="file"
              accept="image/*"
              className="w-full p-3 border border-[#e08325] rounded-md text-[#1b1403] placeholder-gray-700 mt-3"
              onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setCurrentImage(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />

            <button
              className="flex items-center gap-3 px-4 py-2 rounded-md text-white bg-black hover:bg-red-300 transition"
              type="button"
              onClick={handleAddImage}
            >
              Add
            </button>
          </div>

          <ul className="w-full p-3 border border-[#e08325] rounded-md text-[#1b1403] placeholder-gray-700 mt-3">
            {Object.entries(formData.images).map(([color, url]) => (
              <li key={color} className="flex items-center gap-4">
                <span className="w-6 h-6 rounded-full" style={{ backgroundColor: color }}></span>
                <img src={url} alt={color} className="w-12 h-12 object-cover rounded" />
                <span>{color}</span>
              </li>
            ))}
          </ul>
        </div>

        <input
          type="number"
          placeholder="Stock Count"
          className="w-full p-3 border border-[#e08325] rounded-md text-[#1b1403] placeholder-gray-700 mt-3"
          value={formData.stock}
          onChange={e => setFormData({ ...formData, stock: e.target.value })}
        />

        <button
          className="flex items-center gap-3 px-4 py-2 rounded-md text-black bg-orange-500 transition"
          type="submit"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
