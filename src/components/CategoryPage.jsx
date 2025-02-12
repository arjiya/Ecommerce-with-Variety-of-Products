import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./CategoryPage.css"; // Create this CSS file for styling

const CategoryPage = () => {
  const { category } = useParams(); // Get the category from URL
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://fakestoreapi.com/products/category/${category}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching category products:", err));
  }, [category]);

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="category-page">
      <h2>Category: {category.replace("-", " ")}</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image} alt={product.title} className="product-image" />
            <h3>{product.title}</h3>
            <p>${product.price}</p>
            <Link to={`/product/${product.id}`} className="view-details">View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
