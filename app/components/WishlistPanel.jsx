
import {
    TrashIcon,
  } from "@heroicons/react/24/solid";
import "../globals.css";
import { useStore } from '../context/StoreContext';


export default function WishlistPanel() {
      
      const { wishlist } = useStore();
      
      const { clearWishlist } = useStore();

      const { toggleWishlist } = useStore();


    return (
       <div className={`fixed top-28 right-0 h-3/4 rounded-md w-full  md:w-1/3 md:right-1  bg-[var(--background)] shadow-lg transition-transform duration-300 panel p-5 z-10  "translate-x-0" : "translate-x-full"`}>
                <h2 className="text-lg font-bold uppercase text-[var(--text)] mb-4">Your Wishlist ❤️</h2>
                <ul className="space-y-4">
                  {wishlist.length > 0 ? (
                    wishlist.map((item) => (
                      <li key={item.id} className="p-3 bg-[var(--background2)] rounded shadow-sm flex justify-between">
                        {item.name} {item.color}
                        <button onClick={() => toggleWishlist(item)} className="text-[var(--primary)]">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </li>
                    ))
                  ) : (
                    <p className="text-[var(--secondary)]">Your wishlist is empty.</p>
                  )}
                </ul>
                {wishlist.length > 0 && (
                  <button
                    onClick={clearWishlist}
                    className="mt-4 bg-[var(--primary)] text-[var(--text)] p-2 w-full rounded-md"
                  >
                    Clear All
                  </button>
                )}
              </div>
    );
  }
  