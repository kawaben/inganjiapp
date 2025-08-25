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
  account_status?: string;
  createdAt?: string;
  email_verified: boolean;
  display_name?: string;
  theme_preference?: "light" | "dark" | "system";
}

interface UserContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  theme: "light" | "dark" | "system"; 
  setTheme: (theme: "light" | "dark" | "system") => Promise<void>; 
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [theme, setThemeState] = useState<"light" | "dark" | "system">("system");
  const router = useRouter();

  // Apply theme to document
  const applyTheme = (theme: "light" | "dark" | "system") => {
    let effectiveTheme = theme;
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches 
        ? 'dark' 
        : 'light';
      effectiveTheme = systemTheme;
    }
    
    document.documentElement.setAttribute('data-theme', effectiveTheme);
    
    // Also set the class for compatibility
    if (effectiveTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as "light" | "dark" | "system" | null;
    if (savedTheme) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('system');
    }
  }, []);

  // Listen for system theme changes when theme is set to 'system'
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

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
      
      // Set theme from user preference if available
      if (data.user.theme_preference) {
        setThemeState(data.user.theme_preference);
        applyTheme(data.user.theme_preference);
        localStorage.setItem('theme', data.user.theme_preference);
      }
      
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

  const setTheme = async (newTheme: "light" | "dark" | "system") => {
    setThemeState(newTheme);
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    // Save to database if user is authenticated
    if (user) {
      try {
        const response = await fetch(`/api/users/${user.user_id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ theme_preference: newTheme }),
          credentials: 'include',
        });

        if (!response.ok) {
          console.error('Failed to save theme preference to database');
        }
      } catch (error) {
        console.error('Failed to save theme preference:', error);
      }
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
    theme,
    setTheme,
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