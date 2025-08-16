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
import { useRouter } from "next/navigation";


// Type definitions
interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  image: string;
  role?: string;
}

export default function Navbar() {
  const pathname = usePathname();
  const [activePanel, setActivePanel] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  
  const { cart } = useStore();
  const { wishlist } = useStore();
  const { isAuthenticated, isLoading } = useUser();
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (pathname === '/user') {
      togglePanel(null);
    }
  }, [pathname]);

  const togglePanel = (panel) => {
    if (panel === 'account' && !isAuthenticated) {
      setShowLogin(true);
      setActivePanel(null);
    } else {
      setActivePanel((prev) => (prev === panel ? null : panel));
    }
  };

  const handleIconClick = (panelName) => {
    setActivePanel(activePanel === panelName ? null : panelName);
  };

  useEffect(() => {
      const fetchUser = async () => {
        try {
          const response = await fetch('/api/auth/me', {
            credentials: 'include'
          });
  
          if (!response.ok) {
            throw new Error('Not authenticated');
          }
  
          const data = await response.json();
          setUser(data.user);
        } catch (error) {
          console.error("Authentication error:", error);
          router.push('/');
        } 
      };
  
      fetchUser();
    }, [router]);
  

  if (isLoading) {
    return (
      <div className="fixed z-100 container mx-auto flex justify-between items-center max-w-full text-[var(--text)] bg-[var(--background)]">
        {/* Loading placeholder */}
        <div className="w-full h-16"></div>
      </div>
    );
  }

  return (
    <div className="fixed z-100 container mx-auto flex justify-between items-center max-w-full text-[var(--text)] bg-[var(--background)]">
      <Link href="/">
        <Image src="/logo.svg" alt="NOUVI RE Logo" width={120} height={40} priority />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex flex-1 justify-center space-x-12">
        <Link href="/shop/men"><p className='text-[var(--text)] hover:text-[var(--primary)] cursor-pointer'>MEN</p></Link>
        <Link href="/shop/accessories"><p className='text-[var(--text)] hover:text-[var(--primary)] cursor-pointer'>ACCESSORIES</p></Link>
        <Link href="/shop/women"><p className='text-[var(--text)] hover:text-[var(--primary)] cursor-pointer'>WOMEN</p></Link>
        <Link href="/shop/kids"><p className='text-[var(--text)] hover:text-[var(--primary)] cursor-pointer'>KIDS</p></Link>
      </div>

      <div className="flex gap-4 m-8 text-[var(--secondary)]">
        <NavbarIcon 
          icon={<FaSearch className="w-6 h-6 text-[var(--secondary)] hover:text-[var(--primary)] cursor-pointer"/>} 
          onClick={() => togglePanel('search')} 
        />
        <NavbarIcon 
          icon={<FaBell className="w-6 h-6 text-[var(--secondary)] hover:text-[var(--primary)] cursor-pointer"/>} 
          onClick={() => togglePanel('notifications')} 
        />
        <NavbarIcon 
          icon={
            <div className="relative">
              <FaHeart className="w-6 h-6 text-[var(--secondary)] hover:text-[var(--primary)] cursor-pointer"/>
              <span className="absolute -top-2 -right-2 bg-[#e08325] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {wishlist.length}
              </span>
            </div>
          } 
          onClick={() => togglePanel('wishlist')} 
        />
        <NavbarIcon
          icon={
            <div className="relative">
              <FaShoppingCart className="w-6 h-6 text-[var(--secondary)] hover:text-[var(--primary)] cursor-pointer" />
              <span className="absolute -top-2 -right-2 bg-[#e08325] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            </div>
          } 
          onClick={() => togglePanel('cart')}
        />
        
        {isAuthenticated ? (
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => togglePanel('account')}
          >
            <Link href="/user" className="flex items-center gap-2">
              <img
                src={user?.image || "/default-avatar.png"}
                alt="User Profile"
                className="rounded-full object-cover w-10 h-10"
                onError={(e) => {
                  e.currentTarget.src = '/default-avatar.png';
                }}
              />
            </Link>
          </div>
        ) : (
          <NavbarIcon
            icon={
              <FaUser className="w-6 h-6 text-[var(--secondary)] hover:text-[var(--primary)] cursor-pointer" />
            }
            onClick={() => setShowLogin(true)}
          />
        )}
        
        <button 
          onClick={() => handleIconClick("menu")} 
          className="md:hidden icon"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 hover:text-[var(--primary)] cursor-pointer"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Panels */}
      {activePanel === 'search' && <SearchPanel />}
      {activePanel === 'notifications' && <NotificationsPanel />}
      {activePanel === 'wishlist' && <WishlistPanel />}
      {activePanel === 'cart' && <CartPanel />}
      {activePanel === 'account' && isAuthenticated && <LoginPanel isAccountPanel={true} />}
      {showLogin && (
        <LoginPanel 
          onClose={() => setShowLogin(false)}
          onLoginSuccess={() => {
            setShowLogin(false);
            setActivePanel(null);
          }}
        />
      )}
      {activePanel === "menu" && <HumburgerPanel/>}
    </div>
  );
}