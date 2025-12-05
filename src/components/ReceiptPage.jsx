import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ReceiptPage.css";

const ReceiptPage = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    // Fetch user orders
    fetch(`http://127.0.0.1:5000/api/orders/${storedUser.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Get the latest order (first in list as backend sorts desc)
          setOrder(data[0]);
        } else {
          setOrder(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching orders:", err);
        setLoading(false);
      });
  }, [navigate]);

  const handleDownloadReceipt = () => {
    if (!order) return;

    const receiptContent = `
      SHOPNEST RECEIPT
      ------------------------
      Order ID: ${order.id}
      Transaction ID: ${order.transaction_id || "N/A"}
      Date: ${order.created_at}
      ------------------------
      Items:
      ${order.items.map(item => `${item.title} (x${item.quantity}) - Rs ${item.price_at_purchase * item.quantity}`).join('\n      ')}
      ------------------------
      Total With Tax: Rs ${order.total_price}
      Status: ${order.status}
      ------------------------
      Thank you for shopping with ShopNest!
    `;

    const blob = new Blob([receiptContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `receipt_order_${order.id}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="receipt-container">Loading receipt...</div>;

  if (!order) {
    return (
      <div className="receipt-container">
        <h2>No Orders Found</h2>
        <Link to="/" className="continue-shopping">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="receipt-page-container">
      <div className="receipt-card">
        <h2>Payment Receipt</h2>
        <div className="receipt-header">
          <p><strong>Order ID:</strong> #{order.id}</p>
          <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
          <p><strong>Status:</strong> <span className="status-badge">{order.status}</span></p>
        </div>

        <div className="receipt-items">
          <h3>Items Purchased</h3>
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>
                <span>{item.title} x {item.quantity}</span>
                <span>Rs {item.price_at_purchase * item.quantity}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="receipt-total">
          <h3>Total Paid: Rs {order.total_price}</h3>
          {order.transaction_id && <p className="transaction-id">Transaction ID: {order.transaction_id}</p>}
        </div>

        <div className="receipt-actions">
          <button className="download-receipt" onClick={handleDownloadReceipt}>Download Receipt</button>
          <Link to="/" className="continue-shopping">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default ReceiptPage;
