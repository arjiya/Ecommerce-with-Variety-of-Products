// import React, { useEffect, useState } from "react";
// import { useParams, Link } from "react-router-dom";
// import "./SearchResults.css";

// const SearchResults = () => {
//   const { query } = useParams();
//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);

//   useEffect(() => {
//     fetch("https://fakestoreapi.com/products")
//       .then((res) => res.json())
//       .then((data) => {
//         setProducts(data);
//         const filtered = data.filter((product) =>
//           product.title.toLowerCase().includes(query.toLowerCase())
//         );
//         setFilteredProducts(filtered);
//       })
//       .catch((err) => console.error("Error fetching products:", err));
//   }, [query]);

//   return (
//     <div className="search-results">
//       <h2>Search Results for "{query}"</h2>

//       {filteredProducts.length === 0 ? (
//         <p>No products found.</p>
//       ) : (
//         <div className="product-list">
//           {filteredProducts.map((product) => (
//             <div key={product.id} className="product-card">
//               <img src={product.image} alt={product.title} />
//               <h3>{product.title}</h3>
//               <p>${product.price}</p>
//               <Link to={`/product/${product.id}`} className="view-details">
//                 View Details
//               </Link>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SearchResults;
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./SearchResults.css";

const SearchResults = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("query");
  const category = params.get("category");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    let apiUrl = "https://fakestoreapi.com/products";
    if (category !== "all") {
      apiUrl = `https://fakestoreapi.com/products/category/${category}`;
    }

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        const filteredProducts = data.filter((product) =>
          product.title.toLowerCase().includes(query.toLowerCase())
        );
        setProducts(filteredProducts);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, [query, category]);

  return (
    <div className="search-results">
      <h2>Search Results for "{query}" in {category === "all" ? "All Categories" : category}</h2>

      {loading ? (
        <p>Loading products...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-list">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.title} />
              <h3>{product.title}</h3>
              <p>${product.price}</p>
              <Link to={`/product/${product.id}`} className="view-details">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
