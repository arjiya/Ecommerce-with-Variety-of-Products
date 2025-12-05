import { useEffect, useState } from "react";
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
      loadCart(storedUser.id);
    }
  }, []);

  const loadCart = (userId) => {
    fetch(`http://127.0.0.1:5000/api/cart/${userId}`)
      .then(res => res.json())
      .then(data => setCart(data))
      .catch(err => console.error("Error loading cart:", err));
  };

  const handleRemoveItem = async (productId) => {
    if (!user) return;

    await fetch("http://127.0.0.1:5000/api/cart/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user.id, product_id: productId })
    });

    loadCart(user.id);
    loadCart(user.id);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleClearCart = async () => {
    if (!user) return;
    await fetch(`http://127.0.0.1:5000/api/cart/clear/${user.id}`, { method: "DELETE" });
    setCart([]);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return alert("Cart is empty");

    // Clear any immediate buy-now item to prioritize cart checkout
    localStorage.removeItem("buy_now_product");

    // Sync DB cart to localStorage for Payment page
    localStorage.setItem("cart", JSON.stringify(cart));

    navigate("/payment");
  };

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

          <div className="cart-summary">
            <h3>Total: ${calculateTotal().toFixed(2)}</h3>
          </div>

          <div className="cart-actions">
            <button className="clear-cart" onClick={handleClearCart}>Clear Cart</button>
            <button className="checkout-btn" onClick={handleCheckout}>Checkout & Place Order</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
