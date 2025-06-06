'use client';

import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useStore } from '../context/StoreContext';
import { useUser } from '../context/UserContext';

export default function WishlistButton({ product,selectedColor, selectedSize }) {
  const { user } = useUser();
  const { wishlist, setWishlist } = useStore();

  if (!user) return null; 

  const fullItem = { ...product, userEmail: user.email };

  const isInWishlist = wishlist.some(
    (w) =>
      w.id === fullItem.id &&
      w.color === selectedColor &&
      w.size === selectedSize &&
      w.userEmail === fullItem.userEmail
  );

  const toggleWishlist = async () => {
    if (!user?.email) return;

    if (isInWishlist) {
      await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullItem),
      });
      
      setWishlist(
        wishlist.filter(
          (w) =>
            !(
              w.id === fullItem.id &&
              w.color === fullItem.color &&
              w.size === fullItem.size &&
              w.userEmail === fullItem.userEmail
            )
        )
      );
    } else {
      await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullItem),
      });
      setWishlist([...wishlist, fullItem]);
    }
  };

  return (
    <button onClick={toggleWishlist} className='cursor-pointer'>
      {isInWishlist ? (
        <FaHeart className="text-[var(--primary)]" />
      ) : (
        <FaRegHeart className="text-[var(--primary)]" />
      )}
    </button>
  );
}
