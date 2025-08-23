
'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useUser } from "../../context/UserContext";

// Define schema for form validation
const userSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().optional(),
  username: z.string().optional(),
  phone: z.string().regex(/^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/, "Invalid phone number").optional(),
  location: z.string().optional(),
  country: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  image: z.string().optional(),
});

type UserFormData = z.infer<typeof userSchema>;

export default function Profile() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isUserLoading, login, checkAuth } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    email: "",
    firstname: "",
    lastname: "",
    username: "",
    image: "",
    phone: "",
    location: "",
    country: "",
    bio: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});


  // Initialize form data when user is available
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || "",
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        username: user.username || "",
        phone: user.phone || "",
        location: user.location || "",
        country: user.country || "",
        image: user.image || "",
        bio: user.bio || "",
      });
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isUserLoading && !isAuthenticated) {
      //router.push('/');
    }
  }, [isUserLoading, isAuthenticated, router]);

 const openEditModal = () => {
    if (!user) return;
    setFormData({
      email: user.email || "",
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      username: user.username || "",
      phone: user.phone || "",
      location: user.location || "",
      country: user.country || "",
      image: user.image || "",
      bio: user.bio || "",
    });
    setFormErrors({});
    setIsModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      setFormErrors({});

      // ✅ Validate form data
      const validation = userSchema.safeParse(formData);
      if (!validation.success) {
        const errors: Record<string, string> = {};
        validation.error.issues.forEach(issue => {
          if (issue.path.length > 0) {
            const fieldName = issue.path[0] as string;
            errors[fieldName] = issue.message;
          }
        });
        setFormErrors(errors);
        return;
      }

      // ✅ Send update request
      const response = await fetch(`/api/users/${user.user_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to update profile');
      }

      // ✅ Update user context by re-fetching user data
      await checkAuth(); // This will update the user context with fresh data
      
      setIsModalOpen(false);
      setSuccess('Profile updated successfully!');
      
    } catch (err) {
      console.error("Error updating user:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };


  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic image validation
    if (file.size > 2 * 1024 * 1024) {
      setError('Image too large (max 2MB)');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // For base64 conversion 
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result as string }));
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };


  if (isUserLoading || !user) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center text-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
          <div className="flex justify-center">
            <svg className="animate-spin h-8 w-8 text-[var(--primary)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold mt-4">Loading profile...</h2>
        </div>
      </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-[var(--primary)]">My Profile</h1>
      
      {success && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md shadow">
          {success}
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md shadow">
          {error}
        </div>
      )}

      <div className="bg-[var(--background)] rounded-2xl shadow p-6 flex flex-col sm:flex-row items-center gap-6 mb-8">
        <div className="relative">
          <img
            src={user.image || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-2 border-[var(--primary)]"
          />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-[var(--text)]">
            {user.firstname} {user.lastname} {user.username && `(@${user.username})`}
          </h2>
          {user.bio && <p className="text-[var(--secondary)] mt-2">{user.bio}</p>}
          {user.location && <p className="text-[var(--secondary)] text-sm mt-1">{user.location}</p>}
        </div>
        <button 
          className="px-4 py-2 text-sm text-[var(--foreground)] bg-[var(--primary)] rounded-lg cursor-pointer transition-colors flex items-center gap-2"
          onClick={openEditModal}
          disabled={isLoading}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Profile
        </button>
      </div>

      <div className="bg-[var(--background)] text-[var(--text)] rounded-2xl shadow p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold text-lg">Personal Information</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-[var(--secondary)] mb-1">First Name</p>
            <p className="font-medium">{user.firstname}</p>
          </div>
          {user.lastname && (
            <div>
              <p className="text-sm text-[var(--secondary)] mb-1">Last Name</p>
              <p className="font-medium">{user.lastname}</p>
            </div>
          )}
          {user.username && (
            <div>
              <p className="text-sm text-[var(--secondary)] mb-1">Username</p>
              <p className="font-medium">@{user.username}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-[var(--secondary)] mb-1">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          {user.phone && (
            <div>
              <p className="text-sm text-[var(--secondary)] mb-1">Phone</p>
              <p className="font-medium">{user.phone}</p>
            </div>
          )}
          {user.bio && (
            <div className="md:col-span-2">
              <p className="text-sm text-[var(--secondary)] mb-1">Bio</p>
              <p className="font-medium">{user.bio}</p>
            </div>
          )}
        </div>
      </div>

      {(user.country || user.location) && (
        <div className="bg-[var(--background)] text-[var(--text)] rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-lg">Location</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.country && (
              <div>
                <p className="text-sm text-[var(--secondary)] mb-1">Country</p>
                <p className="font-medium">{user.country}</p>
              </div>
            )}
            {user.location && (
              <div>
                <p className="text-sm text-[var(--secondary)] mb-1">City/State</p>
                <p className="font-medium">{user.location}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-500">
          <div className="bg-[var(--background2)] text-[var(--text)] rounded-xl shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Edit Profile</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-[var(--secondary)] hover:text-[var(--text)]"
                  disabled={isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--secondary)] mb-1">First Name*</label>
                  <input
                    type="text"
                    name="firstname"
                    value={formData.firstname}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md ${formErrors.firstname ? 'border-red-500' : 'border-[var(--border)]'}`}
                    disabled={isLoading}
                  />
                  {formErrors.firstname && <p className="text-red-500 text-xs mt-1">{formErrors.firstname}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--secondary)] mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastname"
                    value={formData.lastname}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-md"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--secondary)] mb-1">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-md"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--secondary)] mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-md ${formErrors.phone ? 'border-red-500' : 'border-[var(--border)]'}`}
                    disabled={isLoading}
                  />
                  {formErrors.phone && <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--secondary)] mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-md"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--secondary)] mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-[var(--border)] rounded-md"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--secondary)] mb-2">Profile Image</label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={formData.image || "/default-avatar.png"}
                      alt="Preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-[var(--primary)]"
                    />
                  </div>
                  <label className="flex-1">
                    <div className="px-4 py-2 bg-[var(--background)] text-[var(--text)] rounded-md border border-[var(--border)] hover:bg-[var(--background-light)] cursor-pointer transition-colors text-center">
                      Change Photo
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={isLoading}
                    />
                  </label>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-[var(--secondary)] mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-md ${formErrors.bio ? 'border-red-500' : 'border-[var(--border)]'}`}
                  rows={3}
                  disabled={isLoading}
                />
                {formErrors.bio && <p className="text-red-500 text-xs mt-1">{formErrors.bio}</p>}
                <p className="text-xs text-[var(--secondary)] mt-1">{(formData.bio || '').length}/500 characters</p>
              </div>

              <div className="flex justify-end gap-3">
                <button 
                  className="px-6 py-2 rounded-md bg-[var(--background)] text-[var(--text)] cursor-pointer border border-[var(--border)] hover:bg-[var(--background-light)] transition-colors"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button type="button"
                  className="px-6 py-2 rounded-md bg-[var(--primary)] text-[var(--foreground)] cursor-pointer transition-colors flex items-center justify-center min-w-[100px]"
                  onClick={() => {
                        handleSave();
                       
                      }}
                  disabled={isLoading}
                  
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}