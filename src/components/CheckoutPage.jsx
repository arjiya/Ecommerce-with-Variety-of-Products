import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

function CheckoutPage() {
    const [cart, setCart] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    const handlePlaceOrder = () => {
        if (!name || !email || !address) {
            alert("Please fill in all fields.");
            return;
        }

        alert("Order placed successfully!");
        localStorage.removeItem("cart");
        setCart([]);
        navigate("/");
    };

    return (
        <div className="checkout-page">
            <Link to="/cart" className="back-button">← Back to Cart</Link>
            <h2>Checkout</h2>

            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        <ul className="checkout-list">
                            {cart.map((item, index) => (
                                <li key={index} className="checkout-item">
                                    <p><strong>{item.title}</strong></p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price: ${item.price * item.quantity}</p>
                                </li>
                            ))}
                        </ul>
                        <h3>Total: ${getTotalPrice()}</h3>
                    </div>

                    <div className="checkout-form">
                        <h3>Billing Details</h3>
                        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <textarea placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)}></textarea>

                        <Link to="/payment" className="place-order-button" onClick={handlePlaceOrder}>
    Place Order
</Link>

                        
                    </div>
                </>
            )}
        </div>
    );
}

export default CheckoutPage;
