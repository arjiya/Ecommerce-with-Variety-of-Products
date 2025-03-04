
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import KhaltiCheckout from "khalti-checkout-web";
import khaltiConfig from "./KhaltiConfig"; // Import Khalti configuration
import "./Payment.css";

const Payment = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    address: "",
    contact: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) {
      alert("Please log in first to make a payment.");
      navigate("/login");
    } else {
      setUser(storedUser);
      setCustomerInfo((prev) => ({ ...prev, name: storedUser.username }));

      // 🔹 Check if user clicked "Buy Now"
      const buyNowProduct = JSON.parse(localStorage.getItem("buy_now_product"));
      if (buyNowProduct) {
        setCart([buyNowProduct]);
        setTotalAmount(buyNowProduct.price * buyNowProduct.quantity);
      } else {
        // 🔹 Otherwise, load full cart
        const cartKey = `cart_${storedUser.username}`;
        const storedCart = JSON.parse(localStorage.getItem(cartKey)) || [];
        setCart(storedCart);
        const total = storedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalAmount(total);
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  // ✅ eSewa Payment Handler
  const handleEsewaPayment = () => {
    if (!customerInfo.name || !customerInfo.address || !customerInfo.contact) {
      alert("Please fill in all the required details before proceeding.");
      return;
    }

    if (totalAmount <= 0) {
      alert("Your cart is empty! Add some items before proceeding.");
      return;
    }

    const transactionId = `TXN_${new Date().getTime()}`;
    const esewaUrl = "https://esewa.com.np/#/home";

    const params = {
      amt: totalAmount,
      psc: 0,
      pdc: 0,
      txAmt: 0,
      tAmt: totalAmount,
      pid: transactionId,
      scd: "epay_payment",
      su: `http://localhost:3000/payment-success?txn_id=${transactionId}`,
      fu: "http://localhost:3000/payment-failed",
    };

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

  // ✅ Khalti Payment Handler
  const handleKhaltiPayment = () => {
    if (!customerInfo.name || !customerInfo.address || !customerInfo.contact) {
      alert("Please fill in all the required details before proceeding.");
      return;
    }

    if (totalAmount <= 0) {
      alert("Your cart is empty! Add some items before proceeding.");
      return;
    }

    const checkout = new KhaltiCheckout(khaltiConfig);
    checkout.show({ amount: totalAmount * 100 }); // Khalti expects amount in Paisa
  };

  return (
    <div className="payment-container">
      <h2>Payment Summary</h2>

      <div className="customer-form">
        <label>
          Full Name:
          <input type="text" name="name" value={customerInfo.name} onChange={handleChange} required />
        </label>
        <label>
          Address:
          <input type="text" name="address" value={customerInfo.address} onChange={handleChange} required />
        </label>
        <label>
          Contact Number:
          <input type="text" name="contact" value={customerInfo.contact} onChange={handleChange} required />
        </label>
      </div>

      <ul className="cart-items">
        {cart.map((item) => (
          <li key={item.id}>
            {item.title} - ${item.price} × {item.quantity}
          </li>
        ))}
      </ul>
      <h3>Total Amount: ${totalAmount}</h3>

      {/* ✅ Payment Buttons */}
      <button className="esewa-btn" onClick={handleEsewaPayment}>
        Pay with eSewa
      </button>

      <button className="khalti-btn" onClick={handleKhaltiPayment}>
        Pay with Khalti
      </button>

      <button className="back-btn" onClick={() => navigate("/cart")}>
        Back to Cart
      </button>
    </div>
  );
};

export default Payment;
