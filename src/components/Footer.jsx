
import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <button onClick={scrollToTop} className="back-to-top-btn" >
          Back to top
        </button>
      </div>

      <div className="footer-links">
        <div className="footer-column">
          <h4>Get to Know Us</h4>
          <Link to="/about">About Us</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/press">Press Releases</Link>
          <Link to="/contact">Contact Us</Link>
        </div>

        <div className="footer-column">
          <h4>Help</h4>
          <Link to="/faq">FAQs</Link>
          <Link to="/returns">Returns</Link>
          <Link to="/shipping">Shipping Info</Link>
          <Link to="/customer-service">Customer Service</Link>
        </div>

        <div className="footer-column">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} ShopNest. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
