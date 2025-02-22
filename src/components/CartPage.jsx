
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CartPage.css';

function CartPage() {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    const handleRemoveItem = (index) => {
        const updatedCart = [...cart];
        updatedCart.splice(index, 1);
        setCart(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
    };

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    return (
        <div className="cart-page">
            <Link to="/" className="back-button">← Continue Shopping</Link>
            <h2>Shopping Cart</h2>

            {cart.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    <ul className="cart-list">
                        {cart.map((item, index) => (
                            <li key={index} className="cart-item">
                                <img src={item.image} alt={item.title} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <p><strong>{item.title}</strong></p>
                                    <p><strong>Price:</strong> ${item.price}</p>
                                    <p><strong>Quantity:</strong> {item.quantity}</p>
                                    <p><strong>Total:</strong> ${item.price * item.quantity}</p>
                                </div>
                                <button className="remove-item" onClick={() => handleRemoveItem(index)}>Remove</button>
                            </li>
                        ))}
                    </ul>

                    <h3>Total: ${getTotalPrice()}</h3>
                    <Link to="/CheckoutPage" className="checkout-button">Proceed to Checkout</Link>
                </>
            )}
        </div>
    );
}

export default CartPage;
