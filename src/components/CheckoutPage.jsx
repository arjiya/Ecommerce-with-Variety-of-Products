// // import React, { useState, useEffect } from 'react';
// // import { Link, useNavigate } from 'react-router-dom';
// // import './CheckoutPage.css';

// // function CheckoutPage() {
// //     const [cart, setCart] = useState([]);
// //     const [name, setName] = useState('');
// //     const [email, setEmail] = useState('');
// //     const [address, setAddress] = useState('');
// //     const navigate = useNavigate();

// //     useEffect(() => {
// //         const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
// //         setCart(storedCart);
// //     }, []);

// //     const getTotalPrice = () => {
// //         return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
// //     };

// //     const handlePlaceOrder = () => {
// //         if (!name || !email || !address) {
// //             alert("Please fill in all fields.");
// //             return;
// //         }

// //         alert("Order placed successfully!");
// //         localStorage.removeItem("cart");
// //         setCart([]);
// //         navigate("/payment");
// //     };

// //     return (
// //         <div className="checkout-page">
// //             <Link to="/cart" className="back-button">← Back to Cart</Link>
// //             <h2>Checkout</h2>

// //             {cart.length === 0 ? (
// //                 <p>Your cart is empty.</p>
// //             ) : (
// //                 <>
// //                     <div className="order-summary">
// //                         <h3>Order Summary</h3>
// //                         <ul className="checkout-list">
// //                             {cart.map((item, index) => (
// //                                 <li key={index} className="checkout-item">
// //                                     <p><strong>{item.title}</strong></p>
// //                                     <p>Quantity: {item.quantity}</p>
// //                                     <p>Price: ${item.price * item.quantity}</p>
// //                                 </li>
// //                             ))}
// //                         </ul>
// //                         <h3>Total: ${getTotalPrice()}</h3>
// //                     </div>

// //                     <div className="checkout-form">
// //                         <h3>Billing Details</h3>
// //                         <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
// //                         <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
// //                         <textarea placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)}></textarea>

// //                         <Link to="/payment" className="place-order-button" onClick={handlePlaceOrder}>
// //     Place Order
// // </Link>

                        
// //                     </div>
// //                 </>
// //             )}
// //         </div>
// //     );
// // }

// // export default CheckoutPage;
// import React from "react";
// import { useNavigate } from "react-router-dom";

// const Checkout = ({ user, cart }) => {
//   const navigate = useNavigate();

//   const handleKhaltiPayment = async () => {
//     // Assuming Khalti checkout is already configured
//     KhaltiCheckout.show({
//       amount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100,
//       onSuccess: async (payload) => {
//         // Send payment info to backend
//         const res = await fetch("/api/payment-success", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             user_id: user.id,
//             transaction_id: payload.transaction_id,
//             pid: payload.idx,
//             amount: payload.amount / 100,
//             status: "Completed",
//           }),
//         });

//         const data = await res.json();
//         if (data.success) {
//           // Clear frontend cart if stored in localStorage
//           localStorage.removeItem("buy_now_product");
//           navigate("/payment-success");
//         } else {
//           alert("Payment processing failed: " + data.message);
//         }
//       },
//       onError: (err) => {
//         console.error("Payment Error:", err);
//       },
//     });
//   };

//   return (
//     <div>
//       <h2>Checkout</h2>
//       <button onClick={handleKhaltiPayment}>Pay with Khalti</button>
//     </div>
//   );
// };

// export default Checkout;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedCart = JSON.parse(localStorage.getItem("buy_now_product")) || [];
    setUser(storedUser);
    setCart(storedCart);
  }, []);

  const handleKhaltiPayment = async () => {
    if (!user || cart.length === 0) {
      alert("No user logged in or cart is empty");
      return;
    }

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100; // paisa

    const config = {
      // Replace with your test public key
      publicKey: "test_public_key_1234567890abcdef",
      productIdentity: "cart_001",
      productName: "Shopnest Cart Items",
      productUrl: "http://localhost:3000/checkout",
      eventHandler: {
        onSuccess: async (payload) => {
          // Send payment to backend for verification & order creation
          const res = await fetch("http://127.0.0.1:5000/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token: payload.token,
              amount: payload.amount,
              user_id: user.id,
              items: cart.map(p => ({
                id: p.id,
                price: p.price,
                quantity: p.quantity
              }))
            })
          });

          const data = await res.json();

          if (data.success) {
            // Clear localStorage cart
            localStorage.removeItem("buy_now_product");

            // Update frontend cart state
            setCart([]);

            // Redirect to PaymentSuccess page
            navigate("/payment-success");
          } else {
            alert("Payment verification failed: " + data.message);
          }
        },
        onError: (err) => {
          console.error("Payment Error:", err);
          alert("Payment failed. Try again.");
        },
        onClose: () => {
          console.log("Payment widget closed");
        }
      },
      amount: totalAmount
    };

    // Initialize Khalti Checkout
    const khaltiCheckout = new KhaltiCheckout(config);
    khaltiCheckout.show({ amount: totalAmount });
  };

  return (
    <div>
      <h2>Checkout</h2>
      <ul>
        {cart.map(item => (
          <li key={item.id}>
            {item.title} - Rs {item.price} x {item.quantity}
          </li>
        ))}
      </ul>
      <h3>Total: Rs {cart.reduce((sum, i) => sum + i.price * i.quantity, 0)}</h3>
      <button onClick={handleKhaltiPayment}>Pay with Khalti</button>
    </div>
  );
};

export default Checkout;
