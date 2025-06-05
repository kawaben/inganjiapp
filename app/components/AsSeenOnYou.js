'use client'; // for Next.js 13+ app directory

import { useState } from 'react';

const slides = [
  {
    image: '/images/m1.jpg',
    username: '@kabagemabenj',
  },
  {
    image: '/images/f1.jpg',
    username: '@fashionlover',
  },
  {
    image: '/images/k1.jpg',
    username: '@streetstyleguru',
  },
];

export default function Slideshow() {
  const [index, setIndex] = useState(0);

  const prevSlide = () => {
    setIndex((index - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setIndex((index + 1) % slides.length);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h2 className="text-2xl font-semibold mb-2">As Seen On You</h2>
      <p className="mb-6 text-[var(--secondary)]">Show us how you #LiveTheThrone</p>

      <div className="flex items-center justify-center gap-4">
        <button onClick={prevSlide} className="text-2xl cursor-pointer">{'<'}</button>

        <div className="slides">
          <img src={slides[index].image} alt="Look" className="h-72 object-contain" />
          <p className="mt-2 text-[var(--text)]">{slides[index].username}</p>
        </div>

        <button onClick={nextSlide} className="text-2xl cursor-pointer">{'>'}</button>
      </div>

      <button className="mt-6 bg-[var(--primary)] text-[var(--text)] py-2 px-6 rounded hover:bg-[var(--hover)] cursor-pointer transition">
        Add Your Photo
      </button>
    </div>
  );
}
