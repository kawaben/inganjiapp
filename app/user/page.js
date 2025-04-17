"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import '../globals.css';

export default function UserPage() {

  const [activeSection, setActiveSection] = useState("My Profile");


  const [user, setUser] = useState({
      firstname: "Jack",
      lastname: "Adams",
      username: "JD",
      email: "jackadams@gmail.com",
      phone: "(213) 555-1234",
      bio: "Product Designer",
      location: "Los Angeles, California, USA",
      country: "United States of America",
      state: "California, USA",
      image: "https://randomuser.me/api/portraits/men/92.jpg",
    });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(
    
    {
    firstname: "",
    lastname: "", 
    username: "",
    image: "",
    phone: "",
    location: "",
    country: "",
    bio: "",
  });

  const router = useRouter();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      router.push("/");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    router.push("/");
  };

  const openEditModal = () => {
    setFormData({
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      username: user.username || "",
      phone: user.phone || "",
      location: user.location || "",
      country: user.country || "",
      image: user.image || "",
      bio: user.bio || "",
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
  
    // DEBUG: Log current users before updating
    console.log("Before update:", storedUsers);
  
    // Find and update the specific user
    const updatedUsers = storedUsers.map((u) =>
      u.email === user.email ? { ...u, ...formData } : u
    );
  
    // DEBUG: Log updated users
    console.log("After update:", updatedUsers);
  
    // Save updated list back to localStorage
    localStorage.setItem("users", JSON.stringify(updatedUsers));
  
    // Update currently logged-in user
    const updatedUser = updatedUsers.find(u => u.email === user.email);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  
    // Close the modal
    setIsModalOpen(false);
  };
  
  
  
  

const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <div className="min-h-screen  bg-[#f8e2d2] p-4">
      <div className="flex bg-[#f7eee8] border border-gray-300 rounded shadow m-30">
            {/* Sidebar */}
            <aside className="w-64 rounded p-4 pt-15">
                <ul className="space-y-3">
                <li className={`cursor-pointer ${activeSection === "My Profile" ? "text-blue-600 font-semibold" : "text-black"}`} onClick={() => setActiveSection("My Profile")}>  My Profile</li>
                <li className={`cursor-pointer ${activeSection === "Cart" ? "text-blue-600 font-semibold" : "text-black"}`} onClick={() => setActiveSection("Cart")}> Cart </li>


                <li className={`cursor-pointer ${activeSection === "Notifications" ? "text-blue-600 font-semibold" : "text-black"}`} onClick={() => setActiveSection("Notifications")}> Notifications </li>
                <li className={`cursor-pointer ${activeSection === "Wishlist" ? "text-blue-600 font-semibold" : "text-black"}`} onClick={() => setActiveSection("Wishlist")}> Wishlist </li>
                <li className={`cursor-pointer ${activeSection === "Settings" ? "text-blue-600 font-semibold" : "text-black"}`} onClick={() => setActiveSection("Settings")}> Settings </li>
                <li><button className="ml-auto text-sm text-[#1b1403] border border-gray-300 bg-[#e08325] rounded p-2 cursor-pointer" onClick={handleLogout}>Log Out</button></li>
                </ul>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
              
              {activeSection === "My Profile" && (
                  <>
                    {/* Top Profile Card */}
                    <h1 className="text-2xl font-bold mb-4">My Profile</h1>
                    <div className="border border-gray-300 rounded  p-4 flex items-center gap-4 mb-6">
                    <img
                        src={user.image}
                        alt="Profile"
                        className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="text-xl font-semibold">{user.firstname} {user.lastname} ({user.username})</h2>
                        <p className="text-gray-500">{user.bio}</p>
                        <p className="text-gray-400 text-sm">{user.location}</p>
                    </div>
                    <button className="ml-auto text-sm text-[#1b1403] border border-gray-300 bg-[#e08325] rounded p-1 cursor-pointer" onClick={openEditModal}>✎ Edit</button>
                    </div>

                    {/* Personal Info */}
                    <div className="border border-gray-300 rounded  p-4 mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Personal Information</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>First Name:</strong> {user.firstname}</div>
                        <div><strong>Last Name:</strong> {user.lastname}</div>
                        <div><strong>Username:</strong> {user.username}</div>
                        <div><strong>Email:</strong> {user.email}</div>
                        <div><strong>Phone:</strong> {user.phone}</div>
                        <div className="col-span-2"><strong>Bio:</strong> {user.bio}</div>
                    </div>
                    </div>

                    {/* Address Info */}
                    <div className="border border-gray-300 rounded  p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold">Address</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><strong>Country:</strong> {user.country}</div>
                        <div><strong>City/State:</strong> {user.location}</div>
                    </div>
                    </div>
                  </>
                )}

                {activeSection === "Cart" && (
                  <div>
                    <h1 className="text-2xl font-bold mb-4">My Cart</h1>
                    <p>Your cart items will show here...</p>
                  </div>
                )}

                {activeSection === "Wishlist" && (
                  <div>
                    <h1 className="text-2xl font-bold mb-4">Wishlist</h1>
                    <p>Your wishlist items will show here...</p>
                  </div>
                )}

                {activeSection === "Notifications" && (
                  <div>
                    <h1 className="text-2xl font-bold mb-4">Notification</h1>
                    <p>Your Notifications will show here...</p>
                  </div>
                )}
                {activeSection === "Settings" && (
                  <div>
                    <h1 className="text-2xl font-bold mb-4">Settings</h1>
                    <p>Your Settings will show here...</p>
                  </div>
                )}
                
            </main>
        </div>


      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex text-sm items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white mt-20  p-10  rounded-xl shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>
            <div className="grid grid-cols-3 gap-4">
                <div>
                  <input
                    type="text"
                    name="firstname"
                    placeholder="First Name"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    className="w-full mb-3 px-4 py-2 border rounded-md"
                  />
                </div>
                <div>
                <input
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  className="w-full mb-3 px-4 py-2 border rounded-md"
                />
                </div>
                <div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full mb-3 px-4 py-2 border rounded-md"
                />
                </div>
                <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full mb-3 px-4 py-2 border rounded-md"
                />
                </div>
                <div>
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full mb-3 px-4 py-2 border rounded-md"
                />
                </div>
                <div>
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full mb-3 px-4 py-2 border rounded-md"
                />
                </div>
            </div>

            <div className="mb-3">
                <label className="block mb-1 font-medium">Profile Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full text-sm"
                />
                {formData.image && (
                    <img
                    src={formData.image}
                    alt="Preview"
                    className="w-20 h-20 mt-2 object-cover rounded-full border"
                    />
                )}
            </div>

            <div>
            <textarea
              name="bio"
              placeholder="Bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full mb-3 px-4 py-2 border rounded-md resize-none"
            />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
