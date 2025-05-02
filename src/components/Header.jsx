
// import { FaShoppingCart, FaUser, FaSearch } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import React, { useEffect, useState } from "react";
// import "./Header.css";

// const Header = () => {
//   const [categories, setCategories] = useState([]);
//   const [user, setUser] = useState(null);
//   const [cartCount, setCartCount] = useState(0);
//   const [showUserMenu, setShowUserMenu] = useState(false); // Toggle state for user dropdown
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch("https://fakestoreapi.com/products/categories")
//       .then((res) => res.json())
//       .then((data) => setCategories(data))
//       .catch((err) => console.error("Error fetching categories:", err));

//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     if (storedUser) {
//       setUser(storedUser);
//       loadUserCart(storedUser.username);
//     }
//   }, []);

//   const loadUserCart = (username) => {
//     const storedCart = JSON.parse(localStorage.getItem(`cart_${username}`)) || [];
//     const totalItems = storedCart.reduce((acc, item) => acc + item.quantity, 0);
//     setCartCount(totalItems);
//   };

//   useEffect(() => {
//     const updateCartCount = () => {
//       const storedUser = JSON.parse(localStorage.getItem("user"));
//       if (storedUser) {
//         loadUserCart(storedUser.username);
//       } else {
//         setCartCount(0);
//       }
//     };

//     window.addEventListener("storage", updateCartCount);
//     return () => {
//       window.removeEventListener("storage", updateCartCount);
//     };
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     setUser(null);
//     setCartCount(0);
//     navigate("/login");
//   };

//   return (
//     <nav className="navbar">
//       <div className="logo">
//         <Link to="/">ShopNest</Link>
//       </div>

//       <li className="dropdown">
//         <button className="dropbtn">All Categories</button>
//         <div className="dropdown-content">
//           {categories.length > 0 ? (
//             categories.map((category, index) => (
//               <Link key={index} to={`/category/${category}`}>
//                 {category}
//               </Link>
//             ))
//           ) : (
//             <p>Loading categories...</p>
//           )}
//         </div>
//       </li>

//       <ul className="nav-links">
//         <li className="search-box">
//           <input type="text" id="search" placeholder="Search ShopNest" />
//           <FaSearch className="search-icon" />
//         </li>

//         <li>
//           <button className="cart-button" onClick={() => navigate("/CartPage")}>
//             <FaShoppingCart /> Cart ({cartCount})
//           </button>
//         </li>

//         <li className="user-menu">
//           {user ? (
//             <>
//               <button className="user-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
//                 <FaUser /> {user.username}
//               </button>
              
//               {showUserMenu && (
//                 <div className="user-dropdown">
//                   <button onClick={() => navigate("/Profile")}>Edit Profile</button>
//                   <button className="logout-btn" onClick={handleLogout}>Logout</button>
//                 </div>
//               )}
//             </>
//           ) : (
//             <Link to="/login" className="login-link" >Login</Link>
//           )}
//         </li>
//       </ul>
//     </nav>
//   );
// };

// export default Header;
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./Header.css";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false); // Toggle state for user dropdown
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://fakestoreapi.com/products/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      loadUserCart(storedUser.username);
    }
  }, []);

  const loadUserCart = (username) => {
    const storedCart = JSON.parse(localStorage.getItem(`cart_${username}`)) || [];
    const totalItems = storedCart.reduce((acc, item) => acc + item.quantity, 0);
    setCartCount(totalItems);
  };

  useEffect(() => {
    const updateCartCount = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        loadUserCart(storedUser.username);
      } else {
        setCartCount(0);
      }
    };

    window.addEventListener("storage", updateCartCount);
    return () => {
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setCartCount(0);
    navigate("/login");
  };

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
        <li>
          <button className="cart-button" onClick={() => navigate("/CartPage")}>
            <FaShoppingCart /> Cart ({cartCount})
          </button>
        </li>

        <li className="user-menu">
          {user ? (
            <>
              <button className="user-btn" onClick={() => setShowUserMenu(!showUserMenu)}>
                <FaUser /> {user.username}
              </button>

              {showUserMenu && (
                <div className="user-dropdown">
                  <button onClick={() => navigate("/Profile")}>Edit Profile</button>
                  <button className="logout-btn" onClick={handleLogout}>Logout</button>
                </div>
              )}
            </>
          ) : (
            <Link to="/login" className="login-link">Login</Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Header;
