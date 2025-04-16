"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserPage() {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(
    
    {
    username: "",
    image: "",
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
      username: user.username || "",
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {user ? (
          <div className="flex flex-col items-center space-y-4">
            <img
              src={user.image || "/default-avatar.png"}
              alt="User Avatar"
              className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
            />
            <h2 className="text-xl font-semibold">{user.username || "User"}</h2>
            <p className="text-gray-500">{user.email}</p>
            {user.bio && <p className="text-sm text-gray-600 text-center">{user.bio}</p>}

            <button
              className="mt-4 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600"
              onClick={openEditModal}
            >
              Edit Profile
            </button>

            <button
              className="mt-2 px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <p>Loading user info...</p>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Edit Profile</h3>

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              className="w-full mb-3 px-4 py-2 border rounded-md"
            />

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


            <textarea
              name="bio"
              placeholder="Bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-full mb-3 px-4 py-2 border rounded-md resize-none"
            />

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
