// app/components/Nav.js
import Link from "next/link";
import { useState } from "react";

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="bg-red-900 p-5">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-yellow-600 text-4xl font-bold hover:text-yellow-300">
          NOUVI RE
        </Link>

        {/* Menu Items (visible on larger screens) */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="text-yellow-600 hover:text-yellow-300">
            Home
          </Link>
          <Link href="/about" className="text-yellow-600 hover:text-yellow-300">
            About
          </Link>
          <Link href="/contact" className="text-yellow-600 hover:text-yellow-300">
            Contact
          </Link>
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="md:hidden flex items-center">
          <button id="menu-toggle" onClick={() => setIsOpen(!isOpen)} className="text-yellow-600 hover:text-yellow-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu (hidden by default) */}
      <div id="mobile-menu" className={`md:hidden transition-all duration-300 ${isOpen ? "block" : "hidden"}`} >
        <Link
          href="/"
          className="block text-yellow-600 py-2 px-4 hover:text-yellow-300"
        >
          Home
        </Link>
        <Link
          href="/about"
          className="block text-yellow-600 py-2 px-4 hover:text-yellow-300"
        >
          About
        </Link>
        <Link
          href="/contact"
          className="block text-yellow-600 py-2 px-4 hover:text-yellow-300"
        >
          Contact
        </Link>
      </div>
    </nav>
  );
}
