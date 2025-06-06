import { useState, useEffect } from "react";
import "../globals.css";
import { useRouter } from "next/navigation";
import { getUserByEmail, addUser } from '../lib/db';
import { useUser } from '../context/UserContext';


export default function LoginPanel() {

 
  const defaultUsers = [
  { email: "kabagema@nuovire.com", password: "king" },
  { email: "keza@nuovire.com", password: "tracy" },
];

const generateToken = () => {
  return 'token_' + Math.random().toString(36).substr(2);
};


const [newUsers, setNewUsers] = useState(() => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("users");
    return stored ? JSON.parse(stored) : defaultUsers;
  }
  return defaultUsers;
});

useEffect(() => {
  if (typeof window !== "undefined") {
    localStorage.setItem("users", JSON.stringify(newUsers));
  }
}, [newUsers]);

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [isLoggedIn, setIsLoggedIn] = useState(false);
const [isSignUp, setIsSignUp] = useState(false);

const router = useRouter();



useEffect(() => {
  const loggedInUser = localStorage.getItem("loggedInUser");
  if (loggedInUser) {
    setIsLoggedIn(true);
  }
}, []);

const { login, logout } = useUser(); 

const handleLogin = async (e) => {
  e.preventDefault();
  const user = await getUserByEmail(email);

  if (user && user.password === password) {
    login(user); 
    localStorage.setItem("token", generateToken());
    router.push("/user");
  } else {
    alert("Invalid credentials");
  }
};



const handleSignup = async (e) => {
  e.preventDefault();
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    alert("User already exists");
  } else {
    const newUser = { email, password };
    await addUser(newUser);
    login(newUser); 
    router.push("/user");
  }
};




  


    return (
      <div className={`fixed top-16 right-0 w-full md:w-1/3 h-screen bg-[var(--background)] shadow-lg transition-transform duration-300 panel p-5 z-10 "translate-x-0" : "translate-x-full"`}>
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
                      <span
                        className="underline cursor-pointer"
                        onClick={() => setIsSignUp(false)}
                      >
                        Log In
                      </span>
                    </>
                  ) : (
                    <>
                      Don't have an account?{" "}
                      <span
                        className="underline cursor-pointer"
                        onClick={() => setIsSignUp(true)}
                      >
                        Sign Up
                      </span>
                    </>
                  )}
                </p>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-[var(--text)]">Welcome back, {JSON.parse(localStorage.getItem("loggedInUser"))?.email}</p>
                <button
                  className="w-full bg-[var(--secondary)] text-[var(--foreground)] p-3 rounded-md cursor-pointer"
                  onClick={() => {
                    logout
                  }}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
    );
  }
  