

// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./ProductDetail.css";

// // Small reusable component for recommended cards
// function RecommendedCard({ item, navigate }) {
//   return (
//     <div className="recommended-card">
//       <img
//         src={item.image || "https://via.placeholder.com/150"}
//         alt={item.title}
//         className="recommended-img"
//       />
//       <p className="recommended-name">{item.title}</p>
//       <button
//         className="view-btn"
//         onClick={() => navigate(`/product/${item.id}`)}
//       >
//         View
//       </button>
//     </div>
//   );
// }

// function ProductDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [product, setProduct] = useState(null);
//   const [availableStock, setAvailableStock] = useState(0);
//   const [quantity, setQuantity] = useState(1);
//   const [user, setUser] = useState(null);

//   // Recommendations
//   const [youMayLike, setYouMayLike] = useState([]);
//   const [popular, setPopular] = useState([]);

  
//   // Add to cart function
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
//         image: product.image,
//         quantity: quantity,
//       });
//     }

//     localStorage.setItem(cartKey, JSON.stringify(storedCart));
//     setAvailableStock((prevStock) => prevStock - quantity);
//     alert(`${quantity} item(s) added to cart!`);
//   };

//   // Buy now function
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
//       image: product.image,
//       quantity: quantity,
//     };

//     localStorage.setItem("buy_now_product", JSON.stringify(buyNowProduct));
//     navigate("/payment");
//   };

//   if (!product) return <div>Loading...</div>;
//   if (!product.title) return <div>Product not found</div>;

//   return (
//     <div className="product-detail">
//       {/* Main product info */}
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

//       {/* Content-based recommendations */}
//       <h2 className="recommended-title">You May Also Like</h2>
//       <div className="recommended-container">
//         {youMayLike.length === 0 ? (
//           <p>No recommendations available.</p>
//         ) : (
//           youMayLike.map((item) => (
//             <RecommendedCard key={item.id} item={item} navigate={navigate} />
//           ))
//         )}
//       </div>

//       {/* Popular products */}
//       <h2 className="recommended-title">Popular Products</h2>
//       <div className="recommended-container">
//         {popular.length === 0 ? (
//           <p>No popular products available.</p>
//         ) : (
//           popular.map((item) => (
//             <RecommendedCard key={item.id} item={item} navigate={navigate} />
//           ))
//         )}
//       </div>
//     </div>
//   );
// }

// export default ProductDetail;



// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import "./ProductDetail.css";

// function ProductDetail() {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [recommendations, setRecommendations] = useState([]);

//   useEffect(() => {
//     // Fetch single product
//     fetch(`http://127.0.0.1:5000/product/${id}`)
//       .then(res => res.json())
//       .then(data => setProduct(data))
//       .catch(err => console.log(err));

//     // Fetch recommendations
//     fetch(`http://127.0.0.1:5000/recommend/${id}`)
//       .then(res => res.json())
//       .then(data => setRecommendations(data.you_may_like || []))
//       .catch(err => console.log(err));
//   }, [id]);

//   if (!product) return <p>Loading product...</p>;

//   return (
//     <div>
//       <h1>{product.title}</h1>
//       <img
//         src={product.image || "https://via.placeholder.com/200"}
//         alt={product.title}
//         width="200"
//       />
//       <p>{product.description}</p>
//       <p>Price: ${product.price}</p>
//       <p>Category: {product.category}</p>

//       <h2>You May Also Like</h2>
//       <div style={{ display: "flex", gap: "20px" }}>
//         {recommendations.map(item => (
//           <div key={item.id}>
//             <img
//               src={item.image || "https://via.placeholder.com/100"}
//               alt={item.title}
//               width="100"
//             />
//             <p>{item.title}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default ProductDetail;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  const [availableStock, setAvailableStock] = useState(10);
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState(null);

  const [youMayLike, setYouMayLike] = useState([]);
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    // Fetch product from backend CSV
    fetch(`http://127.0.0.1:5000/product/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setAvailableStock(data.rating?.count || 10); // fallback
      })
      .catch((err) => console.log("Error fetching product:", err));

    // Load user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    // Fetch recommendations from backend
    fetch(`http://127.0.0.1:5000/recommend/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setYouMayLike(data.you_may_like || []);
        setPopular(data.popular || []);
      })
      .catch((err) => console.log("Error fetching recommendations:", err));
  }, [id]);

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
    setAvailableStock((prev) => prev - quantity);
    alert(`${quantity} item(s) added to cart!`);
  };

  const handleBuyNow = () => {
    if (!user) {
      alert("Please log in first to proceed to payment.");
      return;
    }

    if (quantity > availableStock) {
      alert("Not enough stock available!");
      return;
    }

    localStorage.setItem(
      "buy_now_product",
      JSON.stringify({ ...product, quantity })
    );
    navigate("/payment");
  };

  if (!product) return <p>Loading product...</p>;

  return (
    <div className="product-detail">
      {/* Main product info */}
      <div className="product-detail-card">
        <img
          className="product-detail-image"
          src={product.image || "https://via.placeholder.com/300"}
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

      {/* Recommendations */}
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
