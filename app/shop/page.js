"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

const shops = [
  { id: 1, type:"men",name: "Male", image: "/images/m1.jpg", },
  { id: 2, type:"women",name: "Female", image: "/images/f1.jpg",  },
  { id: 3, type:"kids",name: "Kids", image: "/images/k1.jpg",  },
  { id: 4, type:"accessories",name: "Accessories", image: "/images/a1.jpg", },
  
];

export default function Shops() {
  const router = useRouter(); 

  const handleRedirect = (id) => {
    router.push(`/shop/${id}`); 
  };

  return (
    <div className="shop-container text-[var(--text)]">
      <h2>For Everyone</h2>
      <div className="shop-grid">
        {shops.map((shop) => (
          <div
            key={shop.id}
            className="shop-item"
            onClick={() => handleRedirect(shop.type)}
          >
            
              <img src={shop.image} alt={shop.name}  />
            
            <h3 className="mt-4 text-lg font-semibold text-[var(--text)]">SHOP/{shop.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
