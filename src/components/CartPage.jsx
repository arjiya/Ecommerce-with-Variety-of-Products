import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CartPage.css";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      const cartKey = `cart_${storedUser.username}`;
      const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
      setCart(storedCart);
    }
  }, []);

  const handleRemoveItem = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);

    if (user) {
      localStorage.setItem(`cart_${user.username}`, JSON.stringify(updatedCart));
    }

    // 🔥 Dispatch event to update Header cart count
    window.dispatchEvent(new Event("storage"));
  };

  const handleClearCart = () => {
    setCart([]);
    if (user) {
      localStorage.removeItem(`cart_${user.username}`);
    }
    // 🔥 Dispatch event to update Header cart count
    window.dispatchEvent(new Event("storage"));
  };

  const handleCheckout = () => {
    alert("Proceeding to checkout...");
    handleClearCart();
  };

  // If no user is logged in, redirect to login
  if (!user) {
    return (
      <div className="cart-page">
        <h2>Please <Link to="/login">Login</Link> to view your cart.</h2>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>{user.username}'s Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul className="cart-list">
            {cart.map((item) => (
              <li key={item.id} className="cart-item">
                <img src={item.image} alt={item.title} className="cart-item-image" />
                <div className="cart-item-details">
                  <p><strong>{item.title}</strong></p>
                  <p>Price: ${item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <button className="remove-btn" onClick={() => handleRemoveItem(item.id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-actions">
            <button className="clear-cart" onClick={handleClearCart}>Clear Cart</button>
            <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
          </div>
        </div>
      )}
      
      <Link to="/" className="back-button">← Continue Shopping</Link>
    </div>
  );
};

export default CartPage;
