import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './CheckoutPage.css';

function CheckoutPage() {
    const [cart, setCart] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setCart(storedCart);
    }, []);

    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    const handlePlaceOrder = () => {
        if (!name || !email || !address) {
            alert("Please fill in all fields.");
            return;
        }

        alert("Order placed successfully!");
        localStorage.removeItem("cart");
        setCart([]);
        navigate("/");
    };

    return (
        <div className="checkout-page">
            <Link to="/cart" className="back-button">← Back to Cart</Link>
            <h2>Checkout</h2>

            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    <div className="order-summary">
                        <h3>Order Summary</h3>
                        <ul className="checkout-list">
                            {cart.map((item, index) => (
                                <li key={index} className="checkout-item">
                                    <p><strong>{item.title}</strong></p>
                                    <p>Quantity: {item.quantity}</p>
                                    <p>Price: ${item.price * item.quantity}</p>
                                </li>
                            ))}
                        </ul>
                        <h3>Total: ${getTotalPrice()}</h3>
                    </div>

                    <div className="checkout-form">
                        <h3>Billing Details</h3>
                        <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <textarea placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)}></textarea>

                        <Link to="/payment" className="place-order-button" onClick={handlePlaceOrder}>
    Place Order
</Link>

                        
                    </div>
                </>
            )}
        </div>
    );
}

export default CheckoutPage;
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import './CheckoutPage.css';

// function CheckoutPage() {
//     const [cart, setCart] = useState([]);
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [address, setAddress] = useState('');
//     const navigate = useNavigate();

//     useEffect(() => {
//         const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
//         setCart(storedCart);
//     }, []);

//     const getTotalPrice = () => {
//         return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
//     };

//     const handlePlaceOrder = () => {
//         if (!name || !email || !address) {
//             alert("Please fill in all fields.");
//             return;
//         }

//         // Generate a unique transaction ID
//         const transactionId = 'txn_' + Date.now();

//         // Prepare eSewa payment details
//         const paymentDetails = {
//             amt: getTotalPrice(),
//             psc: 0,
//             pdc: 0,
//             txAmt: 0,
//             tAmt: getTotalPrice(),
//             pid: transactionId,
//             scd: 'YOUR_MERCHANT_ID', // Replace with your actual Merchant ID
//             su: 'http://yourwebsite.com/esewa-payment-success', // Replace with your success URL
//             fu: 'http://yourwebsite.com/esewa-payment-failure'  // Replace with your failure URL
//         };

//         // Create a form and submit to eSewa
//         const form = document.createElement('form');
//         form.action = 'https://esewa.com.np/epay/main';
//         form.method = 'POST';

//         Object.keys(paymentDetails).forEach(key => {
//             const input = document.createElement('input');
//             input.type = 'hidden';
//             input.name = key;
//             input.value = paymentDetails[key];
//             form.appendChild(input);
//         });

//         document.body.appendChild(form);
//         form.submit();
//     };

//     return (
//         <div className="checkout-page">
//             <Link to="/cart" className="back-button">← Back to Cart</Link>
//             <h2>Checkout</h2>

//             {cart.length === 0 ? (
//                 <p>Your cart is empty.</p>
//             ) : (
//                 <>
//                     <div className="order-summary">
//                         <h3>Order Summary</h3>
//                         <ul className="checkout-list">
//                             {cart.map((item, index) => (
//                                 <li key={index} className="checkout-item">
//                                     <p><strong>{item.title}</strong></p>
//                                     <p>Quantity: {item.quantity}</p>
//                                     <p>Price: ${item.price * item.quantity}</p>
//                                 </li>
//                             ))}
//                         </ul>
//                         <h3>Total: ${getTotalPrice()}</h3>
//                     </div>

//                     <div className="checkout-form">
//                         <h3>Billing Details</h3>
//                         <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
//                         <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
//                         <textarea placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)}></textarea>

//                         <button className="place-order-button" onClick={handlePlaceOrder}>
//                             Place Order
//                         </button>
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// }

// export default CheckoutPage;
