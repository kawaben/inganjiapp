'use client';
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { updateUser } from "../../lib/db";

export default function Profile() {
  const router = useRouter();
  const { authenticated, loading } = useAuth();
  const [user, setUser] = useState(null); // default null
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check login status from localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const loggedIn = JSON.parse(localStorage.getItem("loggedInUser"));
    if (loggedIn) {
      const user = storedUsers.find((u) => u.email === loggedIn.email);
      if (user) setCurrentUser(user);
      
    } else {
      router.push("/"); 
    }
  }, [router]);


  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    image: "",
    phone: "",
    location: "",
    country: "",
    bio: "",
  });
  
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    console.log("Stored user from localStorage:", storedUser);
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);
  

  const openEditModal = () => {
    if (!user) return;
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

  const handleSave = async () => {
  if (!user) return;

  const updatedUser = { ...user, ...formData };

  console.log("👉 Updating user with email:", updatedUser.email);
  console.log("🧠 Full user object:", updatedUser);

  try {
    await updateUser(updatedUser);
    setUser(updatedUser);
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    setIsModalOpen(false);
  } catch (err) {
    console.error("❌ Error updating user in IndexedDB:", err);
  }
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
    
 
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#f8e2d2] flex items-center justify-center text-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-xl font-semibold mb-2">You're not logged in</h2>
          <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
          <a
            href="/"
            className="inline-block bg-[#e08325] text-white px-4 py-2 rounded hover:bg-[#c46d1d]"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }


  return (
    <>
    <h1 className="text-2xl font-bold mb-4">My Profile</h1>
    <div className=" bg-gray-100 rounded-2xl shadow  p-4 flex items-center gap-4 mb-6">
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
    <div className=" bg-gray-100 rounded-2xl shadow  p-4 mb-6">
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
    <div className=" bg-gray-100 rounded-2xl shadow  p-4">
    <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Address</h3>
    </div>
    <div className="grid grid-cols-2 gap-4 text-sm">
        <div><strong>Country:</strong> {user.country}</div>
        <div><strong>City/State:</strong> {user.location}</div>
    </div>
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
  </>

  
  );
}
