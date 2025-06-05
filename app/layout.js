"use client";

import "./globals.css";
import { ThemeProvider } from 'next-themes';
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { StoreProvider } from './context/StoreContext';
import { UserProvider } from './context/UserContext';
import CartLoader from './components/CartLoader'; 

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider attribute="class">
            <UserProvider>
            <StoreProvider>
              <Navbar />

              
              <CartLoader /> 

              {children}

              <Footer />
            </StoreProvider>
          </UserProvider>
        </ThemeProvider>
        
      </body>
    </html>
  );
}
