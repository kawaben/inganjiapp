"use client";

import Nav from "./components/Nav";
import Home from "./components/Body";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { StoreProvider } from './context/StoreContext';


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          <Navbar />
        
          {children}
          
          <Footer/>
        </StoreProvider>
      </body>
    </html>
  );
}
