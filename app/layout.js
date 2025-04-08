"use client";

import Nav from "./components/Nav";
import Home from "./components/Body";
import "./globals.css";
import Footer from "./components/Footer";



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
        <Home />
        <Footer/>
      </body>
    </html>
  );
}
