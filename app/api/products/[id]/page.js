import { useRouter } from "next/router";
import Image from "next/image";

const products = [
  { id: 1, name: "Pen Art on White Tee", price: 15, image: "/images/product1.png", description: "A stylish white tee with pen art design." },
  { id: 2, name: "King of Clubs", price: 15, image: "/images/product2.jpg", description: "Unique club king graphic on premium cotton." },
  { id: 3, name: "Queen of Clubs (Color)", price: 15, image: "/images/product3.jpg", description: "Colorful queen of clubs t-shirt." },
  { id: 4, name: "I am King", price: 15, image: "/images/product4.jpg", description: "Bold statement tee for kings." },
  { id: 5, name: "Gta PK", price: 15, image: "/images/product5.jpg", description: "Graphic print inspired by streetwear culture." },
];

export default function ProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const product = products.find((p) => p.id === parseInt(id));

  if (!product) return <p>Product not found</p>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 p-8">
      <h2 className="text-4xl font-bold mb-4">{product.name}</h2>
      <Image src={product.image} alt={product.name} width={250} height={250} className="rounded-lg shadow-lg" />
      <p className="text-lg text-gray-700 mt-4">{product.description}</p>
      <p className="text-2xl font-semibold mt-2">${product.price.toFixed(2)}</p>
      <button className="mt-6 bg-black text-white px-6 py-2 rounded-md">Add to Cart</button>
    </div>
  );
}
