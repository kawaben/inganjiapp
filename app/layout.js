"use client";

import Nav from "./components/Nav";
import Home from "./components/Body";
import "./globals.css";



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
        <Home />
      </body>
    </html>
  );
}
