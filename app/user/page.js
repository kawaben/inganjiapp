"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import '../globals.css';
import {TrashIcon,} from "@heroicons/react/24/solid";
import useAuth from "../hooks/useAuth";

export default function UserPage() {
  const { authenticated, loading } = useAuth();
  const [activeSection, setActiveSection] = useState("My Profile");


  const [user, setUser] = useState({
      firstname: "FirstName",
      lastname: "LastName",
      username: "UserName",
      email: "name@nuovire.com",
      phone: "+250 900 000 0000",
      bio: "Your Bio",
      location: "Kigali",
      country: "Rwanda",
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

  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Tshirt",size:"xxl", price: 15.0, quantity: 2 },
    { id: 2, name: "Beanie",size:"l", price: 15.0, quantity: 3 },
    { id: 3, name: "Glasses",size:"m", price: 15.0, quantity: 1 },
  ]);

  const updateQuantity = (id, amount) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + amount) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };
  const subTotalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalPrice = (subTotalPrice + 20);

  const router = useRouter();

  useEffect(() => {
    if (!loading && !authenticated) {
      const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
      if (storedUser) {
        setUser(storedUser);
      } else {
        router.push("/");
      }
    }
  }, [loading, authenticated]);

  if (loading || !authenticated) return null;



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
    <div className="min-h-screen  bg-[#f8e2d2] p-2">
      <div className="flex flex-col md:flex-row bg-[#f7eee8] border border-gray-300 rounded shadow mt-30">
            {/* Sidebar */}
            <aside className="w-full md:w-64 rounded p-4 pt-6">
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
            <main className="flex-1 p-4 md:p-8">
              
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
                <div className="max-w-4xl text-[#1b1403] rounded-lg shadow gap-5">
                    <h1 className="text-2xl font-bold text-center mb-6">My Shopping Cart</h1>
            
                    {/* Cart Items */}
                    <div className="grid grid-cols-6 gap-4 items-center font-semibold text-[#1b1403] p-2 bg-[#f8e2d2] rounded-lg">
                      <div className="col-span-2">Product</div>
                      <div>Size</div>
                      <div>Quantity</div>
                      <div>Price</div>
                      <div></div>
                    </div>
            
                    
                    {cartItems.length > 0 ? (
                      cartItems.map((item) => (
                        <div key={item.id} className="grid grid-cols-6 gap-4 items-center py-2 shadow text-sm md:text-base lg:text-lg font-medium tracking-wide">
                          <div className="col-span-2 flex items-center gap-4">
                            <img
                              src={`/images/m2.jpg`} 
                              alt="Product"
                              className="w-16 h-16 object-cover rounded"
                            />
                            <div>
                              <div className="font-medium">{item.name}</div>
                              <div className="text-sm text-gray-400">Product ID: {item.id}</div>
                            </div>
                          </div>
                          <div>{item.size}</div>
                          <div className="flex items-center gap-2">
                            <button className="px-2 border bg-[#e08325] rounded cursor-pointer"  onClick={() => updateQuantity(item.id, -1)}>-</button>
                            <span>{item.quantity}</span>
                            <button className="px-2 border bg-[#e08325] rounded cursor-pointer"  onClick={() => updateQuantity(item.id, 1)}>+</button>
                          </div>
                          <div className="p-4 md:p-0">${item.price.toFixed(2)} each</div>
                          <div className="text-[#e08325] cursor-pointer w-5 h-5"  onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            removeItem(item.id);
                          }}><TrashIcon/></div>
                        </div>
                      ))
                    )
                    : (
                      <p className="text-gray-500">Your Cart is empty.</p>
                    )
                    }
            
                    {/* Totals */}
                    <div className="grid grid-cols-2 mt-6 gap-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Discount</span>
                          <span>$0.00</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Delivery</span>
                          <span>$20.00</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal</span>
                          <span>${subTotalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>${totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
            
                    {/* Promo Code */}
                    <div className="mt-6">
                      <input
                        type="text"
                        placeholder="Please enter promo code"
                        className="w-100% p-2 border rounded text-sm mb-2"
                      />
                      <button className="float-right text-sm bg-[#e08325] cursor-pointer text-[#f8e2d2] px-4 py-2 rounded">
                        Apply Discount
                      </button>
                    </div>
            
                    {/* Bottom Buttons */}
                    <div className="mt-10 flex justify-between gap-4">
                      <button className="flex-1 py-2 bg-[#1b1403] text-[#f8e2d2] rounded cursor-pointer">
                        Back to Shop
                      </button>
                      <button className="flex-1 py-2 bg-[#e08325] text-[#f8e2d2] rounded cursor-pointer" onClick={() => setActiveSection("Checkout")}>
                        Checkout
                      </button>
                    </div>
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

              {activeSection === "Checkout" && (
                <div className="">
                  <h2 className="text-2xl font-semibold mb-8">Checkout</h2>
          
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Billing Details */}
                  <div className="lg:col-span-2">
                      <form className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input type="text" placeholder="First name" className="input" />
                          <input type="text" placeholder="Last name" className="input" />
                      </div>
                      <input type="text" placeholder="Company name (optional)" className="input" />
                      <input type="text" placeholder="Street address" className="input" />
                      <input type="text" placeholder="Apartment, suite, etc. (optional)" className="input" />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <input type="text" placeholder="Town / City" className="input" />
                          <input type="text" placeholder="State" className="input" />
                          <input type="text" placeholder="ZIP Code" className="input" />
                      </div>
                      <input type="text" placeholder="Phone" className="input" />
                      <input type="email" placeholder="Email address" className="input" />
          
                      <div className="flex items-center space-x-2">
                          <input type="checkbox" id="create-account" />
                          <label htmlFor="create-account">Create an account?</label>
                      </div>
          
                      <textarea placeholder="Order notes (optional)" className="input h-24" />
                      </form>
                  </div>
          
                  {/* Order Summary */}
                  <div className="border border-gray-200 p-6 rounded-lg shadow-sm">
                      <h3 className="text-xl font-semibold mb-4">Your order</h3>
                        {cartItems.length > 0 ? (
                        cartItems.map((item) => (
                          <ul key={item.id} className="space-y-2">
                          <li className="flex justify-between">
                              <span>{item.name} × {item.quantity}</span>
                              <span>${item.price.toFixed(2)*item.quantity}</span>
                          </li>
                        
                          </ul>

                        ))
                        )
                        : (
                          <p className="text-gray-500">Your Cart is empty.</p>
                        )
                        }

          
                      <div className="border-t mt-4 pt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>${subTotalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>Flat rate: $20.00</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>${totalPrice}</span>
                      </div>
                      </div>
          
                      <div className="mt-6 space-y-3">
                      <div>
                          <input type="radio" id="bank" name="payment" className="mr-2" />
                          <label htmlFor="bank">Direct bank transfer</label>
                      </div>
                      <div>
                          <input type="radio" id="check" name="payment" className="mr-2" />
                          <label htmlFor="check">Check payments</label>
                      </div>
                      </div>
          
                      <div className="mt-4">
                      <input type="checkbox" id="terms" className="mr-2" />
                      <label htmlFor="terms">
                          I have read and agree to the website <a href="#" className="text-blue-600 underline">terms and conditions</a>
                      </label>
                      </div>
          
                      <button className="w-full bg-[#e08325] cursor-pointer text-white py-3 rounded-lg mt-6 font-semibold">
                      Place order
                      </button>
          
                      <div className="mt-4 flex justify-center gap-3">
                      <img src="images/visa.svg" alt="Visa" className="h-6" />
                      <img src="images/paypal.svg" alt="PayPal" className="h-6" />
                      <img src="images/mastercard.svg" alt="MasterCard" className="h-6" />
                      </div>
                  </div>
                  </div>
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
