const khaltiConfig = {
  publicKey: "test_public_key_5be4d06a0b694a53b03e84c468808c2a", // Replace with your actual Test Public Key
  productIdentity: "1234567890",
  productName: "Ecommerce Product",
  productUrl: "http://localhost:3000/product",
  eventHandler: {
    onSuccess(payload) {
      console.log("Payment successful!", payload);
      alert("Payment successful!");

      // Send the transaction details to backend for verification
      fetch("http://localhost:5000/khalti/verify-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: payload.token,
          amount: payload.amount,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            alert("Transaction Verified!");
          } else {
            alert("Transaction Failed!");
          }
        })
        .catch((err) => console.error(err));
    },
    onError(error) {
      console.log("Payment error:", error);
      alert("Payment failed. Try again.");
    },
    onClose() {
      console.log("Payment widget closed.");
    },
  },
  paymentPreference: ["KHALTI"],
};

export default khaltiConfig;
