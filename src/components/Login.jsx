

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FaUser, FaLock, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
// import "./Login.css";

// const Login = () => {
//   const [loginData, setLoginData] = useState({ username: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async () => {
//     if (!loginData.username || !loginData.password) {
//       setError("Please enter username and password");
//       return;
//     }

//     try {
//       const response = await fetch("http://127.0.0.1:5000/api/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(loginData),
//       });

//       const data = await response.json();
//       if (data.success) {
//         localStorage.setItem("user", JSON.stringify(data.user)); // save logged-in user info
//         setError("");
//         navigate("/"); // redirect to homepage
//       } else {
//         setError(data.message || "Login failed");
//       }
//     } catch (err) {
//       setError("Server error, try again later");
//       console.log(err);
//     }
//   };

//   const handleClear = (field) => {
//     setLoginData((prev) => ({ ...prev, [field]: "" }));
//   };

//   return (
//     <div className="auth-container">
//       <FaTimes className="close-icon" onClick={() => navigate("/")} />

//       <h2>Welcome Back to ShopNest!</h2>
//       <h2>Login</h2>

//       <div className="input-group">
//         <FaUser />
//         <input
//           type="text"
//           placeholder="Username"
//           value={loginData.username}
//           onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
//         />
//         {loginData.username && (
//           <FaTimes className="clear-icon" onClick={() => handleClear("username")} />
//         )}
//       </div>

//       <div className="input-group">
//         <FaLock />
//         <input
//           type={showPassword ? "text" : "password"}
//           placeholder="Password"
//           value={loginData.password}
//           onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
//         />
//         {loginData.password && (
//           <>
//             <span className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </span>
//             <FaTimes className="clear-icon" onClick={() => handleClear("password")} />
//           </>
//         )}
//       </div>

//       <button onClick={handleLogin}>Login</button>
//       {error && <p className="error-message">{error}</p>}

//       <p className="signup-text">
//         Don’t have an account?{" "}
//         <button className="signup-btn" onClick={() => navigate("/register")}>
//           Sign Up
//         </button>
//       </p>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!loginData.username || !loginData.password) {
      setError("Please enter username and password");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setError("");
        navigate("/"); // redirect to homepage
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Server error, try again later");
      console.log(err);
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

      {/* ---------------- Admin Button ---------------- */}
      <p className="admin-text">
        Are you an admin?{" "}
        <button className="admin-btn" onClick={() => navigate("/admin-login")}>
          Admin Login
        </button>
      </p>

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
