
import { useState } from "react";
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      setError("Please enter email and password");
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
        <FaEnvelope /> {/* Use Envelope icon for Email */}
        <input
          type="email"
          placeholder="Email Address"
          value={loginData.email}
          autoComplete="username"
          onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
        />
        {loginData.email && (
          <FaTimes className="clear-icon" onClick={() => handleClear("email")} />
        )}
      </div>

      <div className="input-group">
        <FaLock />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={loginData.password}
          autoComplete="current-password"
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
