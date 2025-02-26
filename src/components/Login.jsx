import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    const validUser = users.find(
      (u) => u.username === loginData.username && u.password === loginData.password
    );

    if (validUser) {
      localStorage.setItem("user", JSON.stringify(validUser));
      setError("");
      navigate("/");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={loginData.username}
        onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={loginData.password}
        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
      />
      
      <button onClick={handleLogin}>Login</button>
      {error && <p className="error-message">{error}</p>}

      <p className="signup-text">
        Don't have an account? 
        <button className="signup-btn" onClick={() => navigate("/register")}>Sign Up</button>
      </p>
    </div>
  );
};

export default Login;
