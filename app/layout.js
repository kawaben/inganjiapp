"use client";

import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { StoreProvider } from './context/StoreContext';
import { UserProvider } from './context/UserContext';
import CartLoader from './components/CartLoader'; // ✅ Add this import

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <StoreProvider>
            <Navbar />

            
            <CartLoader /> 

            {children}

            <Footer />
          </StoreProvider>
        </UserProvider>
      </body>
    </html>
  );
}
