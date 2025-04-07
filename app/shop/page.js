"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

const shops = [
  { id: 1, name: "Male", image: "/images/m1.jpg", },
  { id: 2, name: "Female", image: "/images/f1.jpg",  },
  { id: 3, name: "Kids", image: "/images/k1.jpg",  },
  { id: 4, name: "Accessories", image: "/images/a1.jpg", },
  
];

export default function Shops() {
  const router = useRouter(); // Use Next.js router

  const handleRedirect = (id) => {
    router.push(`/shop/${id}`); // Redirect to the product page
  };

  return (
    <div className="shop-container">
      <h2>For Everyone</h2>
      <div className="shop-grid">
        {shops.map((shop) => (
          <div
            key={shop.id}
            className="shop-item"
            onClick={() => handleRedirect(shop.id)}
          >
            
              <img src={shop.image} alt={shop.name}  />
            
            <h3 className="mt-4 text-lg font-semibold">SHOP/{shop.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
