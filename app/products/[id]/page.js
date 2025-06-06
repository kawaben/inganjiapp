"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getProductByIdAcrossStores } from "../../lib/db";
import AddToCartButton from '../../components/AddToCartButton';
import '../../globals.css';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState({});
  const [selectedSize, setSelectedSize] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [quantity, setQuantity] = useState(1);
  


  useEffect(() => {
    if (!id) return;

    const loadProduct = async () => {
      const fetched = await getProductByIdAcrossStores(parseInt(id));
      console.log("Fetched ID:", id);

      if (fetched && fetched.images && typeof fetched.images === "object") {
        const imageEntries = Object.entries(fetched.images);

        setProduct(fetched);

        const firstImage = Object.values(fetched.images || {})[0] || '/logo.svg';
        setSelectedImage(firstImage);

      } else {
        setProduct(null);
      }

      setLoading(false);
    };

    loadProduct();
  }, [id]);

const handleColorClick = (color) => {
  setSelectedColors(prev => ({
    ...prev,
    [product.id]: prev[product.id] === color ? null : color,
  }));

  const image = product.images?.[color] 
    || Object.values(product.images || {})[0] 
    || '/logo.svg';

  setSelectedImage(image);
};



  const handleSizeClick = (productId, size) => {
    setSelectedSize(prev => ({
      ...prev,
      [productId]: prev[productId] === size ? null : size,
    }));
  };

  if (loading) return <p className="p-8 text-center">Loading...</p>;

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Product Not Found</h2>
        <p className="mt-2 text-gray-500">We couldn’t find the product you’re looking for.</p>
        <a
          href="/"
          className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          Go Back Home
        </a>
      </div>
    );
  }
  
  

  return (
    <div className="details-page">
      {/* Left: Product Image Gallery */}
      <div className="gallery">
        {/* Thumbnails */}
        {product.images && (
  <div className="thumbnail-list gap-4">
    {Object.entries(product.images).map(([colorHex, image], index) => (

              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className={`w-16 h-16 mb-3 object-cover cursor-pointer border rounded ${
                  selectedImage === image ? "border-[var(--primary)]" : "border-[var(--text)]"
                }`}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
        )}

        {/* Main Image */}
        {selectedImage && (
          <div className="main-image">
            <img src={selectedImage} alt="Selected Product" className="w-full object-contain" />
          </div>
        )}
      </div>

      {/* Right: Product Details */}
      <div className="item-details_class text-[var(--text)]">
        <h1 className="text-3xl font-bold mb-2 ">{product.name}</h1>

        <p className="text-xl font-semibold mb-2">${product.price.toFixed(2)}</p>
        <p className="text-sm text-[var(--highlight)] mb-4">Free Shipping for Members</p>

        {/* Color Options */}
        <div className="mb-4">
          <span className="block font-semibold mb-1">Colors:</span>
          <div className="flex gap-4 flex-wrap">
           {product.colors.map((color, i) => (
            <button
              key={i}
              onClick={() => handleColorClick(color)}
              className={`w-6 h-6 rounded-full cursor-pointer border-2 ${
                selectedColors[product.id] === color ? 'border-[var(--text)]' : 'border-[var(--secondary)]'
              }`}
              style={{ backgroundColor: color }}
            ></button>
          ))}

          </div>
        </div>

        {/* Size Options */}
        <div className="mb-4">
          <span className="block font-semibold mb-1">Size:</span>
          <div className="flex gap-2 flex-wrap">
            {product.sizes.map((size, i) => (
                    <button
                      key={i}
                      onClick={() => handleSizeClick(product.id, size)}
                      className={`flex px-3 py-1 items-center justify-center text-sm cursor-pointer border rounded ${
                        selectedSize[product.id] === size ? 'bg-[var(--text)] text-[var(--background)]' : 'text-[var(--text)] border-[var(--text)]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center gap-4 mb-6">
          <span className="font-semibold">Quantity:</span>
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1 border rounded cursor-pointer"
          >
            -
          </button>
          <span>{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-1 border rounded cursor-pointer"
          >
            +
          </button>
        </div>

        {/* Add to Bag */}
       <AddToCartButton
          product={product}
          selectedColor={selectedColors[product.id] || product.colors[0]}
          selectedSize={selectedSize[product.id]}
        />









      </div>
    </div>
  );
}
