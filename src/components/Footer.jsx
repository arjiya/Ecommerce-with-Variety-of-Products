import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom"; 
import './Footer.css'
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center md:text-left">
            <h4 className="text-xl font-bold mb-4">ShopNest</h4>
            <p>Your one-stop shop for all your needs.</p>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-xl font-bold mb-4">Quick Links</h4>
            <ul>
              <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-xl font-bold mb-4">Follow Us</h4>
            <div className="flex justify-center md:justify-start space-x-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 py-4">
        <p className="text-center text-sm text-gray-400">© 2025 ShopNest. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
