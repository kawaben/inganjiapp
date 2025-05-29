'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Pagination from '../../components/Pagination';
import AddToCartButton from '../../components/AddToCartButton';
import WishlistButton from '../../components/WishlistButton';
import './style.css';
import { getProductsByCategory} from '../../lib/db'; 

export default function CategoryPage() {
  const { type } = useParams();

  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColorFilter, setSelectedColorFilter] = useState(null);
  const [selectedColors, setSelectedColors] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedImages, setSelectedImages] = useState({});
  const productsPerPage = 3;

  useEffect(() => {
    const loadProducts = async () => {
      const fetched = await getProductsByCategory(type);
      setProducts(fetched);
    };
    loadProducts();
  }, [type]);

  const filteredProducts = products.filter(product => {
    const matchSize = selectedSize ? product.sizes.includes(selectedSize) : true;
    const matchColor = selectedColorFilter ? product.colors.includes(selectedColorFilter) : true;
    return matchSize && matchColor;
  });

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIdx = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts.slice(startIdx, startIdx + productsPerPage);

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
            const selectedColor = selectedColors[product.id];
            const productImage = selectedColor
              ? product.images[selectedColor] || Object.values(product.images)[0]
              : Object.values(product.images)[0];

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
                      className={`flex px-2 py-1 w-6 h-6 items-center justify-center text-sm border rounded ${
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
                 <WishlistButton product={product} />
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
            );
          })}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
