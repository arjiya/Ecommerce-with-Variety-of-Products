
// import KhaltiCheckout from "khalti-checkout-web";
// import React, { useEffect, useState } from "react";
// import khaltiConfig from "./khaltiConfig";
// import "./Payment.css";

// const Payment = () => {
//     const [amount, setAmount] = useState(0);
//     const [loading, setLoading] = useState(false);
//     const [formData, setFormData] = useState({
//         fullName: "",
//         phone: "",
//         address: "",
//         city: "",
//         postalCode: ""
//     });

//     useEffect(() => {
//         const buyNowProduct = JSON.parse(localStorage.getItem("buy_now_product"));
//         const cart = JSON.parse(localStorage.getItem("cart")) || [];

//         let totalAmount = 0;
//         if (buyNowProduct) {
//             totalAmount = buyNowProduct.price * buyNowProduct.quantity;
//         } else if (cart.length > 0) {
//             totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
//         }

//         setAmount(Math.min(totalAmount, 200)); // Limit for testing
//     }, []);

//     const handlePayment = () => {
//         if (!isFormValid()) return;
//         setLoading(true);
//         try {
//             const checkout = new KhaltiCheckout(khaltiConfig);
//             checkout.show({ amount: amount * 100 });
//         } catch (error) {
//             console.error("Khalti error:", error);
//             setLoading(false);
//         }
//     };

//     const isFormValid = () => {
//         return Object.values(formData).every(field => field.trim() !== "");
//     };

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     return (
//         <div className="daraz-payment-page">
//             <h1 className="page-title">Checkout</h1>
//             <div className="payment-section">
//                 <div className="delivery-card">
//                     <h2>Delivery Information</h2>
//                     <form className="delivery-form">
//                         <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
//                         <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
//                         <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
//                         <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
//                         <input type="text" name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} required />
//                     </form>
//                 </div>

//                 <div className="summary-card">
//                     <h2>Order Summary</h2>
//                     <p className="amount-display">Total Amount: <strong>Rs. {amount}</strong></p>
//                     {amount > 200 && (
//                         <p className="warning-message">
//                             Note: Amount is limited to Rs. 200 for testing purposes.
//                         </p>
//                     )}
//                     <button 
//                         className="khalti-button"
//                         onClick={handlePayment}
//                         disabled={loading || amount === 0 || !isFormValid()}
//                     >
//                         {loading ? "Processing..." : "Pay with Khalti"}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Payment;
import KhaltiCheckout from "khalti-checkout-web";
import React, { useEffect, useState } from "react";
import khaltiConfig from "./khaltiConfig";
import "./Payment.css";

const Payment = () => {
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: ""
  });
  const [cartItems, setCartItems] = useState([]);
  const user_id = localStorage.getItem("user_id"); // assume you store logged-in user id

  useEffect(() => {
    const buyNowProduct = JSON.parse(localStorage.getItem("buy_now_product"));
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    let totalAmount = 0;
    if (buyNowProduct) {
      totalAmount = buyNowProduct.price * buyNowProduct.quantity;
      setCartItems([buyNowProduct]);
    } else if (cart.length > 0) {
      totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
      setCartItems(cart);
    }

    setAmount(Math.min(totalAmount, 200)); // testing limit
  }, []);

  const isFormValid = () => Object.values(formData).every(field => field.trim() !== "");

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handlePayment = () => {
    if (!isFormValid()) return;
    setLoading(true);

    try {
      const checkout = new KhaltiCheckout({
        ...khaltiConfig,
        amount: amount * 100,
        onSuccess: async (payload) => {
          try {
            // 1️⃣ Save payment to backend
            const paymentRes = await fetch("http://localhost:5000/api/payments", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                transaction_id: payload.idx,
                pid: payload.pidx,
                amount,
                status: "success",
                user_id
              })
            });
            const paymentData = await paymentRes.json();
            if (!paymentData.success) throw new Error("Payment save failed");

            // 2️⃣ Place order with payment_id
            const orderRes = await fetch("http://localhost:5000/api/orders/place_with_payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                user_id,
                items: cartItems.map(item => ({
                  id: item.id,
                  quantity: item.quantity,
                  price: item.price
                })),
                total_price: amount,
                payment_id: paymentData.payment_id
              })
            });
            const orderData = await orderRes.json();
            if (!orderData.success) throw new Error("Order placement failed");

            // 3️⃣ Clear local cart & notify user
            localStorage.removeItem("cart");
            localStorage.removeItem("buy_now_product");
            alert("Payment successful! Order ID: " + orderData.order_id);
          } catch (err) {
            console.error(err);
            alert("Something went wrong during payment/order process");
          } finally {
            setLoading(false);
          }
        },
        onError: (error) => {
          console.error("Khalti Error:", error);
          alert("Payment failed!");
          setLoading(false);
        }
      });
      checkout.show();
    } catch (err) {
      console.error("Checkout Init Error:", err);
      setLoading(false);
    }
  };

  return (
    <div className="daraz-payment-page">
      <h1 className="page-title">Checkout</h1>
      <div className="payment-section">
        <div className="delivery-card">
          <h2>Delivery Information</h2>
          <form className="delivery-form">
            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
            <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
            <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
            <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
            <input type="text" name="postalCode" placeholder="Postal Code" value={formData.postalCode} onChange={handleChange} required />
          </form>
        </div>

        <div className="summary-card">
          <h2>Order Summary</h2>
          <p className="amount-display">Total Amount: <strong>Rs. {amount}</strong></p>
          {amount > 200 && (
            <p className="warning-message">Note: Amount limited to Rs. 200 for testing</p>
          )}
          <button
            className="khalti-button"
            onClick={handlePayment}
            disabled={loading || amount === 0 || !isFormValid()}
          >
            {loading ? "Processing..." : "Pay with Khalti"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
