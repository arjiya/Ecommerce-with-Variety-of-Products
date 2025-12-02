
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import "./PaymentSuccess.css";

// const PaymentSuccess = () => {
//   const [showReceipt, setShowReceipt] = useState(false);

//   const handleShowReceipt = () => {
//     setShowReceipt(true);
//   };

//   const handleCloseReceipt = () => {
//     setShowReceipt(false);
//   };

//   const product = JSON.parse(localStorage.getItem("buy_now_product"));
//   const user = JSON.parse(localStorage.getItem("user"));

//   if (!product || !user) {
//     return <div>Unable to fetch product or user data</div>;
//   }

//   const receiptContent = `
//     Receipt
//     ------------------------
//     Buyer: ${user.username}
//     Product: ${product.title}
//     Quantity: ${product.quantity}
//     Price per item: Rs ${product.price}
//     Total: Rs ${product.price * product.quantity}
//     ------------------------
//     Thank you for shopping with us!
//   `;

//   return (
//     <div className="payment-success-container">
//       <div className="success-content">
//         <h2>Payment Successful!</h2>
//         <div className="success-icon">✓</div>
//         <p>Thank you for your purchase. Your order has been placed successfully.</p>
//         <div className="success-actions">
//           <Link to="/" className="continue-shopping">Continue Shopping</Link>
//           <button className="view-orders" onClick={handleShowReceipt}>View Receipt</button>
//         </div>
//       </div>

//       {/* Receipt Modal */}
//       {showReceipt && (
//         <div className="receipt-popup-overlay">
//           <div className="receipt-popup-box">
//             <h3>Receipt</h3>
//             <pre>{receiptContent}</pre>
//             <button onClick={handleCloseReceipt} className="close-receipt-btn">
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentSuccess;



// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./ProductDetail.css";

// function ProductDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [product, setProduct] = useState(null);
//   const [availableStock, setAvailableStock] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [user, setUser] = useState(null);

//   // Recommended products
//   const [recommended, setRecommended] = useState([]);

//   useEffect(() => {
//     // Fetch selected product
//     fetch(`https://fakestoreapi.com/products/${id}`)
//       .then((res) => res.json())
//       .then((data) => {
//         setProduct(data);
//         setAvailableStock(data.rating.count || 10); // fallback stock
//       })
//       .catch((err) => console.error("Error fetching product:", err));

//     // Load user
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     setUser(storedUser);

//     // Fetch Recommendations from backend
//     axios
//       .get(`http://localhost:8000/recommend/${id}`)
//       .then((res) => setRecommended(res.data))
//       .catch((err) => console.log("Recommendation API error:", err));
//   }, [id]);

//   // Add to cart
//   const handleAddToCart = () => {
//     if (!user) {
//       alert("Please log in to add items to the cart.");
//       return;
//     }

//     if (quantity > availableStock) {
//       alert("Not enough stock available!");
//       return;
//     }

//     const cartKey = `cart_${user.username}`;
//     const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];

//     const existingItem = storedCart.find((item) => item.id === product.id);

//     if (existingItem) {
//       existingItem.quantity += quantity;
//     } else {
//       storedCart.push({
//         id: product.id,
//         title: product.title,
//         price: product.price,
//         image: product.image, // ✅ Important for CartPage
//         quantity: quantity
//       });
//     }

//     localStorage.setItem(cartKey, JSON.stringify(storedCart));
//     setAvailableStock((prevStock) => prevStock - quantity);
//     alert(`${quantity} item(s) added to cart!`);
//   };

//   // Buy now
//   const handleBuyNow = () => {
//     if (!user) {
//       alert("Please log in first to proceed to payment.");
//       return;
//     }

//     if (quantity > availableStock) {
//       alert("Not enough stock available!");
//       return;
//     }

//     const buyNowProduct = {
//       id: product.id,
//       title: product.title,
//       price: product.price,
//       image: product.image, // ✅ Important
//       quantity: quantity
//     };

//     localStorage.setItem("buy_now_product", JSON.stringify(buyNowProduct));
//     navigate("/payment");
//   };

//   if (!product) return <div>Loading...</div>;
//   if (!product.title) return <div>Product not found</div>;

//   return (
//     <div className="product-detail">
//       <div className="product-detail-card">
//         <img
//           className="product-detail-image"
//           src={product.image}
//           alt={product.title}
//         />

//         <div className="product-detail-info">
//           <h1>{product.title}</h1>
//           <p className="description">{product.description}</p>
//           <p>
//             <strong>Price:</strong> ${product.price}
//           </p>
//           <p>
//             <strong>Category:</strong> {product.category}
//           </p>
//           <p>
//             <strong>Available Stock:</strong> {availableStock}
//           </p>

//           <div className="quantity-selector">
//             <label>Quantity:</label>
//             <input
//               type="number"
//               value={quantity}
//               onChange={(e) =>
//                 setQuantity(
//                   Math.max(1, Math.min(availableStock, Number(e.target.value)))
//                 )
//               }
//               min="1"
//               max={availableStock}
//             />
//           </div>

//           <div className="button-container">
//             <button className="buy-now" onClick={handleBuyNow}>
//               Buy Now
//             </button>
//             <button className="add-to-cart" onClick={handleAddToCart}>
//               Add to Cart
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Recommended Products */}
//       <h2 className="recommended-title">You May Also Like</h2>
//       <div className="recommended-container">
//         {recommended.length === 0 ? (
//           <p>No recommendations available.</p>
//         ) : (
//           recommended.map((item) => (
//             <div key={item.id} className="recommended-card">
//               <img
//                 src={item.image || "https://via.placeholder.com/150"}
//                 alt={item.title}
//                 className="recommended-img"
//               />
//               <p className="recommended-name">{item.title}</p>

//               <button
//                 className="view-btn"
//                 onClick={() => navigate(`/product/${item.id}`)}
//               >
//                 View
//               </button>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProductDetail;


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductDetail.css";

// Small reusable component for recommended cards
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
  const [availableStock, setAvailableStock] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState(null);

  // Recommendations
  const [youMayLike, setYouMayLike] = useState([]);
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    // Fetch selected product from fake store API
    fetch(`https://fakestoreapi.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setAvailableStock(data.rating?.count || 10); // fallback stock
      })
      .catch((err) => console.error("Error fetching product:", err));

    // Load user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    // Fetch hybrid recommendations from backend
    axios
      .get(`http://localhost:8000/recommend/${id}`)
      .then((res) => {
        setYouMayLike(res.data.you_may_like || []);
        setPopular(res.data.popular || []);
      })
      .catch((err) => console.log("Recommendation API error:", err));
  }, [id]);

  // Add to cart function
  const handleAddToCart = () => {
    if (!user) {
      alert("Please log in to add items to the cart.");
      return;
    }

    if (quantity > availableStock) {
      alert("Not enough stock available!");
      return;
    }

    const cartKey = `cart_${user.username}`;
    const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];

    const existingItem = storedCart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      storedCart.push({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        quantity: quantity,
      });
    }

    localStorage.setItem(cartKey, JSON.stringify(storedCart));
    setAvailableStock((prevStock) => prevStock - quantity);
    alert(`${quantity} item(s) added to cart!`);
  };

  // Buy now function
  const handleBuyNow = () => {
    if (!user) {
      alert("Please log in first to proceed to payment.");
      return;
    }

    if (quantity > availableStock) {
      alert("Not enough stock available!");
      return;
    }

    const buyNowProduct = {
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
      quantity: quantity,
    };

    localStorage.setItem("buy_now_product", JSON.stringify(buyNowProduct));
    navigate("/payment");
  };

  if (!product) return <div>Loading...</div>;
  if (!product.title) return <div>Product not found</div>;

  return (
    <div className="product-detail">
      {/* Main product info */}
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
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.max(1, Math.min(availableStock, Number(e.target.value)))
                )
              }
              min="1"
              max={availableStock}
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

      {/* Content-based recommendations */}
      <h2 className="recommended-title">You May Also Like</h2>
      <div className="recommended-container">
        {youMayLike.length === 0 ? (
          <p>No recommendations available.</p>
        ) : (
          youMayLike.map((item) => (
            <RecommendedCard key={item.id} item={item} navigate={navigate} />
          ))
        )}
      </div>

      {/* Popular products */}
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
