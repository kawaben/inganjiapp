// app/components/Nav.js
import Link from "next/link";
import { useState } from "react";
import { MagnifyingGlassIcon, BellIcon, HeartIcon, ShoppingBagIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
// app/layout.js or app/page.js
import '../globals.css';



export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full p-3">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.svg" alt="NOUVI RE Logo" width={120} height={40} priority />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1   justify-center space-x-12">
          <Link href="/men">MEN</Link>
          <Link href="/accessories" >ACCESSORIES</Link>
          <Link href="/women" >WOMEN</Link>
          <Link href="/kids" >KIDS</Link>
        </div>

        {/* Menu Icons */}
        <div className="flex items-center space-x-6">
          <Link href="/search" >
            <MagnifyingGlassIcon className="w-6 h-6" />
          </Link>
          <Link href="/notifications" >
            <BellIcon className="w-6 h-6" />
          </Link>
          <Link href="/favorites" >
            <HeartIcon className="w-6 h-6" />
          </Link>
          <Link href="/cart" >
            <ShoppingBagIcon className="w-6 h-6" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden" 
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 hover:text-[#e08325]"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden transition-all duration-300">
          <Link href="/men" className="block" >MEN</Link>
          <Link href="/accessories" className="block" >ACCESSORIES</Link>
          <Link href="/women" className="block" >WOMEN</Link>
          <Link href="/kids" className="block" >KIDS</Link>
        </div>
      )}
    </nav>
  );
}
