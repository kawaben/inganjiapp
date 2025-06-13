import { useState, useEffect } from "react";
import "../globals.css";
import { useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";

export default function LoginPanel() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const { login, logout } = useUser();

  //useEffect(() => {
    //const storedUser = localStorage.getItem("loggedInUser");
    //if (storedUser) {
      //login(JSON.parse(storedUser));
      //setIsLoggedIn(true);
    //}
  //}, []);

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include" 
    });

    const data = await res.json();

    if (res.ok) {

      setIsLoggedIn(true);
      router.push("/user");
    } else {
      alert(data.error || "Login failed");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong");
  }
};

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          firstname: "First",
          lastname: "Last",
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("loggedInUser", JSON.stringify(data));
        login(data); // context update
        setIsLoggedIn(true);
        router.push("/user");
      } else {
        alert(data.error || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong");
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    setIsLoggedIn(false);
  };

 // const loggedInEmail = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("loggedInUser"))?.email : "";

  return (
    <div className="fixed top-28 right-0 h-3/4 rounded-md w-full md:w-1/3 md:right-1 bg-[var(--background)] shadow-lg transition-transform duration-300 panel p-5 z-10">
      <h2 className="text-lg font-bold uppercase text-[var(--text)] mb-4">Account</h2>

      {!isLoggedIn ? (
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
            className="w-full bg-[var(--primary)] text-[var(--foreground)] p-3 rounded-md cursor-pointer"
          >
            {isSignUp ? "Sign Up" : "Log In"}
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
          <p className="text-[var(--text)]">Welcome back,</p>
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
