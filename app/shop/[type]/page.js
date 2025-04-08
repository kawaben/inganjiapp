'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import Pagination from '@/app/components/Pagination'
import './style.css'

const allProducts = {
  men: [
    { id: 1, name: 'Product 1', image: '/images/m1.jpg', price: 25.99, oldPrice: 30.99, rating: 4.5, colors: ['#FFA500', '#008000', '#0000FF'] },
    { id: 2, name: 'Product 2', image: '/images/m2.jpg', price: 25.99, oldPrice: 30.99, rating: 4.5, colors: ['#FFA500', '#008000', '#0000FF'] },
    { id: 3, name: 'Product 3', image: '/images/m3.jpg', price: 25.99, oldPrice: 30.99, rating: 4.5, colors: ['#FFA500', '#008000', '#0000FF'] },
    { id: 4, name: 'Product 4', image: '/images/m1.jpg', price: 25.99, oldPrice: 30.99, rating: 4.5, colors: ['#FFA500', '#008000', '#0000FF'] },
    { id: 5, name: 'Product 5', image: '/images/m1.jpg', price: 25.99, oldPrice: 30.99, rating: 4.5, colors: ['#FFA500', '#008000', '#0000FF'] },
  ],
  women: [
    { id: 1, name: 'Dress', image: '/images/f1.jpg', price: 40, oldPrice: 55, rating: 4.7, colors: ['#FF69B4', '#8A2BE2'] },
    { id: 2, name: 'Dress 2', image: '/images/product3.jpg', price: 40, oldPrice: 55, rating: 4.7, colors: ['#FF69B4', '#8A2BE2'] },
  ],
  kids: [
    { id: 1, name: 'Complete', image: '/images/k1.jpg', price: 40, oldPrice: 55, rating: 4.7, colors: ['#FF69B4', '#8A2BE2'] },
    { id: 2, name: 'Dress', image: '/images/product3.jpg', price: 40, oldPrice: 55, rating: 4.7, colors: ['#FF69B4', '#8A2BE2'] },
  ],
  accessories: [
    { id: 1, name: 'Glasses', image: '/images/a1.jpg', price: 40, oldPrice: 55, rating: 4.7, colors: ['#FF69B4', '#8A2BE2'] },
    { id: 2, name: 'Hat', image: '/images/a5.jpg', price: 40, oldPrice: 55, rating: 4.7, colors: ['#FF69B4', '#8A2BE2'] },
    { id: 3, name: 'Hat 2', image: '/images/a6.jpg', price: 40, oldPrice: 55, rating: 4.7, colors: ['#FF69B4', '#8A2BE2'] },
  ],
}

export default function CategoryPage() {
  const { type } = useParams()
  const products = allProducts[type] || []

  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 3
  const totalPages = Math.ceil(products.length / productsPerPage)

  const startIdx = (currentPage - 1) * productsPerPage
  const currentProducts = products.slice(startIdx, startIdx + productsPerPage)

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
            <div className="size-option" key={size}>{size}</div>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid-container">
        <div className="product-grid">
          {currentProducts.map(product => (
            <div key={product.id} className="product-grid-images">
              <img src={product.image} alt={product.name} />
              <div className="color-dots">
                {product.colors.map((color, i) => (
                  <span
                    key={i}
                    style={{
                      backgroundColor: color,
                      width: 15,
                      height: 15,
                      display: 'inline-block',
                      borderRadius: '50%',
                      marginRight: 5,
                      cursor: 'pointer'
                    }}
                  />
                ))}
              </div>
              <h4>{product.name}</h4>
              <p>⭐ {product.rating}</p>
              <p>
                <strong>${product.price}</strong>{' '}
                <span style={{ textDecoration: 'line-through' }}>${product.oldPrice}</span>
              </p>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}
