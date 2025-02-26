import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Payment = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      alert("Please log in first to make a payment.");
      navigate("/login");
    } else {
      setUser(storedUser);
      const cartKey = `cart_${storedUser.username}`;
      const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
      setCart(storedCart);
      const total = storedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setTotalAmount(total);
    }
  }, [navigate]);

  const handleEsewaPayment = () => {
    if (totalAmount <= 0) {
      alert("Your cart is empty! Add some items before proceeding.");
      return;
    }

    const transactionId = `TXN_${new Date().getTime()}`; // Unique Transaction ID
    const esewaUrl = `https://rc-epay.esewa.com.np/api/epay/main`;

    const params = {
      amt: totalAmount,
      psc: 0, // Service Charge
      pdc: 0, // Delivery Charge
      txAmt: 0, // Tax Amount
      tAmt: totalAmount, // Total Amount
      pid: transactionId, // Unique transaction ID
      scd: "epay_payment", // eSewa Test Merchant Code
      su: `http://localhost:3000/payment-success?txn_id=${transactionId}`, // Success Redirect URL
      fu: "http://localhost:3000/payment-failed", // Failure Redirect URL
    };

    // Create a form dynamically to submit to eSewa
    const form = document.createElement("form");
    form.method = "POST";
    form.action = esewaUrl;

    Object.keys(params).forEach((key) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = params[key];
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="payment-container">
      <h2>Payment Summary</h2>
      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            {item.title} - ${item.price} × {item.quantity}
          </li>
        ))}
      </ul>
      <h3>Total Amount: ${totalAmount}</h3>
      
      <button className="esewa-btn" onClick={handleEsewaPayment}>
        Pay with eSewa
      </button>

      <button className="back-btn" onClick={() => navigate("/cart")}>
        Back to Cart
      </button>
    </div>
  );
};

export default Payment;
