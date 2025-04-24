'use client';
import { useEffect, useState } from 'react';
import { FaSearch, FaBell, FaHeart, FaShoppingCart, FaUser } from 'react-icons/fa';
import Link from "next/link";
import Image from "next/image";
import NavbarIcon from './NavbarIcon';
import NotificationsPanel from './NotificationsPanel';
import SearchPanel from './SearchPanel';
import CartPanel from './CartPanel';
import LoginPanel from './LoginPanel';
import WishlistPanel from './WishlistPanel';
import HumburgerPanel from './HumburgerPanel';


export default function Navbar() {
  const [activePanel, setActivePanel] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const storedLogin = localStorage.getItem('isLoggedIn');
    if (storedLogin === 'true') setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  const togglePanel = (panel) => {
    setActivePanel((prev) => (prev === panel ? null : panel));
    };

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
    };

    const handleIconClick = (panelName) => {
      setActivePanel(activePanel === panelName ? null : panelName);
    };
  return (
    <div className="fixed z-100 container mx-auto flex justify-between items-center max-w-full text-[#1b1403]  bg-[#f8e2d2]">
      <Link href="/">
          <Image src="/logo.svg" alt="NOUVI RE Logo" width={120} height={40} priority />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex flex-1 justify-center space-x-12">
          <Link href="/shop/men">MEN</Link>{' '}
          <Link href="/shop/accessories">ACCESSORIES</Link>
          <Link href="/shop/women">WOMEN</Link>
          <Link href="/shop/kids">KIDS</Link>
        </div>

       

      <div className="flex gap-4 m-8 text-[#1b1403]">
        <NavbarIcon icon={<FaSearch className="w-6 h-6 text-[#1b1403] hover:text-[#e08325]"/>} onClick={() => togglePanel('search')} />
        <NavbarIcon icon={<FaBell className="w-6 h-6 text-[#1b1403] hover:text-[#e08325]"/>} onClick={() => togglePanel('notifications')} />
        <NavbarIcon icon={<FaHeart className="w-6 h-6 text-[#1b1403] hover:text-[#e08325]"/>} onClick={() => togglePanel('wishlist')} />
        <NavbarIcon icon={<FaShoppingCart className="w-6 h-6 text-[#1b1403] hover:text-[#e08325]"/>} onClick={() => togglePanel('cart')} />
        <NavbarIcon icon={<FaUser className="w-6 h-6 text-[#1b1403] hover:text-[#e08325]"/>} onClick={() => togglePanel('account') } />
        <button onClick={() => handleIconClick("menu")} className="md:hidden icon">
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
        {/* Humburger Menu */}
        

      {activePanel === 'search' && <SearchPanel />}
      {activePanel === 'notifications' && <NotificationsPanel />}
      {activePanel === 'wishlist' && <WishlistPanel />}
      {activePanel === 'cart' && <CartPanel />}
      {activePanel === 'account' && <LoginPanel setIsLoggedIn={setIsLoggedIn} />}
      {showLogin && <LoginPanel onClose={() => setShowLogin(false)} onLogin={handleLogin} />}
      {activePanel === "menu" && <HumburgerPanel/>}

      
    </div>
  );
}
