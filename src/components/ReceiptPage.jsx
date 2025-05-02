import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ReceiptPage.css";

const ReceiptPage = () => {
  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchedProduct = JSON.parse(localStorage.getItem("buy_now_product"));
    const fetchedUser = JSON.parse(localStorage.getItem("user"));

    if (fetchedProduct && fetchedUser) {
      setProduct(fetchedProduct);
      setUser(fetchedUser);
    }
  }, []);

  const handleDownloadReceipt = () => {
    if (!product || !user) {
      alert("No product or user information found.");
      return;
    }

    const receiptContent = `
      Receipt
      ------------------------
      Buyer: ${user.username}
      Product: ${product.title}
      Quantity: ${product.quantity}
      Price per item: Rs ${product.price}
      Total: Rs ${product.price * product.quantity}
      ------------------------
      Thank you for shopping with us!
    `;

    const blob = new Blob([receiptContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "receipt.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!product || !user) {
    return <div>Loading receipt...</div>;
  }

  return (
    <div className="receipt-page-container">
      <h2>Receipt</h2>
      <div className="receipt-details">
        <p><strong>Buyer:</strong> {user.username}</p>
        <p><strong>Product:</strong> {product.title}</p>
        <p><strong>Quantity:</strong> {product.quantity}</p>
        <p><strong>Price per item:</strong> Rs {product.price}</p>
        <p><strong>Total:</strong> Rs {product.price * product.quantity}</p>
      </div>
      <div className="receipt-actions">
        <button className="download-receipt" onClick={handleDownloadReceipt}>Download Receipt</button>
        <Link to="/" className="continue-shopping">Continue Shopping</Link>
      </div>
    </div>
  );
};

export default ReceiptPage;
