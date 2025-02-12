
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; 
import './APICall.css';

function ProductDetail() {
    const { id } = useParams();  // Retrieve the product ID from the URL
    const [product, setProduct] = useState(null);

    // Log the product ID
    console.log('Product ID:', id);

    useEffect(() => {
        fetch(`https://fakestoreapi.com/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                console.log('Fetched product:', data);
                setProduct(data);
            })
            .catch((err) => console.error("Error fetching product details:", err));
    }, [id]);

    // If the product is not found yet, show a loading message
    if (!product) return <div>Loading...</div>;

    // If product data is not available, show an error message
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
                    <p><strong>Available:</strong> {product.rating.count}</p>
                    <p><strong>Rating:</strong> {product.rating.rate} ⭐</p>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
