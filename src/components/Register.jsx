// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Register.css";

// const Register = () => {
//   const [registerData, setRegisterData] = useState({ username: "", password: "" });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleRegister = () => {
//     if (!registerData.username || !registerData.password) {
//       setError("Please enter both username and password");
//       return;
//     }

//     let users = JSON.parse(localStorage.getItem("users")) || [];
//     if (users.some((u) => u.username === registerData.username)) {
//       setError("Username already exists");
//       return;
//     }

//     users.push(registerData);
//     localStorage.setItem("users", JSON.stringify(users));
//     setError("Registered successfully! You can now log in.");
//     setRegisterData({ username: "", password: "" });
//     navigate("/login");
//   };

//   return (
//     <div className="auth-container">
//        <h2>Welcome To ShopNest!Please Register </h2>
//       <h2> Register</h2>
//       <input
//         type="text"
//         placeholder="Username"
//         value={registerData.username}
//         onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={registerData.password}
//         onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
//       />
//       <button onClick={handleRegister}>Register</button>
//       {error && <p className="error-message">{error}</p>}
//     </div>
//   );
// };

// export default Register;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import "./Register.css";

const Register = () => {
  const [registerData, setRegisterData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Load saved form data from localStorage on component mount
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("register_form"));
    if (savedData) {
      setRegisterData(savedData);
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("register_form", JSON.stringify(registerData));
  }, [registerData]);

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

    // Clear form, saved data, and navigate
    setRegisterData({ username: "", password: "" });
    localStorage.removeItem("register_form");
    setError("Registered successfully!");
    navigate("/login");
  };

  const handleClear = (field) => {
    const updatedData = { ...registerData, [field]: "" };
    setRegisterData(updatedData);
  };

  return (
    <div className="auth-container">
      <h2>ShopNest Registration</h2>

      <div className="input-group">
        <FaUser />
        <input
          type="text"
          placeholder="Username"
          value={registerData.username}
          onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
        />
        {registerData.username && (
          <FaTimes className="clear-icon" onClick={() => handleClear("username")} />
        )}
      </div>

      <div className="input-group">
        <FaLock />
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          value={registerData.password}
          onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
        />
        {registerData.password && (
          <>
            <span className="toggle-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
            <FaTimes className="clear-icon" onClick={() => handleClear("password")} />
          </>
        )}
      </div>

      <button onClick={handleRegister}>Register</button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Register;
