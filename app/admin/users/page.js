'use client';
import { useState, useEffect } from 'react';



export default function UserList() {
 const [users, setUsers] = useState([]);
const [selectedUser, setSelectedUser] = useState([]);

// Load users from localStorage on mount
useEffect(() => {
  const stored = localStorage.getItem('users');
  const parsedUsers = stored ? JSON.parse(stored) : [];
  setUsers(parsedUsers);
  setSelectedUser(parsedUsers[0] || null);
}, []);



  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 h-screen bg-gray-100">
      {/* User list */}
      <div className="col-span-2 border-r border-[#c9711a] bg-white p-4 overflow-y-auto">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700">Select group of users:</label>
          <select className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 ">
            <option>Students</option>
            <option>Teachers</option>
            <option>Alumni</option>
          </select>
          <input type="text" placeholder="Find a User" className="w-full p-3 border border-[#e08325] rounded-md  text-[#1b1403] placeholder-gray-700 mt-3"/>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {users.map((user) => (
            <li
              key={user.email}
              onClick={() => setSelectedUser(user)}
              className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-100 rounded"
            >
              <img src={user.image} alt={user.username} className="w-8 h-8 rounded-full" />
              <span className="font-medium">{user.firstname} {user.lastname}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Selected user detail */}
      <div className="col-span-1 p-8 bg-white">
        <div className="relative flex flex-col items-center text-center p-5 overflow-hidden">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${selectedUser.image}')` }}
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-white/30 backdrop-blur-sm" />

                {/* Content */}
                <div className="flex flex-col items-center justify-center h-full z-10">
                  <img src={selectedUser.image} alt={selectedUser.username} className="w-24 h-24 rounded-full shadow-md" />
                  <h2 className="text-xl font-semibold mt-4">{selectedUser.firstname} {selectedUser.lastname}</h2>
                  <p className="text-gray-800">{selectedUser.username}</p>
                </div>
             

          
        </div>
        <div className="mt-6 space-y-2">
          <div>
            <h4 className="font-bold text-gray-700">Bio:</h4>
            <p className="text-gray-600">{selectedUser.bio}</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-700">Address:</h4>
            <p className="text-gray-600">{selectedUser.location},{selectedUser.country}</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-700">Email Address:</h4>
            <p className="text-gray-600">{selectedUser.email}</p>
          </div>
          <div>
            <h4 className="font-bold text-gray-700">Phone Number:</h4>
            <p className="text-gray-600">{selectedUser.phone}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
