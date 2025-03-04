import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const txn_id = searchParams.get("txn_id");
    const amount = 1000; // Replace with actual amount from state

    if (txn_id) {
      fetch("http://localhost:5000/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txn_id, amount }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert("Payment Successful!");
          } else {
            alert("Payment Verification Failed!");
            navigate("/payment-failed");
          }
        });
    }
  }, [searchParams, navigate]);

  return <h2>Payment Successful! Thank you for your purchase.</h2>;
};

export default PaymentSuccess;
