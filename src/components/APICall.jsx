
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./APICall.css";

function APICall() {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Load all products
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.log("Error fetching products:", err));
  }, []);

  // Search function
  const handleSearch = () => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    fetch(`http://127.0.0.1:5000/api/search?q=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setSearchResults([]);
        } else {
          setSearchResults(data);
        }
      })
      .catch((err) => console.log("Search error:", err));
  };

  const displayProducts = searchResults.length > 0 ? searchResults : products;

  return (
    <div className="api">
      <div className="api-container">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        <div className="product-grid">
          {displayProducts.map((item) => (
            <div className="product-card" key={item.id}>
              
              <Link to={`/product/${item.id}`}>
                <img
                  className="product-image"
                  src={item.image || "https://via.placeholder.com/150"}
                  alt={item.title}
                />
              </Link>

              <div className="product-info">
                {item.title}
              </div>

              <div className="product-stats">
                <span>Price: ${item.price}</span>
                <span>Category: {item.category}</span>
              </div>

              {/* VIEW BUTTON */}
              <Link to={`/product/${item.id}`} className="view-btn">
                View
              </Link>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default APICall;
