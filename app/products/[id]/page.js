"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

const products = [
  {
    id: 1,
    name: "Pen Art on White Tee",
    price: 15,
    images: ["/images/product1.png", "/images/product2.jpg", "/images/product3.jpg", "/images/product4.jpg", "/images/product5.jpg"],
    description: "A stylish white tee with pen art design.",
    colors: [{ name: "White", hex: "#fff" }, { name: "Black", hex: "#000" }],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 2,
    name: "King of Clubs",
    price: 15,
    images: ["/images/product2.jpg", "/images/product2b.jpg", "/images/product2c.jpg", "/images/product2d.jpg", "/images/product5.jpg"],
    description: "Unique club king graphic on premium cotton.",
    colors: [{ name: "White", hex: "#fff" }, { name: "Black", hex: "#000" }],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 3,
    name: "Queen of Clubs",
    price: 15,
    images: ["/images/product3.jpg", "/images/product3b.jpg", "/images/product1.png", "/images/product4.jpg", "/images/product5.jpg"],
    description: "Colorful queen of clubs t-shirt.",
    colors: [{ name: "White", hex: "#fff" }, { name: "Black", hex: "#000" }],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 4,
    name: "I am King",
    price: 15,
    images: ["/images/product5.jpg", "/images/product2.jpg", "/images/product3.jpg", "/images/product4.jpg", "/images/product1.png"],
    description: "Bold statement tee for kings.",
    colors: [{ name: "White", hex: "#fff" }, { name: "Black", hex: "#000" }],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 5,
    name: "Gta PK",
    price: 15,
    images: ["/images/product1.png", "/images/product2.jpg", "/images/product3.jpg", "/images/product4.jpg", "/images/product5.jpg"],
    description: "Graphic print inspired by streetwear culture.",
    colors: [{ name: "White", hex: "#fff" }, { name: "Black", hex: "#000" }],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
];

export default function ProductPage() {
  const { id } = useParams(); // Get product ID from URL
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) return <p>Product not found</p>;

  // ✅ Default image is now the first image of the selected product
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="details-page">
      {/* Left: Product Image Gallery */}
      <div className="gallery">
        <div className="thumbnail-list">
          {product.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className={`thumbnail ${selectedImage === image ? "selected" : ""}`}
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>
        <div className="main-image">
          <img src={selectedImage} alt="Selected Product" />
        </div>
      </div>

      {/* Right: Product Details */}
      <div className="item-details_class">
        <h1 className="item-name">{product.name}</h1>

        <div className="rating-price">
          <p className="price">${product.price.toFixed(2)}</p>
        </div>

        <p className="shipping-option">Free Shipping for Members</p>

        {/* Color Options */}
        <div className="color-selector">
          <span>Colors:</span>
          {product.colors.map((color, index) => (
            <div key={index} className="flex items-center gap-2">
              <span>{color.name}</span>
              <button className="color-btn" style={{ backgroundColor: color.hex }}></button>
            </div>
          ))}
        </div>

        {/* Size Options */}
        <div className="size-selector">
          <span>Size:</span>
          {product.sizes.map((size) => (
            <button key={size} className="size-btn">
              {size}
            </button>
          ))}
        </div>

        {/* Quantity Selector */}
        <div>
          <span>Quantity:</span>
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="size-btn">
            -
          </button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} className="size-btn">
            +
          </button>
        </div>

        {/* Add to Cart Button */}
        <button className="add-to-bag">Add to Bag</button>
      </div>
    </div>
  );
}
