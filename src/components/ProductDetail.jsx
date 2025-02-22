
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./APICall.css";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [availableStock, setAvailableStock] = useState(0);
  const [cart, setCart] = useState([]);
  const [quantity, setQuantity] = useState(1); // New state to track selected quantity

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setAvailableStock(data.rating.count); // Set available stock from API
      })
      .catch((err) => console.error("Error fetching product details:", err));

    // Load cart from localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, [id]);

  const handleBuyNow = () => {
    if (quantity > availableStock) {
      alert("Not enough stock available!");
      return;
    }

    setAvailableStock((prevStock) => prevStock - quantity);
    alert(`Order placed successfully! (${quantity} item(s) purchased)`);
  };

  const handleAddToCart = () => {
    if (quantity > availableStock) {
      alert("Not enough stock available!");
      return;
    }

    const updatedCart = [...cart];

    // Check if the item already exists in the cart
    const existingItemIndex = updatedCart.findIndex((item) => item.id === product.id);
    if (existingItemIndex !== -1) {
      updatedCart[existingItemIndex].quantity += quantity; 
    } else {
      updatedCart.push({ ...product, quantity }); 
    }

    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setAvailableStock((prevStock) => prevStock - quantity); // Reduce available stock
    alert(`${quantity} item(s) added to cart!`);
  };

  if (!product) return <div>Loading...</div>;
  if (!product.title) return <div>Product not found</div>;

  return (
    <div className="product-detail">
      <Link to="/" className="back-button">← Back to Products</Link>
      <div className="product-detail-card">
        <img className="product-detail-image" src={product.image} alt={product.title} />
        <div className="product-detail-info">
          <h1>{product.title}</h1>
          <p className="description">{product.description}</p>
          <p><strong>Price:</strong> ${product.price}</p>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Available Stock:</strong> {availableStock}</p>
          <p><strong>Rating:</strong> {product.rating.rate} ⭐</p>

        
          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity:</label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Math.min(availableStock, Number(e.target.value))))}
              min="1"
              max={availableStock}
            />
          </div>

          <div className="button-container">
            <button className="buy-now" onClick={handleBuyNow}>Buy Now</button>
            <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="cart-section">
        <h2>Shopping Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul className="cart-list">
            {cart.map((item, index) => (
              <li key={index} className="cart-item">
                <img src={item.image} alt={item.title} className="cart-item-image" />
                <div>
                  <p>{item.title}</p>
                  <p><strong>Price:</strong> ${item.price}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Link to="/CartPage" className="cart-button"> View Full Cart</Link>
      </div>
    </div>
  );
}

export default ProductDetail;
