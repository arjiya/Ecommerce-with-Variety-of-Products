// payment.jsx
import React, { useEffect, useState } from "react";
import KhaltiCheckout from "khalti-checkout-web";
import khaltiConfig from "./khaltiConfig";
import "./Payment.css";

const Payment = () => {
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Get the amount from localStorage or state management
        const buyNowProduct = JSON.parse(localStorage.getItem("buy_now_product"));
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        
        let totalAmount = 0;
        if (buyNowProduct) {
            totalAmount = buyNowProduct.price * buyNowProduct.quantity;
        } else if (cart.length > 0) {
            totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }

        // For testing purposes, limit the amount to Rs 200
        setAmount(Math.min(totalAmount, 200));
    }, []);

    const handlePayment = () => {
        setLoading(true);
        try {
            const checkout = new KhaltiCheckout(khaltiConfig);
            checkout.show({ amount: amount * 100 }); // Amount in paisa
        } catch (error) {
            console.error("Error initializing Khalti payment:", error);
            setLoading(false);
        }
    };

    return (
        <div className="payment-container">
            <h2>Payment Details</h2>
            <div className="payment-info">
                <p>Total Amount: Rs. {amount}</p>
                {amount > 200 && (
                    <p className="warning-message">
                        Note: Amount has been limited to Rs 200 for testing purposes
                    </p>
                )}
                <button 
                    onClick={handlePayment} 
                    className="khalti-button"
                    disabled={loading || amount === 0}
                >
                    {loading ? "Processing..." : "Pay with Khalti"}
                </button>
            </div>
        </div>
    );
};

export default Payment;
