import React from "react";
import "./LoginPopup.css";
import { useNavigate } from "react-router-dom";

export default function LoginPopup({ onClose }) {
  const navigate = useNavigate();

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3>You must login to continue</h3>

        <button
          className="login-btn"
          onClick={() => {
            onClose();
            navigate("/login");
          }}
        >
          Login
        </button>

        <button className="close-btn" onClick={onClose}>
          Cancel
        </button>
      </div>
    </div>
  );
}
