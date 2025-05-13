'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import Pagination from '../../components/Pagination'
import AddToCartButton from '../../components/AddToCartButton';
import './style.css'

const allProducts = {
  men: [
    { id: 1, name: 'Product 1',  images: { '#FFA500': '/images/m1-orange.jpg', '#008000': '/images/m1-green.jpg', '#0000FF': '/images/m1-blue.jpg', }, price: 25.99, oldPrice: 30.99, rating: 4.5, sizes: ['S', 'M', 'L'], colors: ['#FFA500', '#008000', '#0000FF'] },
    { id: 2, name: 'Product 2',  images: { '#e24405': '/images/m2-orange.jpg', '#ffff': '/images/m2-white.jpg', '#01053f': '/images/m2-blue.jpg', }, price: 25.99, oldPrice: 30.99, rating: 4.5, sizes: ['S','L'], colors: ['#e24405', '#ffff', '#01053f'] },
    { id: 3, name: 'Product 3',  images: { '#000': '/images/m3-black.jpg', '#ff0000': '/images/m3-red.jpg', '#ffff': '/images/m3-white.jpg', }, price: 25.99, oldPrice: 30.99, rating: 4.5, sizes: ['S', 'M', 'L'], colors: ['#000', '#ff0000', '#ffff'] },
    { id: 4, name: 'Product 4',  images: { '#FFA500': '/images/m1-orange.jpg', '#008000': '/images/m1-green.jpg', '#0000FF': '/images/m1-blue.jpg', }, price: 25.99, oldPrice: 30.99, rating: 4.5, sizes: ['S', 'M', 'L'], colors: ['#FFA500', '#008000', '#0000FF'] },
    { id: 5, name: 'Product 5',  images: { '#FFA500': '/images/m1-orange.jpg', '#008000': '/images/m1-green.jpg', '#0000FF': '/images/m1-blue.jpg', }, price: 25.99, oldPrice: 30.99, rating: 4.5, sizes: ['S', 'M', 'L'], colors: ['#FFA500', '#008000', '#0000FF'] },
  ],
  women: [
    { id: 1, name: 'Dress', images:{ '#000':'/images/f1-black.jpg','#0000ff':'/images/f1-blue.jpg','#ff0000':'/images/f1-red.png',}, price: 40, oldPrice: 55, rating: 4.7, sizes: ['S', 'M', 'L'], colors: ['#ff0000', '#0000ff','#000'] },
    { id: 2, name: 'Dress 2', images:{ '#0bb652':'/images/f2-green.jpg','#5c3904':'/images/f2-brown.jpg','#6d91af':'/images/f2-blue.jpg',}, price: 40, oldPrice: 55, rating: 4.7, sizes: ['S', 'M', 'L'], colors: ['#0bb652', '#5c3904','#6d91af'] },
  ],
  kids: [
    { id: 1, name: 'Complete', images:{ '#06c41f':'/images/k1-green.jpg','#046661':'/images/k1-blue.jpg',}, price: 40, oldPrice: 55, rating: 4.7, sizes: ['S', 'M', 'L'], colors: ['#06c41f', '#046661'] },
    { id: 2, name: 'Dress', images:{ '#046625':'/images/k2-green.jpg','#000011':'/images/k2-black.jpg','#b3b606':'/images/k2-yellow.jpg',}, price: 40, oldPrice: 55, rating: 4.7, sizes: ['S', 'M', 'L'], colors: ['#046625', '#000011','#b3b606'] },
  ],
  accessories: [
    { id: 1, name: 'Glasses', images:{ '#000':'/images/a1-black.jpg','#0000ff':'/images/a1-blue.jpg',}, price: 40, oldPrice: 55, rating: 4.7, sizes: ['S', 'M', 'L'], colors: ['#000', '#0000ff'] },
    { id: 2, name: 'Hat', images:{ '#ffff':'/images/a2-white.jpg','#046625':'/images/a2-green.jpg',}, price: 40, oldPrice: 55, rating: 4.7, sizes: ['S', 'M', 'L'], colors: ['#ffff', '#046625'] },
    { id: 3, name: 'Hat 2', images:{ '#000':'/images/a3-black.jpg','#ffff':'/images/a3-white.jpg',}, price: 40, oldPrice: 55, rating: 4.7, sizes: ['S', 'M', 'L'], colors: ['#000', '#ffff'] },
  ],
}

export default function CategoryPage() {
  const { type } = useParams()
  const products = allProducts[type] || []

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColorFilter, setSelectedColorFilter] = useState(null)
  const [selectedColors, setSelectedColors] = useState({}) // Per-product color selection
  const [filterColor, setFilterColor] = useState(null) 
  
  

  const productsPerPage = 3

  const filteredProducts = products.filter(product => {
    const matchSize = selectedSize ? product.sizes.includes(selectedSize) : true
    const matchColor = selectedColorFilter ? product.colors.includes(selectedColorFilter) : true
    return matchSize && matchColor
  })

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)
  const startIdx = (currentPage - 1) * productsPerPage
  const currentProducts = filteredProducts.slice(startIdx, startIdx + productsPerPage)

  const handleColorClick = (productId, color) => {
    setSelectedColors(prev => ({
      ...prev,
      [productId]: prev[productId] === color ? null : color,
    }))
  }

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
              {product.colors.map(color => (
                <span
                  key={color}
                  className={`color-dot ${selectedColors[product.id] === color ? 'active' : ''}`}
                  style={{
                    backgroundColor: color,
                    width: 15,
                    height: 15,
                    display: 'inline-block',
                    borderRadius: '50%',
                    marginRight: 5,
                    cursor: 'pointer',
                    border: selectedColors[product.id] === color ? '2px solid black' : '2px solid transparent'
                  }}
                  onClick={() => handleColorClick(product.id, color)}
                />
              ))}
            </div>
            <h4>{product.name}</h4>
            <p>⭐ {product.rating}</p>
            <p>
              <strong>${product.price}</strong>{' '}
              <span style={{ textDecoration: 'line-through' }}>${product.oldPrice}</span>
            </p>
            <AddToCartButton
              product={product}
              selectedColor="#FFA500"
              selectedSize="M"
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
