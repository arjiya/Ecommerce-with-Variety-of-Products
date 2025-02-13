
import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./Header.css";

const Header = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">ShopNest</Link>
      </div>
      <li className="dropdown">
          <button className="dropbtn">All Categories</button>
          <div className="dropdown-content">
            {categories.length > 0 ? (
              categories.map((category, index) => (
                <Link key={index} to={`/category/${category}`}>
                  {category}
                </Link>
              ))
            ) : (
              <p>Loading categories...</p>
            )}
          </div>
        </li>

      <ul className="nav-links">
        <li className="search-box">
          <input type="text" id="search" placeholder="Search ShopNest" />
          <FaSearch className="search-icon" />
        </li>

       

        <li>
          <Link to="/cart">
            <FaShoppingCart /> Cart
          </Link>
        </li>
        <li>
          <Link to="/SignIn">
            <FaUser /> Sign In
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
