import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const [registerData, setRegisterData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!registerData.username || !registerData.password) {
      setError("Please enter both username and password");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some((u) => u.username === registerData.username)) {
      setError("Username already exists");
      return;
    }

    users.push(registerData);
    localStorage.setItem("users", JSON.stringify(users));
    setError("Registered successfully! You can now log in.");
    setRegisterData({ username: "", password: "" });
    navigate("/login");
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <input
        type="text"
        placeholder="Username"
        value={registerData.username}
        onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={registerData.password}
        onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
      />
      <button onClick={handleRegister}>Register</button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Register;
