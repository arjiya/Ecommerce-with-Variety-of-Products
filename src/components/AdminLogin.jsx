import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUser, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import "./Login.css"; // reuse the same styles

const AdminLogin = () => {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAdminLogin = () => {
    const { username, password } = loginData;

    // Hardcoded admin credentials
    if (username === "admin" && password === "admin123") {
      setError("");
      navigate("/AdminDashboard"); // redirect to admin dashboard
    } else {
      setError("Invalid admin username or password");
    }
  };

  const handleClear = (field) => {
    setLoginData((prev) => ({ ...prev, [field]: "" }));
  };

  return (
    <div className="auth-container">
      <FaTimes className="close-icon" onClick={() => navigate("/")} />

      <h2>Admin Login</h2>

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

      <button onClick={handleAdminLogin}>Login as Admin</button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AdminLogin;
