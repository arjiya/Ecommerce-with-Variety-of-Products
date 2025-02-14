
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './APICall.css';

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [availableStock, setAvailableStock] = useState(0);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        fetch(`https://fakestoreapi.com/products/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                setAvailableStock(data.rating.count);
            })
            .catch((err) => console.error("Error fetching product details:", err));

        // Load cart from localStorage
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, [id]);

    const handleBuyNow = () => {
        if (availableStock > 0) {
            setAvailableStock(prevStock => prevStock - 1);
            alert('Order placed successfully!');
        } else {
            alert('Out of stock!');
        }
    };

    const handleAddToCart = () => {
        if (availableStock > 0) {
            let updatedCart = [...cart, product];
            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            alert('Product added to cart!');
        } else {
            alert('Out of stock!');
        }
    };

    if (!product) return <div>Loading...</div>;
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
                    <p><strong>Available:</strong> {availableStock}</p>
                    <p><strong>Rating:</strong> {product.rating.rate} ⭐</p>

                    <div className="button-container">
                        <button className="buy-now" onClick={handleBuyNow}>Buy Now</button>
                        <button className="add-to-cart" onClick={handleAddToCart}>Add to Cart</button>
                    </div>
                </div>
            </div>

            {/* Cart Section */}
            <div className="cart-section">
                <h2>Shopping Cart</h2>
                {cart.length === 0 ? (
                    <p>Your cart is empty</p>
                ) : (
                    <ul className="cart-list">
                        {cart.map((item, index) => (
                            <li key={index} className="cart-item">
                                <img src={item.image} alt={item.title} className="cart-item-image" />
                                <div>
                                    <p>{item.title}</p>
                                    <p><strong>Price:</strong> ${item.price}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
                <Link to="/CartPage" className="cart-button"> View Full Cart</Link>
            </div>
        </div>
    );
}

export default ProductDetail;
