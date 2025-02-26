import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-failed">
      <h2>Payment Failed! ❌</h2>
      <p>Something went wrong. Please try again.</p>
      <button onClick={() => navigate("/payment")}>Try Again</button>
    </div>
  );
};

export default PaymentFailed;
