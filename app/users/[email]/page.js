'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { initDB, USERS_STORE } from '../../lib/db';
import {Instagram, DribbbleIcon,FacebookIcon} from "lucide-react"


export default function UserDetailPage() {
  const { email } = useParams(); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!email) return;

    const fetchUser = async () => {
      const db = await initDB();
      const tx = db.transaction(USERS_STORE, 'readonly');
      const store = tx.objectStore(USERS_STORE);
      const result = await store.get(decodeURIComponent(email));
      setUser(result);
    };

    fetchUser();
  }, [email]);

  if (!user) {
    return <p className="pt-30">Loading user details...</p>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 pt-26">
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-3xl overflow-hidden shadow-xl">
        {/* Left side (text) */}
        <div className="md:w-1/2 p-10 bg-white flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-black">
            {user?.firstname?.split(' ')[0] || user?.email}
            </span>{' '}
            <span className="text-gray-600">
            {user?.lastname?.split(' ')[0] || ''}
            </span>

          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {user?.bio}
          </p>
          <div className='flex flex-row items-center  gap-3'>
            
            <button className="bg-red-500 text-white px-6 py-2 rounded-full w-fit hover:bg-red-600">
                Say Hello
            </button>
            
            
            <div className="flex flex-row text-gray-500 text-xl  gap-2 cursor-pointer">
                <i className='hover:text-gray-700'><Instagram/></i>
                <i className='hover:text-gray-700'><DribbbleIcon/></i>
                <i className='hover:text-gray-700'><FacebookIcon/></i>
                
            </div>
          </div>
          
          <div className="mt-8 flex space-x-6 text-gray-400 text-sm">
            <span className="font-bold">CodeLab</span>
            <span>hexa</span>
            <span>goldline</span>
          </div>
        </div>

        {/* Right side (image) */}
        <div className="md:w-1/2 bg-black">
          <img
            src={user.image || "/logo.svg"}
            alt={user.name}
            className="object-cover w-full h-full"
          />
        </div>
      </div>
    </div>
  );
}
