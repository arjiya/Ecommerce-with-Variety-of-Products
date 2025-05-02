// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Login.css";

// const Login = () => {
//   const [loginData, setLoginData] = useState({ username: "", password: "" });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     let users = JSON.parse(localStorage.getItem("users")) || [];
//     const validUser = users.find(
//       (u) => u.username === loginData.username && u.password === loginData.password
//     );

//     if (validUser) {
//       localStorage.setItem("user", JSON.stringify(validUser));
//       setError("");
//       navigate("/");
//     } else {
//       setError("Invalid username or password");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>Login</h2>
//       <input
//         type="text"
//         placeholder="Username"
//         value={loginData.username}
//         onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={loginData.password}
//         onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
//       />
      
//       <button onClick={handleLogin}>Login</button>
//       {error && <p className="error-message">{error}</p>}

//       <p className="signup-text">
//         Don't have an account? 
//         <button className="signup-btn" onClick={() => navigate("/register")}>Sign Up</button>
//       </p>
//     </div>
//   );
// };

// export default Login;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Load saved login data on component mount
  useEffect(() => {
    const savedLogin = JSON.parse(localStorage.getItem("login_form"));
    if (savedLogin) {
      setLoginData(savedLogin);
    }
  }, []);

  // Save login data to localStorage on change
  useEffect(() => {
    localStorage.setItem("login_form", JSON.stringify(loginData));
  }, [loginData]);

  const handleLogin = () => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const validUser = users.find(
      (u) => u.username === loginData.username && u.password === loginData.password
    );

    if (validUser) {
      localStorage.setItem("user", JSON.stringify(validUser));
      setError("");
      localStorage.removeItem("login_form"); // Optional: clear saved login form after success
      navigate("/");
    } else {
      setError("Invalid username or password");
    }
  };

  const handleClear = (field) => {
    setLoginData((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="auth-container">
      <FaTimes className="close-icon" onClick={() => navigate("/")} />

      <h2>Welcome Back to ShopNest!</h2>
      <h2>Login</h2>

      <div className="input-group">
        <FaUser />
        <input
          type="text"
          placeholder="Username"
          value={loginData.username}
          onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
        />
        {loginData.username && (
          <FaTimes className="clear-icon" onClick={() => handleClear("username")} />
        )}
      </div>

      <div className="input-group">
        <FaLock />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={loginData.password}
          onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
        />
        {loginData.password && (
          <>
            <span className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            <FaTimes className="clear-icon" onClick={() => handleClear("password")} />
          </>
        )}
      </div>

      <button onClick={handleLogin}>Login</button>
      {error && <p className="error-message">{error}</p>}

      <p className="signup-text">
        Don’t have an account?{" "}
        <button className="signup-btn" onClick={() => navigate("/register")}>
          Sign Up
        </button>
      </p>
    </div>
  );
};

export default Login;
