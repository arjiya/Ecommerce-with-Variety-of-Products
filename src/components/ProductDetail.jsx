import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoginPopup from "./LoginPopup";
import "./ProductDetail.css";


// Reusable recommendation card
function RecommendedCard({ item, navigate }) {
  if (!item) return null;
  return (
    <div className="recommended-card">
      <img
        src={item.image || "https://via.placeholder.com/150"}
        alt={item.title || "Product"}
        className="recommended-img"
      />
      <p className="recommended-name">{item.title || "Unknown"}</p>
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
  const [error, setError] = useState(null);

  const [youMayLike, setYouMayLike] = useState([]);
  const [popular, setPopular] = useState([]);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    // Load user
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    } catch (e) {
      console.error("Error loading user from local storage", e);
    }

    if (!id) return;

    // Fetch product details
    fetch(`http://127.0.0.1:5000/api/product/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setProduct(data);
          setAvailableStock(data.rating_count || 10);
        }
      })
      .catch((err) => {
        console.error("Product fetch error:", err);
        setError("Failed to load product");
      });

    // Fetch recommendations
    fetch(`http://127.0.0.1:5000/api/recommend/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setYouMayLike(data.you_may_like || []);
        setPopular(data.popular || []);
      })
      .catch((err) => console.log("Recommendation error:", err));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }

    if (quantity > availableStock)
      return alert("Not enough stock available.");

    try {
      const response = await fetch("http://127.0.0.1:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          product_id: product.id,
          quantity: quantity
        }),
      });
      const data = await response.json();
      if (data.success) {
        alert("Item added to cart!");
        setAvailableStock((prev) => prev - quantity);
        // Force header update
        window.dispatchEvent(new Event("cartUpdated"));
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.log("Error adding to cart:", err);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }

    if (quantity > availableStock)
      return alert("Not enough stock available!");

    localStorage.setItem(
      "buy_now_product",
      JSON.stringify({ ...product, quantity })
    );

    navigate("/payment");
  };

  if (error) return <p className="error-text">{error}</p>;
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
          youMayLike.map((item, index) => (
            <RecommendedCard key={item.id || index} item={item} navigate={navigate} />
          ))
        )}
      </div>

      <h2 className="recommended-title">Popular Products</h2>
      <div className="recommended-container">
        {popular.length === 0 ? (
          <p>No popular products available.</p>
        ) : (
          popular.map((item, index) => (
            <RecommendedCard key={item.id || index} item={item} navigate={navigate} />
          ))
        )}
      </div>

      {showLoginPopup && (
        <LoginPopup onClose={() => setShowLoginPopup(false)} />
      )}
    </div>
  );
}

export default ProductDetail;
