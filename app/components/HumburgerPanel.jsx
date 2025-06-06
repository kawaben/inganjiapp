import Link from "next/link";

export default function HumburgerPanel() {
    return (
      <div className={`fixed top-16 right-0 w-full md:w-1/3 h-screen bg-[var(--background)] shadow-lg transition-transform duration-300 panel p-5 z-10 "translate-x-0" : "translate-x-full"`}>
            
            <Link href="/shop/men" className="block py-2" onClick={() => setActivePanel(null)}>MEN</Link>
            <Link href="/shop/accessories" className="block py-2" onClick={() => setActivePanel(null)}>ACCESSORIES</Link>
            <Link href="/shop/women" className="block py-2" onClick={() => setActivePanel(null)}>WOMEN</Link>
            <Link href="/shop/kids" className="block py-2" onClick={() => setActivePanel(null)}>KIDS</Link>

          </div>
    );
  }
  