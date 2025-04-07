"use client";



export default function ProductCard({ product }) {
    return (
      <div style={{ border: '1px solid #ccc', padding: 10, width: 200 }}>
        <img src={product.image} alt={product.name} width="100%" />
        <div>
          {product.colors.map((color, i) => (
            <span key={i} style={{ backgroundColor: color, width: 15, height: 15, display: 'inline-block', borderRadius: '50%', marginRight: 5 }} />
          ))}
        </div>
        <h4>{product.name}</h4>
        <p>⭐ {product.rating}</p>
        <p>
          <strong>${product.price}</strong>{' '}
          <span style={{ textDecoration: 'line-through' }}>${product.oldPrice}</span>
        </p>
      </div>
    )
  }
  