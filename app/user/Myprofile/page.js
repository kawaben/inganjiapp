'use client';
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useRouter } from "next/navigation";
import { updateUser } from "../../lib/db";

export default function Profile() {
  const router = useRouter();
  const { authenticated, loading } = useAuth();
  const [user, setUser] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
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
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-center p-4">
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
    <h1 className="text-2xl font-bold mb-4 text-[var(--primary)]">My Profile</h1>
    <div className=" bg-[var(--background)] rounded-2xl shadow  p-4 flex items-center gap-4 mb-6">
    <img
        src={user.image}
        alt="Profile"
        className="w-16 h-16 rounded-full object-cover"
    />
    <div>
        <h2 className="text-xl font-semibold text-[var(--text)]">{user.firstname} {user.lastname} ({user.username})</h2>
        <p className="text-[var(--secondary)]">{user.bio}</p>
        <p className="text-[var(--secondary)] text-sm">{user.location}</p>
    </div>
    <button className="ml-auto text-sm text-[var(--foreground)] bg-[var(--primary)] rounded p-1 cursor-pointer" onClick={openEditModal}>✎ Edit</button>
    </div>

    {/* Personal Info */}
    <div className=" bg-[var(--background)] text-[var(--text)] rounded-2xl shadow  p-4 mb-6">
    <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Personal Information</h3>
    </div>
    <div className="grid grid-cols-2 gap-4 text-sm">
        <div><strong>First Name:</strong><p className="text-[var(--secondary)]"> {user.firstname}</p></div>
        <div><strong>Last Name:</strong><p className="text-[var(--secondary)]"> {user.lastname}</p></div>
        <div><strong>Username:</strong><p className="text-[var(--secondary)]"> {user.username}</p></div>
        <div><strong>Email:</strong><p className="text-[var(--secondary)]"> {user.email}</p></div>
        <div><strong>Phone:</strong><p className="text-[var(--secondary)]"> {user.phone}</p></div>
        <div className="col-span-2"><strong>Bio:</strong><p className="text-[var(--secondary)]"> {user.bio}</p></div>
    </div>
    </div>

    {/* Address Info */}
    <div className=" bg-[var(--background)] text-[var(--text)] rounded-2xl shadow  p-4">
    <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Address</h3>
    </div>
    <div className="grid grid-cols-2 gap-4 text-sm">
        <div><strong>Country:</strong><p className="text-[var(--secondary)]"> {user.country}</p></div>
        <div><strong>City/State:</strong><p className="text-[var(--secondary)]"> {user.location}</p></div>
    </div>
    </div>

    {/* Edit Profile Modal */}
    {isModalOpen && (
        <div className="fixed inset-0 flex text-sm items-center justify-center bg-[var(--background)] bg-opacity-40 z-50">
          <div className="bg-[var(--background2)] text-[var(--text)] mt-20  p-10  rounded-xl shadow-lg w-full max-w-sm">
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
                className="px-4 py-2 rounded-md bg-[var(--secondary)] cursor-pointer text-[var(--foreground)]"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--foreground)] cursor-pointer"
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
