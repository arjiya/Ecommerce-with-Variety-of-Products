

// payment.jsx
import React from "react";
import KhaltiCheckout from "khalti-checkout-web";
import khaltiConfig from "./khaltiConfig";

const Payment = () => {
    const handlePayment = () => {
        const checkout = new KhaltiCheckout(khaltiConfig);
        checkout.show({ amount: 1000 });
    };

    return (
        <button onClick={handlePayment} style={{ padding: "10px 20px", backgroundColor: "#5e60ce", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Pay with Khalti
        </button>
    );
};

export default Payment;
