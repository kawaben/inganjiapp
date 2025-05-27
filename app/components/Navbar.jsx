'use client';
import { useEffect, useState } from 'react';
import { FaSearch, FaBell, FaHeart, FaShoppingCart, FaUser } from 'react-icons/fa';
import Link from "next/link";
import { usePathname } from 'next/navigation';
import Image from "next/image";
import NavbarIcon from './NavbarIcon';
import NotificationsPanel from './NotificationsPanel';
import SearchPanel from './SearchPanel';
import CartPanel from './CartPanel';
import LoginPanel from './LoginPanel';
import WishlistPanel from './WishlistPanel';
import HumburgerPanel from './HumburgerPanel';
import { useStore } from '../context/StoreContext';
import { useUser } from '../context/UserContext';

export default function Navbar() {
  const pathname = usePathname();
  const [activePanel, setActivePanel] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  
  const { cart } = useStore();
  const { wishlist } = useStore();
 
 const { user, login } = useUser(); 


  useEffect(() => {
      if (pathname === '/user') {
        togglePanel(null);
      }
    }, [pathname]);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      login(JSON.parse(storedUser));
    }
  }, []);

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
        <NavbarIcon 
                    icon={
                      <div className="relative">
                        <FaHeart className="w-6 h-6 text-[#1b1403] hover:text-[#e08325]"/>
                        <span className="absolute -top-2 -right-2 bg-[#e08325] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                          {wishlist.length}
                        </span>

                      </div>
                          } onClick={() => togglePanel('wishlist')} />
        <NavbarIcon
                    icon={
                      <div className="relative">
                        <FaShoppingCart className="w-6 h-6 text-[#1b1403] hover:text-[#e08325]" />
                        <span className="absolute -top-2 -right-2 bg-[#e08325] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                          {cart.length}
                        </span>
                      </div>
                    } onClick={() => togglePanel('cart')}
                  />
      {user ?  (
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => togglePanel('account')}
        >
          <Link href="/user" className="flex items-center gap-2">
            <Image
            src={user.image || '/images/f1-blue.jpg'}
            alt="User Profile"
            width={36}
            height={36}
            className="rounded-full"
            />
          
          </Link>
          
        </div>
      ) : (
        <NavbarIcon
          icon={
            <FaUser className="w-6 h-6 text-[#1b1403] hover:text-[#e08325]" />
          }
          onClick={() => togglePanel('account')}
        />
        )}
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
