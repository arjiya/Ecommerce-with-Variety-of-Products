import React from "react";
import { Link } from "react-router-dom";
import "./PaymentFailure.css";

const PaymentFailure = () => {
    return (
        <div className="payment-failure-container">
            <div className="failure-content">
                <h2>Payment Failed</h2>
                <div className="failure-icon">✕</div>
                <p>We're sorry, but your payment could not be processed. Please try again.</p>
                <div className="failure-actions">
                    <Link to="/payment" className="try-again">Try Again</Link>
                    <Link to="/" className="back-to-home">Back to Home</Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;
