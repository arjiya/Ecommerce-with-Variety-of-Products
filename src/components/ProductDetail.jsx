import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [availableStock, setAvailableStock] = useState(0);
  const [cart, setCart] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setAvailableStock(data.rating.count);
      })
      .catch((err) => console.error("Error fetching product:", err));

    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    if (storedUser) {
      const cartKey = `cart_${storedUser.username}`;
      const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
      setCart(storedCart);
    }
  }, [id]);

  // ✅ Add to Cart Handler
  const handleAddToCart = () => {
    if (quantity > availableStock) {
      alert("Not enough stock available!");
      return;
    }

    if (!user) {
      alert("Please log in to add items to the cart.");
      return;
    }

    const cartKey = `cart_${user.username}`;
    const updatedCart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existingItemIndex = updatedCart.findIndex((item) => item.id === product.id);
    if (existingItemIndex !== -1) {
      updatedCart[existingItemIndex].quantity += quantity;
    } else {
      updatedCart.push({ ...product, quantity });
    }

    setCart(updatedCart);
    localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    setAvailableStock((prevStock) => prevStock - quantity);

    window.dispatchEvent(new Event("storage"));
    alert(`${quantity} item(s) added to cart!`);
  };

  // ✅ Buy Now Handler
  const handleBuyNow = () => {
    if (!user) {
      alert("Please log in first to proceed to payment.");
      return;
    }

    if (quantity > availableStock) {
      alert("Not enough stock available!");
      return;
    }

    // Set fixed test price of Rs 150 for all products
    const testProduct = {
      ...product,
      price: 150, // Fixed test price
      quantity
    };

    localStorage.setItem(
      "buy_now_product",
      JSON.stringify(testProduct)
    );

    navigate("/payment"); 
  };

  if (!product) return <div>Loading...</div>;
  if (!product.title) return <div>Product not found</div>;

  return (
    <div className="product-detail">
    
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
            <br />
            <br />
            <Link to="/" className="back-button">← Back to Products</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
