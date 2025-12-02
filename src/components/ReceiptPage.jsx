// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import "./ReceiptPage.css";

// const ReceiptPage = () => {
//   const [product, setProduct] = useState(null);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const fetchedProduct = JSON.parse(localStorage.getItem("buy_now_product"));
//     const fetchedUser = JSON.parse(localStorage.getItem("user"));

//     if (fetchedProduct && fetchedUser) {
//       setProduct(fetchedProduct);
//       setUser(fetchedUser);
//     }
//   }, []);

//   const handleDownloadReceipt = () => {
//     if (!product || !user) {
//       alert("No product or user information found.");
//       return;
//     }

//     const receiptContent = `
//       Receipt
//       ------------------------
//       Buyer: ${user.username}
//       Product: ${product.title}
//       Quantity: ${product.quantity}
//       Price per item: Rs ${product.price}
//       Total: Rs ${product.price * product.quantity}
//       ------------------------
//       Thank you for shopping with us!
//     `;

//     const blob = new Blob([receiptContent], { type: "text/plain;charset=utf-8" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "receipt.txt";
//     a.click();
//     URL.revokeObjectURL(url);
//   };

//   if (!product || !user) {
//     return <div>Loading receipt...</div>;
//   }

//   return (
//     <div className="receipt-page-container">
//       <h2>Receipt</h2>
//       <div className="receipt-details">
//         <p><strong>Buyer:</strong> {user.username}</p>
//         <p><strong>Product:</strong> {product.title}</p>
//         <p><strong>Quantity:</strong> {product.quantity}</p>
//         <p><strong>Price per item:</strong> Rs {product.price}</p>
//         <p><strong>Total:</strong> Rs {product.price * product.quantity}</p>
//       </div>
//       <div className="receipt-actions">
//         <button className="download-receipt" onClick={handleDownloadReceipt}>Download Receipt</button>
//         <Link to="/" className="continue-shopping">Continue Shopping</Link>
//       </div>
//     </div>
//   );
// };

// export default ReceiptPage;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import "./Register.css";

const Register = () => {
  const [registerData, setRegisterData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!registerData.username || !registerData.password) {
      setError("Please enter both username and password");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      });
      const data = await response.json();

      if (data.success) {
        setError("Registered successfully!");
        navigate("/login"); // redirect to login
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Server error, try again later");
      console.log(err);
    }
  };

  const handleClear = (field) => {
    setRegisterData((prev) => ({ ...prev, [field]: "" }));
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
