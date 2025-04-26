import React from "react";
import { Link } from "react-router-dom";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
    return (
        <div className="payment-success-container">
            <div className="success-content">
                <h2>Payment Successful!</h2>
                <div className="success-icon">✓</div>
                <p>Thank you for your purchase. Your order has been placed successfully.</p>
                <div className="success-actions">
                    <Link to="/" className="continue-shopping">Continue Shopping</Link>
                    <Link to="/orders" className="view-orders">View Orders</Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
