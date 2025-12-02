
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetail.css";

// Reusable recommendation card
function RecommendedCard({ item, navigate }) {
  return (
    <div className="recommended-card">
      <img
        src={item.image || "https://via.placeholder.com/150"}
        alt={item.title}
        className="recommended-img"
      />
      <p className="recommended-name">{item.title}</p>
      <button
        className="view-btn"
        onClick={() => navigate(`/product/${item.id}`)}
      >
        View
      </button>
    </div>
  );
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [availableStock, setAvailableStock] = useState(10);
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState(null);

  const [youMayLike, setYouMayLike] = useState([]);
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    // Load user
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    // Fetch product details
    fetch(`http://127.0.0.1:5000/api/product/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setAvailableStock(data.rating_count || 10); // fallback
      })
      .catch((err) => console.log("Product fetch error:", err));

    // Fetch recommendations
    fetch(`http://127.0.0.1:5000/api/recommend/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setYouMayLike(data.you_may_like || []);
        setPopular(data.popular || []);
      })
      .catch((err) => console.log("Recommendation error:", err));
  }, [id]);

  const handleAddToCart = () => {
    if (!user) return alert("Please log in first.");

    if (quantity > availableStock)
      return alert("Not enough stock available.");

    const cartKey = `cart_${user.username}`;
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existing = storedCart.find((i) => i.id === product.id);
    if (existing) existing.quantity += quantity;
    else
      storedCart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity,
      });

    localStorage.setItem(cartKey, JSON.stringify(storedCart));
    setAvailableStock((prev) => prev - quantity);
    alert("Item added to cart!");
  };

  const handleBuyNow = () => {
    if (!user) return alert("Please log in first.");

    if (quantity > availableStock)
      return alert("Not enough stock available!");

    localStorage.setItem(
      "buy_now_product",
      JSON.stringify({ ...product, quantity })
    );

    navigate("/payment");
  };

  if (!product) return <p>Loading product...</p>;

  return (
    <div className="product-detail">
      <div className="product-detail-card">
        <img
          className="product-detail-image"
          src={product.image}
          alt={product.title}
        />

        <div className="product-detail-info">
          <h1>{product.title}</h1>
          <p className="description">{product.description}</p>
          <p>
            <strong>Price:</strong> ${product.price}
          </p>
          <p>
            <strong>Category:</strong> {product.category}
          </p>
          <p>
            <strong>Available Stock:</strong> {availableStock}
          </p>

          <div className="quantity-selector">
            <label>Quantity:</label>
            <input
              type="number"
              min="1"
              max={availableStock}
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.max(1, Math.min(availableStock, Number(e.target.value)))
                )
              }
            />
          </div>

          <div className="button-container">
            <button className="buy-now" onClick={handleBuyNow}>
              Buy Now
            </button>
            <button className="add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <h2 className="recommended-title">You May Also Like</h2>
      <div className="recommended-container">
        {youMayLike.length === 0 ? (
          <p>No recommendations found.</p>
        ) : (
          youMayLike.map((item) => (
            <RecommendedCard key={item.id} item={item} navigate={navigate} />
          ))
        )}
      </div>

      <h2 className="recommended-title">Popular Products</h2>
      <div className="recommended-container">
        {popular.length === 0 ? (
          <p>No popular products available.</p>
        ) : (
          popular.map((item) => (
            <RecommendedCard key={item.id} item={item} navigate={navigate} />
          ))
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
