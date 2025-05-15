'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from "react";
import Pagination from '../../components/Pagination'
import AddToCartButton from '../../components/AddToCartButton';
import './style.css'
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useStore } from '../../context/StoreContext';

const allProducts = {
  men: [
    { id: 1, name: 'Product 1',  images: { '#FFA500': '/images/m1-orange.jpg', '#008000': '/images/m1-green.jpg', '#0000FF': '/images/m1-blue.jpg', }, price: 25.99, oldPrice: 30.99, rating: 4.5, sizes: ['S', 'M', 'L'], colors: ['#FFA500', '#008000', '#0000FF'] },
    { id: 2, name: 'Product 2',  images: { '#e24405': '/images/m2-orange.jpg', '#ffff': '/images/m2-white.jpg', '#01053f': '/images/m2-blue.jpg', }, price: 25.99, oldPrice: 30.99, rating: 4.5, sizes: ['S','L'], colors: ['#e24405', '#ffff', '#01053f'] },
    { id: 3, name: 'Product 3',  images: { '#000': '/images/m3-black.jpg', '#ff0000': '/images/m3-red.jpg', '#ffff': '/images/m3-white.jpg', }, price: 25.99, oldPrice: 30.99, rating: 4.5, sizes: ['S', 'M', 'L'], colors: ['#000', '#ff0000', '#ffff'] },
    { id: 4, name: 'Product 4',  images: { '#FFA500': '/images/m1-orange.jpg', '#008000': '/images/m1-green.jpg', '#0000FF': '/images/m1-blue.jpg', }, price: 25.99, oldPrice: 30.99, rating: 4.5, sizes: ['S', 'M', 'L'], colors: ['#FFA500', '#008000', '#0000FF'] },
    { id: 5, name: 'Product 5',  images: { '#FFA500': '/images/m1-orange.jpg', '#008000': '/images/m1-green.jpg', '#0000FF': '/images/m1-blue.jpg', }, price: 25.99, oldPrice: 30.99, rating: 4.5, sizes: ['S', 'M', 'L'], colors: ['#FFA500', '#008000', '#0000FF'] },
  ],
  women: [
    { id: 6, name: 'Dress', images:{ '#000':'/images/f1-black.jpg','#0000ff':'/images/f1-blue.jpg','#ff0000':'/images/f1-red.png',}, price: 40, oldPrice: 55, rating: 4.7, sizes: ['S', 'M', 'L'], colors: ['#ff0000', '#0000ff','#000'] },
    { id: 7, name: 'Dress 2', images:{ '#0bb652':'/images/f2-green.jpg','#5c3904':'/images/f2-brown.jpg','#6d91af':'/images/f2-blue.jpg',}, price: 40, oldPrice: 55, rating: 4.7, sizes: ['S', 'M', 'L'], colors: ['#0bb652', '#5c3904','#6d91af'] },
  ],
  kids: [
    { id: 8, name: 'Complete', images:{ '#06c41f':'/images/k1-green.jpg','#046661':'/images/k1-blue.jpg',}, price: 40, oldPrice: 55, rating: 4.7, sizes: ['S', 'M', 'L'], colors: ['#06c41f', '#046661'] },
    { id: 9, name: 'Dress', images:{ '#046625':'/images/k2-green.jpg','#000011':'/images/k2-black.jpg','#b3b606':'/images/k2-yellow.jpg',}, price: 40, oldPrice: 55, rating: 4.7, sizes: ['S', 'M', 'L'], colors: ['#046625', '#000011','#b3b606'] },
  ],
  accessories: [
    { id: 10, name: 'Glasses', images:{ '#000':'/images/a1-black.jpg','#0000ff':'/images/a1-blue.jpg',}, price: 40, oldPrice: 55, rating: 4.7, sizes: ['S', 'M', 'L'], colors: ['#000', '#0000ff'] },
    { id: 11, name: 'Hat', images:{ '#ffff':'/images/a2-white.jpg','#046625':'/images/a2-green.jpg',}, price: 40, oldPrice: 55, rating: 4.7, sizes: ['S', 'M', 'L'], colors: ['#ffff', '#046625'] },
    { id: 12, name: 'Hat 2', images:{ '#000':'/images/a3-black.jpg','#ffff':'/images/a3-white.jpg',}, price: 40, oldPrice: 55, rating: 4.7, sizes: ['S', 'M', 'L'], colors: ['#000', '#ffff'] },
  ],
}

export default function CategoryPage({ product }) {
  const { type } = useParams()
  const products = allProducts[type] || []

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSize, setSelectedSize] = useState(null)
 const [selectedColorFilter, setSelectedColorFilter] = useState(null);
const [selectedColors, setSelectedColors] = useState({});
const [selectedSizes, setSelectedSizes] = useState({});

const [selectedImages, setSelectedImages] = useState({}); // ✅ New state to track image


const [filterColor, setFilterColor] = useState(null);

const { wishlist, toggleWishlist } = useStore();

const productsPerPage = 3;

const filteredProducts = products.filter(product => {
  const matchSize = selectedSize ? product.sizes.includes(selectedSize) : true;
  const matchColor = selectedColorFilter ? product.colors.includes(selectedColorFilter) : true;
  return matchSize && matchColor;
});

const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
const startIdx = (currentPage - 1) * productsPerPage;
const currentProducts = filteredProducts.slice(startIdx, startIdx + productsPerPage);

// ✅ Update color and image on selection
const handleColorClick = (productId, color) => {
  setSelectedColors(prev => ({
    ...prev,
    [productId]: prev[productId] === color ? null : color,
  }));

  const product = products.find(p => p.id === productId);
  const image = product?.images?.[color] || Object.values(product?.images || {})[0] || '/images/default.jpg';

  setSelectedImages(prev => ({
    ...prev,
    [productId]: image,
  }));
};

const handleSizeClick = (productId, size) => {
  setSelectedSizes(prev => ({
    ...prev,
    [productId]: prev[productId] === size ? null : size,
  }));
};


  return (
    <div className="category">
      {/* Sidebar */}
      <div className="filter-sidebar">
        <h1>Available Today</h1>
        <p>
          <span role="img" aria-label="location">📍</span> Items may be available for pickup.
          <a href="#"> Find Nearby Store</a>
        </p>
        <h2>Filters</h2>

        <h3>Sizes</h3>
    <div className="size-options">
      {["S", "M", "L", "XL", "XXL"].map(size => (
        <div
          key={size}
          className={`size-option ${selectedSize === size ? 'selected' : ''}`}
          onClick={() => setSelectedSize(selectedSize === size ? null : size)}
        >
          {size}
        </div>
      ))}
    </div>

    
  </div>

  {/* Product Grid */}
  <div className="grid-container">
    <div className="product-grid">
      {currentProducts.map(product => {
        const selectedColor = selectedColors[product.id]
        const productImage = selectedColor
          ? product.images[selectedColor] || Object.values(product.images)[0]
          : Object.values(product.images)[0]

        return (
          <div key={product.id} className="product-grid-images">
            <img src={productImage} alt={product.name} />
            <div className="color-dots">
              {product.colors.map((color, i) => (
            <button
              key={i}
              onClick={() => handleColorClick(product.id, color)}
              className={`w-6 h-6 rounded-full border-2 ${
                selectedColors[product.id] === color ? 'border-black' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
            ></button>
          ))}

            </div>

            <div className="flex gap-2 mt-2">
                {product.sizes.map((size, i) => (
                  <button
                    key={i}
                    onClick={() => handleSizeClick(product.id, size)}
                    className={`px-2 py-1 text-sm border rounded ${
                      selectedSizes[product.id] === size ? 'bg-black text-white' : 'bg-white text-black border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>


            <h4>{product.name}</h4>
            <p className="flex items-center justify-between w-32">
              <span className="flex items-center gap-1">
                ⭐ {product.rating}
              </span>
              <button onClick={() => toggleWishlist(product)}>
                {wishlist.some((w) => w.id === product.id) ? (
                  <FaHeart className="text-[#e08325]" />
                ) : (
                  <FaRegHeart className="text-[#1b1403] hover:text-[#e08325]" />
                )}
              </button>
            </p>

            
            <p>
              <strong>${product.price}</strong>{' '}
              <span style={{ textDecoration: 'line-through' }}>${product.oldPrice}</span>
            </p>
            <AddToCartButton
                product={product}
                selectedColor={selectedColors[product.id]}
                selectedSize={selectedSizes[product.id]}
                selectedImage={product.images[selectedColors[product.id]]}
              />



            
          </div>
        )
      })}
    </div>

    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={setCurrentPage}
    />
  </div>
</div>

  )
}
