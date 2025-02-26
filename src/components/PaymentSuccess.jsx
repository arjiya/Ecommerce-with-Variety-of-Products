import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying Payment...");

  useEffect(() => {
    const verifyEsewaPayment = async () => {
      const transactionId = searchParams.get("txn_id");
      if (!transactionId) {
        setStatus("Invalid transaction.");
        return;
      }

      const verificationUrl = `https://rc-epay.esewa.com.np/api/epay/verify`;
      const body = new URLSearchParams({
        amt: "100",
        pid: transactionId,
        rid: transactionId, // eSewa Transaction ID (for testing)
        scd: "epay_payment",
      });

      try {
        const response = await fetch(verificationUrl, {
          method: "POST",
          body,
        });
        const result = await response.text();

        if (result.includes("Success")) {
          setStatus("Payment Successful! 🎉");
        } else {
          setStatus("Payment Verification Failed.");
        }
      } catch (error) {
        setStatus("Error verifying payment.");
      }
    };

    verifyEsewaPayment();
  }, [searchParams]);

  return (
    <div className="payment-success">
      <h2>{status}</h2>
      <button onClick={() => navigate("/")}>Go to Home</button>
    </div>
  );
};

export default PaymentSuccess;
