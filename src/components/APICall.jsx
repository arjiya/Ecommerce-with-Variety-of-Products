
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./APICall.css";

function APICall() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log("Error fetching products:", err));
  }, []);

  return (
    <div className="api">
      <div className="api-container">
        <div className="product-grid">
          {products.map((item) => (
            <div className="product-card" key={item.id}>
              <Link to={`/product/${item.id}`}>
                <img
                  className="product-image"
                  src={item.image || "https://via.placeholder.com/150"}
                  alt={item.title}
                />
              </Link>
              <div className="product-info">
                <div className="font-bold text-xl mb-2">{item.title}</div>
              </div>
              <div className="product-stats">
                <span className="price">Price: ${item.price}</span>
                <span className="category">Category: {item.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default APICall;
