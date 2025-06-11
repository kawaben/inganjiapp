'use client';
import { useState, useEffect } from 'react';

import {getAllUsers} from '../../lib/db'


export default function UserList() {
 const [users, setUsers] = useState([]);
const [selectedUser, setSelectedUser] = useState(null);

useEffect(() => {
  const fetchUsersFromDB = async () => {
    const allUsers = await getAllUsers(); 
    setUsers(allUsers);
    setSelectedUser(allUsers[0] || null);
  };

  fetchUsersFromDB();
}, []);



  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 h-screen">
      {/* User list */}
      <div className="col-span-2 border-r border-[var(--border)]  p-4 overflow-y-auto">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-[var(--text)]">Select group of users:</label>
          <select className="mt-1 w-full bg-[var(--background)] text-[var(--secondary)] rounded-md px-3 py-2 ">
            <option>Students</option>
            <option>Teachers</option>
            <option>Alumni</option>
          </select>
          <input type="text" placeholder="Find a User" className="w-full p-3 bg-[var(--background)] rounded-md  text-[var(--text)] placeholder-[var(--secondary)] mt-3"/>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <li
              key={user.email}
              onClick={() => setSelectedUser(user)}
              className="flex items-center gap-3 p-2 cursor-pointer hover:bg-[var(--background)] text-[var(--secondary)] rounded"
            >
              <img src={user.image || 'user.svg'} alt={user.username} className="w-8 h-8 rounded-full" />
              <span className="font-medium">{user.firstname && user.lastname ? `${user.firstname} ${user.lastname}`
                                                                              : user.email}
                                                                            </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Selected user detail */}
      <div className="col-span-1 p-8 ">
        <div className="relative flex flex-col items-center text-center p-5 overflow-hidden">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${selectedUser?.image || 'user.svg'}')` }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />

                {/* Content */}
                <div className="flex flex-col items-center justify-center h-full z-10">
                  <img src={selectedUser?.image || 'user.svg'} alt={selectedUser?.username} className="w-24 h-24 rounded-full shadow-md" />
                  <h2 className="text-xl font-semibold mt-4">{selectedUser?.firstname} {selectedUser?.lastname}</h2>
                  <p className="text-[var(--secondary)]">{selectedUser?.username}</p>
                </div>
             

          
        </div>
        <div className="mt-6 space-y-2">
          <div>
            <h4 className="font-bold text-[var(--text)]">Bio:</h4>
            <p className="text-[var(--secondary)]">{selectedUser?.bio}</p>
          </div>
          <div>
            <h4 className="font-bold text-[var(--text)]">Address:</h4>
            <p className="text-[var(--secondary)]">{selectedUser?.location || 'No Location Provided'},{selectedUser?.country}</p>
          </div>
          <div>
            <h4 className="font-bold text-[var(--text)]">Email Address:</h4>
            <p className="text-[var(--secondary)]">{selectedUser?.email}</p>
          </div>
          <div>
            <h4 className="font-bold text-[var(--text)]">Phone Number:</h4>
            <p className="text-[var(--secondary)]">{selectedUser?.phone || 'No Phone Number Provided'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
