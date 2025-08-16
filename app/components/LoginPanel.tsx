import { useState, useEffect } from "react";
import "../globals.css";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

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

  // Check initial auth state - only for account panel
useEffect(() => {
  if (isAccountPanel && !isAuthenticated) {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/check", {
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

 const handleLogin = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      // Update to pass both user and token
      login(data.user, data.token); // Pass both arguments
      if (!isAccountPanel && onClose) {
        onClose();
      }
      if (!isAccountPanel) {
        router.push("/user");
      }
    } else {
      alert(data.error || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong");
  } finally {
    setIsLoading(false);
  }
};

const handleSignup = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        firstname: "First",
        lastname: "Last",
        username: "Username",
      }),
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      // Update to pass both user and token
      login(data.user, data.token);
      if (!isAccountPanel && onClose) {
        onClose();
      }
      if (!isAccountPanel) {
        router.push("/user");
      }
    } else {
      alert(data.error || "Signup failed");
    }
  } catch (error) {
    console.error("Signup error:", error);
    alert("Something went wrong");
  } finally {
    setIsLoading(false);
  }
};

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      logout();
      // Close the panel after logout if it's the account panel
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