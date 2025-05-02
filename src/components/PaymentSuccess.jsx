// import React from "react";
// import { Link } from "react-router-dom";
// import "./PaymentSuccess.css";

// const PaymentSuccess = () => {
//     return (
//         <div className="payment-success-container">
//             <div className="success-content">
//                 <h2>Payment Successful!</h2>
//                 <div className="success-icon">✓</div>
//                 <p>Thank you for your purchase. Your order has been placed successfully.</p>
//                 <div className="success-actions">
//                     <Link to="/" className="continue-shopping">Continue Shopping</Link>
//                     <Link to="/" className="view-orders">Download Receipt</Link>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default PaymentSuccess;
import React from "react";
import { Link } from "react-router-dom";
import "./PaymentSuccess.css";

const PaymentSuccess = () => {
  const handleDownloadReceipt = () => {
    const product = JSON.parse(localStorage.getItem("buy_now_product"));
    const user = JSON.parse(localStorage.getItem("user"));

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

  return (
    <div className="payment-success-container">
      <div className="success-content">
        <h2>Payment Successful!</h2>
        <div className="success-icon">✓</div>
        <p>Thank you for your purchase. Your order has been placed successfully.</p>
        <div className="success-actions">
          <Link to="/" className="continue-shopping">Continue Shopping</Link>
          <button className="view-orders" onClick={handleDownloadReceipt}> Receipt</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
