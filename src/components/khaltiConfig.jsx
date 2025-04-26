import KhaltiCheckout from "khalti-checkout-web";

const khaltiConfig = {
    publicKey: 'test_public_key_e2a6e9eed8fd41dabd25ac3042ec02b2', // Different test public key
    productIdentity: "1234567890",
    productName: "Dragon",
    productUrl: "http://localhost:5173",
    eventHandler: {
        onSuccess(payload) {
            // Handle successful payment
            console.log("Payment successful", payload);
            // You can redirect to success page or update order status
            window.location.href = "/payment-success";
        },
        onError(error) {
            // Handle payment error
            console.error("Payment error", error);
            window.location.href = "/payment-failure";
        },
        onClose() {
            // Handle when payment widget is closed
            console.log("Khalti widget closed");
        }
    },
    paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"]
};

// Test account details for development:
// Mobile: 9800000000
// MPIN: 1111
// OTP: 123456

export default khaltiConfig;
