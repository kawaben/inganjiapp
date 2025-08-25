'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  user_id: string;
  email: string;
  firstname: string;
  lastname?: string;
  username?: string;
  image?: string;
  phone?: string;
  location?: string;
  country?: string;
  bio?: string;
  gender?: "male" | "female" | "prefer_not_to_say" | undefined;
  account_status?: string,
  createdAt?: string,
  email_verified: boolean,
  display_name?: string,
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

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
      setIsAuthenticated(true);
      return data.user;
    } catch (error) {
      console.error("Authentication error:", error);
      setUser(null);
      setIsAuthenticated(false);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      await fetchUser();
      setIsLoading(false);
    };
    
    initializeAuth();
  }, []);

  const checkAuth = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/check');
      const data = await response.json();
      
      if (data.isAuthenticated) {
        await fetchUser();
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string) => {
    await fetchUser();
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      setIsAuthenticated(false);
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};