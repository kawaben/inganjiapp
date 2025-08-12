'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  firstname?: string | null;
  lastname?: string | null;
  username?: string | null;
  image?: string | null;
  phone?: string | null;
  location?: string | null;
  country?: string | null;
  bio?: string | null;
}

interface ProfileProps {
  user: User;
}

export default function Profile({ user: initialUser }: ProfileProps) {
  const router = useRouter();
  const [user, setUser] = useState<User>(initialUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
    if (initialUser) {
      setUser(initialUser);
    }
  }, [initialUser]);

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
    setError(null);
    setSuccess(null);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Basic validation
      if (!formData.firstname.trim()) {
        throw new Error("First name is required");
      }

      const updatedUser = { ...user, ...formData };
      
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedUser),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const savedUser = await response.json();
      setUser(savedUser);
      setIsModalOpen(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Basic image validation
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError('Image too large (max 2MB)');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <h2 className="text-xl font-semibold mb-2">Loading profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-[var(--primary)]">My Profile</h1>
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          {success}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="bg-[var(--background)] rounded-2xl shadow p-4 flex items-center gap-4 mb-6">
        <img
          src={user.image || "/default-avatar.png"}
          alt="Profile"
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold text-[var(--text)]">
            {user.firstname} {user.lastname} {user.username}
          </h2>
          {user.bio && <p className="text-[var(--secondary)]">{user.bio}</p>}
          {user.location && <p className="text-[var(--secondary)] text-sm">{user.location}</p>}
        </div>
        <button 
          className="ml-auto text-sm text-[var(--foreground)] bg-[var(--primary)] rounded p-1 cursor-pointer  transition-colors" 
          onClick={openEditModal}
          disabled={isLoading}
        >
          ✎ Edit
        </button>
      </div>

      {/* Personal Info */}
      <div className="bg-[var(--background)] text-[var(--text)] rounded-2xl shadow p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Personal Information</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><strong>First Name:</strong><p className="text-[var(--secondary)]"> {user.firstname}</p></div>
          {user.lastname && <div><strong>Last Name:</strong><p className="text-[var(--secondary)]"> {user.lastname}</p></div>}
          {user.username && <div><strong>Username:</strong><p className="text-[var(--secondary)]"> {user.username}</p></div>}
          <div><strong>Email:</strong><p className="text-[var(--secondary)]"> {user.email}</p></div>
          {user.phone && <div><strong>Phone:</strong><p className="text-[var(--secondary)]"> {user.phone}</p></div>}
          {user.bio && <div className="col-span-2"><strong>Bio:</strong><p className="text-[var(--secondary)]"> {user.bio}</p></div>}
        </div>
      </div>

      {/* Address Info */}
      {(user.country || user.location) && (
        <div className="bg-[var(--background)] text-[var(--text)] rounded-2xl shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Address</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {user.country && <div><strong>Country:</strong><p className="text-[var(--secondary)]"> {user.country}</p></div>}
            {user.location && <div><strong>City/State:</strong><p className="text-[var(--secondary)]"> {user.location}</p></div>}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex text-sm items-center justify-center bg-[var(--background)] bg-opacity-40 z-50">
          <div className="bg-[var(--background2)] text-[var(--text)] mt-20 p-10 rounded-xl shadow-lg w-full max-w-sm">
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                  disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 rounded-md bg-[var(--secondary)] cursor-pointer text-[var(--foreground)] hover:bg-[var(--secondary-dark)] transition-colors"
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-md bg-[var(--primary)] text-[var(--foreground)] cursor-pointer hover:bg-[var(--primary-dark)] transition-colors flex items-center justify-center min-w-[80px]"
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}