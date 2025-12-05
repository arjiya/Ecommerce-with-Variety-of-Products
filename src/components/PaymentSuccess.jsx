
import React from "react";
import { useNavigate } from "react-router-dom";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  const handleContinueShopping = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      // Clear buy_now_product (or cart items)
      fetch(`http://127.0.0.1:5000/api/cart/clear/${user.id}`, {
        method: "DELETE",
      })
        .then(() => {
          // Dispatch event to update Header
          window.dispatchEvent(new Event("cartUpdated"));
          navigate("/");
        })
        .catch((err) => console.error("Error clearing cart:", err));
    } else {
      navigate("/");
    }
  };

  return (
    <div className="payment-success-container">
      <div className="success-content">
        <h2>Payment Successful!</h2>
        <div className="success-icon">✓</div>
        <p>Thank you for your purchase. Your order has been placed successfully.</p>
        <div className="success-actions">
          <button className="continue-shopping" onClick={handleContinueShopping}>
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
