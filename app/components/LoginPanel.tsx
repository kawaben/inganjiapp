import { useState, useEffect } from "react";
import "../globals.css";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

// Type definitions
interface User {
  user_id: string;
  email: string;
  firstname: string;
  lastname: string;
  username: string;
  image: string;
  role?: string;
}

interface LoginPanelProps {
  onClose?: () => void; 
  onLoginSuccess?: (userData: User) => void;
  isAccountPanel?: boolean;
}

export default function LoginPanel({ onClose,onLoginSuccess, isAccountPanel = false }: LoginPanelProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, logout, user, isAuthenticated } = useUser();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");

  // Check initial auth state - only for account panel
useEffect(() => {
  if (isAccountPanel && !isAuthenticated) {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];
          login(data.user, token || '');
        }
      } catch (error) {
        console.error("Auth check error:", error);
      }
    };
    checkAuth();
  }
}, [login, isAccountPanel, isAuthenticated]);

// Updated handleAuthRequest with optional onSuccess callback
const handleAuthRequest = async (
  url: string,
  body: object,
  onSuccess?: () => void
) => {
  setIsLoading(true);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Request failed");
    }

    onSuccess?.();
    return data;
  } finally {
    setIsLoading(false);
  }
};

// Updated handleLogin
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  try {
    const data = await handleAuthRequest("/api/auth/login", { email, password });
    
    login(data.user, data.token);
    if (!isAccountPanel) {
      onClose?.();
      router.push("/user");
    }
  } catch (error) {
  console.error("Login error:", error);
  alert(
    error instanceof Error 
      ? error.message 
      : "Login failed. Please try again."
  );
}
};

// Updated handleSignup with proper form state
const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!email || !password) {
    alert("Please enter both email and password");
    return;
  }

  try {
    console.log("Attempting signup with:", { email, password });
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        firstname: firstname || "User",
        lastname: lastname || "Account",
        username: username || `user${Math.floor(Math.random() * 9000) + 1000}`,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error("Signup failed:", data);
      throw new Error(data.error || "Signup failed");
    }

    console.log("Signup successful:", data);
    login(data.user, data.token);
    
    if (!isAccountPanel) {
      onClose?.();
      router.push("/user");
    }
  } catch (error) {
  console.error("Signup error:", error);
  alert(
    error instanceof Error
      ? error.message
      : "Signup failed. Please check console for details."
  );
}
};



  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      logout();
      if (isAccountPanel && onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="fixed top-28 right-0 h-3/4 rounded-md w-full md:w-1/3 md:right-1 bg-[var(--background)] shadow-lg transition-transform duration-300 panel p-5 z-10">
      <h2 className="text-lg font-bold uppercase text-[var(--text)] mb-4">
        {isAccountPanel ? "Account" : isSignUp ? "Sign Up" : "Log In"}
      </h2>

      {!isAuthenticated ? (
        <form onSubmit={isSignUp ? handleSignup : handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-[var(--background2)] text-[var(--secondary)] placeholder-[var(--secondary)]"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-[var(--background2)] text-[var(--secondary)] placeholder-[var(--secondary)]"
            required
          />
          
          <button
            type="submit"
            className="w-full bg-[var(--primary)] text-[var(--foreground)] p-3 rounded-md cursor-pointer disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : isSignUp ? "Sign Up" : "Log In"}
          </button>
          <p className="text-sm text-[var(--secondary)] text-center">
            {isSignUp ? (
              <>
                Already have an account?{" "}
                <span className="underline cursor-pointer" onClick={() => setIsSignUp(false)}>
                  Log In
                </span>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <span className="underline cursor-pointer" onClick={() => setIsSignUp(true)}>
                  Sign Up
                </span>
              </>
            )}
          </p>
        </form>
      ) : (
        <div className="space-y-4">
          <p className="text-[var(--text)]">Welcome back, {user?.email}</p>
          <button
            className="w-full bg-[var(--secondary)] text-[var(--foreground)] p-3 rounded-md cursor-pointer"
            onClick={handleLogout}
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}