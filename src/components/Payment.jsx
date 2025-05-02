import KhaltiCheckout from "khalti-checkout-web";
import React, { useEffect, useState } from "react";
import khaltiConfig from "./khaltiConfig";
import "./Payment.css";

const Payment = () => {
    const [amount, setAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        postalCode: ""
    });

    useEffect(() => {
        const buyNowProduct = JSON.parse(localStorage.getItem("buy_now_product"));
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        let totalAmount = 0;
        if (buyNowProduct) {
            totalAmount = buyNowProduct.price * buyNowProduct.quantity;
        } else if (cart.length > 0) {
            totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        }

        setAmount(Math.min(totalAmount, 200)); // Limit for testing
    }, []);

    const handlePayment = () => {
        if (!isFormValid()) return;
        setLoading(true);
        try {
            const checkout = new KhaltiCheckout(khaltiConfig);
            checkout.show({ amount: amount * 100 });
        } catch (error) {
            console.error("Khalti error:", error);
            setLoading(false);
        }
    };

    const isFormValid = () => {
        return Object.values(formData).every(field => field.trim() !== "");
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="daraz-payment-page">
            <h1 className="page-title">Checkout</h1>
            <div className="payment-section">
                <div className="delivery-card">
                    <h2>Delivery Information</h2>
                    <form className="delivery-form">
                        <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
                        <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
                        <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
                        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
                        <input type="text" name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} required />
                    </form>
                </div>

                <div className="summary-card">
                    <h2>Order Summary</h2>
                    <p className="amount-display">Total Amount: <strong>Rs. {amount}</strong></p>
                    {amount > 200 && (
                        <p className="warning-message">
                            Note: Amount is limited to Rs. 200 for testing purposes.
                        </p>
                    )}
                    <button 
                        className="khalti-button"
                        onClick={handlePayment}
                        disabled={loading || amount === 0 || !isFormValid()}
                    >
                        {loading ? "Processing..." : "Pay with Khalti"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Payment;
