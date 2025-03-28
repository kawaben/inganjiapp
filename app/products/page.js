"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

const products = [
  { id: 1, name: "Pen Art on White Tee", price: 15, image: "/images/product1.png", bg: "bg-red-600" },
  { id: 2, name: "King of Clubs", price: 15, image: "/images/product2.jpg", bg: "bg-teal-600" },
  { id: 3, name: "Queen of Clubs", price: 15, image: "/images/product3.jpg", bg: "bg-blue-600" },
  { id: 4, name: "I am King", price: 15, image: "/images/product4.jpg", bg: "bg-orange-600" },
  { id: 5, name: "Gta PK", price: 15, image: "/images/product5.jpg", bg: "bg-green-600" },
];

export default function Products() {
  const router = useRouter(); // Use Next.js router

  const handleRedirect = (id) => {
    router.push(`/products/${id}`); // Redirect to the product page
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Shop Our Collection</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="p-4 rounded-lg shadow-lg cursor-pointer bg-red-100 hover:scale-105 transition"
            onClick={() => handleRedirect(product.id)}
          >
            <div className={`flex items-center justify-center rounded-lg ${product.bg}`}>
              <Image src={product.image} alt={product.name} layout="responsive" width={1200} height={675} className="object-contain rounded" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">{product.name}</h3>
            <p className="text-gray-700">${product.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
