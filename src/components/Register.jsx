// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "./Register.css";

// const Register = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleRegister = (e) => {
//     e.preventDefault();

//     // Validation checks
//     if (!name || !email || !password || !confirmPassword) {
//       setError("All fields are required!");
//       return;
//     }
//     if (password.length < 6) {
//       setError("Password must be at least 6 characters!");
//       return;
//     }
//     if (password !== confirmPassword) {
//       setError("Passwords do not match!");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     // Simulating API call (Replace with backend API later)
//     setTimeout(() => {
//       setLoading(false);
//       alert("Registration Successful!");
//       navigate("/SignIn"); // Redirect to Sign In page after registration
//     }, 2000);
//   };

//   return (
//     <div className="register-container">
//       <h2>Register Account</h2>
//       {error && <p className="error-message">{error}</p>}
      
//       <form onSubmit={handleRegister}>
//         <div className="input-group">
//           <label>Full Name</label>
//           <input
//             type="text"
//             placeholder="Enter your full name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             required
//           />
//         </div>

//         <div className="input-group">
//           <label>Email</label>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>

//         <div className="input-group">
//           <label>Password</label>
//           <input
//             type="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>

//         <div className="input-group">
//           <label>Confirm Password</label>
//           <input
//             type="password"
//             placeholder="Confirm your password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             required
//           />
//         </div>

//         <button type="submit" className="register-button" disabled={loading}>
//           {loading ? "Registering..." : "Register"}
//         </button>

//         <p className="signin-text">
//           Already have an account? <Link to="/SignIn">Sign In</Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default Register;
// Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const userData = {
      email,
      username,
      password,
      name: { firstname: name.split(" ")[0], lastname: name.split(" ")[1] || "" },
    };

    try {
      const response = await fetch("https://fakestoreapi.com/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      console.log("Registered user:", data);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;

