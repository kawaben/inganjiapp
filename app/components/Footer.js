import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaTiktok, FaPinterest } from 'react-icons/fa';
import Link from 'next/link';

export default function Footer() {
    return (
      <footer className="bg-[#554e48] text-[#1b1403] py-10 px-6 md:px-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 text-sm">
          {/* About Us */}
          <div>
            <h3 className="font-semibold text-orange-300 mb-3">About Us</h3>
            <p>
              We are a clothing brand committed to quality and style. Our mission is to empower individuals to express themselves through fashion.
            </p>
          </div>
  
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-orange-300 mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Shops</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
  
          {/* Follow Us */}
          <div>
            <h3 className="font-semibold text-orange-300 mb-3">Follow Us</h3>
            <ul className="space-y-4">
              <li><a className="flex items-center space-x-4"><FaFacebookF/> <span>nuovi re</span></a></li>
              <li><a className="flex items-center space-x-4"><FaTwitter/> <span>nuovi re</span></a></li>
              <li><a className="flex items-center space-x-4"><FaInstagram/> <span>nuovi re</span></a></li>
              <li><a className="flex items-center space-x-4"><FaLinkedin/> <span>nuovi re</span></a></li>
              <li><a className="flex items-center space-x-4"><FaTiktok/> <span>nuovi re</span></a></li>
              <li><a className="flex items-center space-x-4"><FaPinterest/> <span>nuovi re</span></a></li>
            </ul>
          </div>
  
          {/* Contact Us */}
          <div>
            <h3 className="font-semibold text-orange-300 mb-3">Contact Us</h3>
            <p>E-mail: nuovi@gmail.com</p>
            <p>Phone: +250 795458850</p>
            <p>Address: Kigali, Rwanda</p>
          </div>
        </div>
  
        <div className="text-center mt-10 text-xs text-[#1b1403]">
          © 2025 NUOVI RE®. All rights reserved.
        </div>
      </footer>
    );
  }
  