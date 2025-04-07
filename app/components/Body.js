import Image from "next/image";
import "../globals.css";
import Products from "../products/page";
import Shops from "../shop/page";

export default function Home() {
    return (
      <div>
        {/* Parallax Section 1 */}
        <div className="parallax bg-image-1">
            
          <h1 className="text-4xl text-white font-bold">Welcome to NOUVI RE</h1>
        </div>
  
        {/* Content Section */}
        <div className="content">
          <Products/>
        </div>
        <div className="content">
          <Shops/>
        </div>
  
        {/* Parallax Section 2 */}
        <div className="parallax bg-image-2">
          <h2 className="text-3xl text-white font-bold">New Arrivals</h2>
        </div>
  
        {/* More Content */}
        <div className="content">
          <p>Discover the perfect style for any occasion with our exclusive collection.</p>
        </div>
      </div>
    );
  }
  