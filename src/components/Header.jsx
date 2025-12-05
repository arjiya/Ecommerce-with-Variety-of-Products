
// // import { FaShoppingCart, FaUser } from "react-icons/fa";
// // import { Link, useNavigate } from "react-router-dom";
// // import React, { useEffect, useState } from "react";
// // import "./Header.css";
// // import LoginPopup from "./LoginPopup"; // <-- import popup

// // const Header = () => {
// //   const [categories, setCategories] = useState([]);
// //   const [user, setUser] = useState(null);
// //   const [cartCount, setCartCount] = useState(0);
// //   const [showUserMenu, setShowUserMenu] = useState(false);
// //   const [showLoginPopup, setShowLoginPopup] = useState(false); // <-- popup state

// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     fetch("https://fakestoreapi.com/products/categories")
// //       .then((res) => res.json())
// //       .then((data) => setCategories(data))
// //       .catch((err) => console.error("Error fetching categories:", err));

// //     const storedUser = JSON.parse(localStorage.getItem("user"));
// //     if (storedUser) {
// //       setUser(storedUser);
// //       loadUserCart(storedUser.username);
// //     }
// //   }, []);

// //   const loadUserCart = (username) => {
// //     const storedCart = JSON.parse(localStorage.getItem(`cart_${username}`)) || [];
// //     const totalItems = storedCart.reduce((acc, item) => acc + item.quantity, 0);
// //     setCartCount(totalItems);
// //   };

// //   useEffect(() => {
// //     const updateCartCount = () => {
// //       const storedUser = JSON.parse(localStorage.getItem("user"));
// //       if (storedUser) {
// //         loadUserCart(storedUser.username);
// //       } else {
// //         setCartCount(0);
// //       }
// //     };

// //     window.addEventListener("storage", updateCartCount);
// //     return () => {
// //       window.removeEventListener("storage", updateCartCount);
// //     };
// //   }, []);

// //   const handleLogout = () => {
// //     localStorage.removeItem("user");
// //     setUser(null);
// //     setCartCount(0);
// //     navigate("/login");
// //   };

// //   const handleCartClick = () => {
// //     if (!user) {
// //       setShowLoginPopup(true); // show popup instead of redirect
// //       return;
// //     }
// //     navigate("/CartPage");
// //   };

// //   return (
// //     <>
// //       <nav className="navbar">
// //         <div className="logo">
// //           <Link to="/">ShopNest</Link>
// //         </div>

// //         <li className="dropdown">
// //           <button className="dropbtn">All Categories</button>
// //           <div className="dropdown-content">
// //             {categories.length > 0 ? (
// //               categories.map((category, index) => (
// //                 <Link key={index} to={`/category/${category}`}>
// //                   {category}
// //                 </Link>
// //               ))
// //             ) : (
// //               <p>Loading categories...</p>
// //             )}
// //           </div>
// //         </li>

// //         <ul className="nav-links">
// //           {/* CART BUTTON */}
// //           <li>
// //             <button className="cart-button" onClick={handleCartClick}>
// //               <FaShoppingCart /> Cart ({cartCount})
// //             </button>
// //           </li>

// //           {/* USER MENU */}
// //           <li className="user-menu">
// //             {user ? (
// //               <>
// //                 <button
// //                   className="user-btn"
// //                   onClick={() => setShowUserMenu(!showUserMenu)}
// //                 >
// //                   <FaUser /> {user.username}
// //                 </button>

// //                 {showUserMenu && (
// //                   <div className="user-dropdown">
// //                     <button onClick={() => navigate("/Profile")}>
// //                       Edit Profile
// //                     </button>
// //                     <button className="logout-btn" onClick={handleLogout}>
// //                       Logout
// //                     </button>
// //                   </div>
// //                 )}
// //               </>
// //             ) : (
// //               <Link to="/login" className="login-link">
// //                 Login / Signup
// //               </Link>
// //             )}
// //           </li>
// //         </ul>
// //       </nav>

// //       {/* POPUP APPEARS HERE */}
// //       {showLoginPopup && (
// //         <LoginPopup onClose={() => setShowLoginPopup(false)} />
// //       )}
// //     </>
// //   );
// // };

// // export default Header;

// import { useEffect, useState } from "react";
// import { FaShoppingCart, FaUser } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import "./Header.css";
// import LoginPopup from "./LoginPopup";

// const Header = () => {
//   const [categories, setCategories] = useState([]);
//   const [user, setUser] = useState(null);
//   const [cartCount, setCartCount] = useState(0);
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [showLoginPopup, setShowLoginPopup] = useState(false);

//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch("https://fakestoreapi.com/products/categories")
//       .then((res) => res.json())
//       .then((data) => setCategories(data))
//       .catch((err) => console.error("Error fetching categories:", err));

//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     if (storedUser) {
//       setUser(storedUser);
//       fetchCartCount(storedUser.id);
//     }
//   }, []);

//   const fetchCartCount = (userId) => {
//     fetch(`http://127.0.0.1:5000/api/cart/${userId}`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (Array.isArray(data)) {
//           const total = data.reduce((acc, item) => acc + item.quantity, 0);
//           setCartCount(total);
//         }
//       })
//       .catch((err) => console.error("Error fetching cart count:", err));
//   };

//   // Poll for cart updates or listen to custom event
//   useEffect(() => {
//     const handleCartUpdate = () => {
//       const storedUser = JSON.parse(localStorage.getItem("user"));
//       if (storedUser) {
//         fetchCartCount(storedUser.id);
//       }
//     };

//     // Listen for custom event 'cartUpdated'
//     window.addEventListener("cartUpdated", handleCartUpdate);
//     return () => window.removeEventListener("cartUpdated", handleCartUpdate);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     setUser(null);
//     setShowUserMenu(false);
//     setCartCount(0);
//     navigate("/login");
//   };

//   const handleCartClick = () => {
//     if (!user) {
//       setShowLoginPopup(true);
//       return;
//     }
//     navigate("/CartPage");
//   };

//   return (
//     <>
//       <nav className="navbar">
//         <div className="logo">
//           <Link to="/">ShopNest</Link>
//         </div>

//         <li className="dropdown">
//           <button className="dropbtn">All Categories</button>
//           <div className="dropdown-content">
//             {categories.length > 0 ? (
//               categories.map((category, index) => (
//                 <Link key={index} to={`/category/${category}`}>
//                   {category}
//                 </Link>
//               ))
//             ) : (
//               <p>Loading...</p>
//             )}
//           </div>
//         </li>

//         <ul className="nav-links">

//           {/* CART BUTTON */}
//           <li>
//             <button className="cart-button" onClick={handleCartClick}>
//               <FaShoppingCart className="cart-icon" />
//               Cart ({cartCount})
//             </button>
//           </li>

//           {/* USER BUTTON */}
//           <li className="user-menu">
//             {user ? (
//               <>
//                 <button
//                   className="user-btn"
//                   onClick={() => setShowUserMenu(!showUserMenu)}
//                 >
//                   <FaUser className="user-icon" />
//                   {user.username}
//                 </button>

//                 {showUserMenu && (
//                   <div className="user-dropdown">
//                     <button onClick={() => navigate("/Profile")}>
//                       Edit Profile
//                     </button>
//                     <button className="logout-btn" onClick={handleLogout}>
//                       Logout
//                     </button>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <button
//                 className="login-btn-header"
//                 onClick={() => navigate("/login")}
//               >
//                 <FaUser className="login-user-icon" />
//                 Login / Signup
//               </button>
//             )}
//           </li>
//         </ul>
//       </nav>

//       {showLoginPopup && <LoginPopup onClose={() => setShowLoginPopup(false)} />}
//     </>
//   );
// };

// export default Header;
import { useEffect, useState } from "react";
import { FaShoppingCart, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import LoginPopup from "./LoginPopup";

const Header = () => {
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch categories from API
    fetch("https://fakestoreapi.com/products/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));

    // Load user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetchCartCount(storedUser.id);
    }
  }, []);

  // Fetch cart count from backend
  const fetchCartCount = (userId) => {
    fetch(`http://127.0.0.1:5000/api/cart/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const total = data.reduce((acc, item) => acc + item.quantity, 0);
          setCartCount(total);
        }
      })
      .catch((err) => console.error("Error fetching cart count:", err));
  };

  // Listen for cart updates globally
  useEffect(() => {
    const handleCartUpdate = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        fetchCartCount(storedUser.id);
      } else {
        setCartCount(0);
      }
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setCartCount(0);
    navigate("/login");
  };

  const handleCartClick = () => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    navigate("/CartPage");
  };

  return (
    <>
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
              <p>Loading...</p>
            )}
          </div>
        </li>

        <ul className="nav-links">
          <li>
            <button className="cart-button" onClick={handleCartClick}>
              <FaShoppingCart /> Cart ({cartCount})
            </button>
          </li>

          <li className="user-menu">
            {user ? (
              <>
                <button
                  className="user-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <FaUser /> {user.username}
                </button>

                {showUserMenu && (
                  <div className="user-dropdown">
                    <button onClick={() => navigate("/Profile")}>
                      Edit Profile
                    </button>
                    <button className="logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button
                className="login-btn-header"
                onClick={() => navigate("/login")}
              >
                <FaUser /> Login / Signup
              </button>
            )}
          </li>
        </ul>
      </nav>

      {showLoginPopup && <LoginPopup onClose={() => setShowLoginPopup(false)} />}
    </>
  );
};

export default Header;
