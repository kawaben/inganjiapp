'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserByEmail } from '../lib/db';
import { User, ShoppingCart, Heart, Bell, Settings, ClipboardList, LogOut } from 'lucide-react';
import Profile from './Myprofile/page';
import Cart from './Cart/page';
import Wishlist from './Wishlist/page';
import Notifications from './Notifications/page';
import Setting from './Settings/page';
import Orders from './orders/page';

// Type definitions
interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
  role?: string;
  username?: string;
  phone?: string;
  location?: string;
  country?: string;
  bio?: string;
  image?: string;
}

type ActiveSection = 
  | 'My Profile'
  | 'Cart'
  | 'Wishlist'
  | 'Notifications'
  | 'Setting'
  | 'Orders';

export default function UserPage() {
  const [activeSection, setActiveSection] = useState<ActiveSection>('My Profile');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserFromDB = async () => {
      const email = localStorage.getItem('loggedInUserEmail');

      if (!email) {
        router.push('/login');
        return;
      }

      const dbUser = await getUserByEmail(email);

      if (!dbUser) {
        router.push('/login');
        return;
      }

      setUser(dbUser);
      setLoading(false);
    };

    fetchUserFromDB();
  }, [router]);

  const handleLogout = async () => {
    try {
      // Remove token/email from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('loggedInUserEmail');

      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <p>Redirecting to login...</p>
      </div>
    );
  }

  const navItems = [
    { section: 'My Profile', icon: <User size={18} /> },
    { section: 'Cart', icon: <ShoppingCart size={18} /> },
    { section: 'Notifications', icon: <Bell size={18} /> },
    { section: 'Wishlist', icon: <Heart size={18} /> },
    { section: 'Setting', icon: <Settings size={18} /> },
    { section: 'Orders', icon: <ClipboardList size={18} /> },
  ] as const;

  return (
    <div className="min-h-screen bg-[var(--background)] p-2">
      <div className="flex flex-col md:flex-row bg-[var(--background2)] rounded shadow mt-30">
        {/* Sidebar */}
        <aside className="w-full md:w-64 rounded p-4 pt-6">
          <ul className="space-y-3">
            {navItems.map(({ section, icon }) => (
              <li
                key={section}
                className={`flex items-center gap-3 px-4 py-2 rounded-md transition cursor-pointer hover:bg-[var(--secondary)] ${
                  activeSection === section
                    ? 'text-[var(--primary)] font-semibold'
                    : 'text-[var(--text)]'
                }`}
                onClick={() => setActiveSection(section)}
              >
                {icon} {section}
              </li>
            ))}
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 rounded-md text-[var(--hover)] hover:bg-[var(--secondary)] cursor-pointer transition w-full"
              >
                <LogOut size={18} />
                Log Out
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          {activeSection === 'My Profile' && <Profile user={user} />}
          {activeSection === 'Cart' && <Cart />}
          {activeSection === 'Wishlist' && <Wishlist />}
          {activeSection === 'Notifications' && <Notifications />}
          {activeSection === 'Setting' && <Setting />}
          {activeSection === 'Orders' && <Orders />}
        </main>
      </div>
    </div>
  );
}
