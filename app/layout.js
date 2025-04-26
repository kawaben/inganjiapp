"use client";

import Nav from "./components/Nav";
import Home from "./components/Body";
import "./globals.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
      
        {children}
        
        <Footer/>
      </body>
    </html>
  );
}
