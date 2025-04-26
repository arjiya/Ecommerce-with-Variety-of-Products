import KhaltiCheckout from "khalti-checkout-web";

const khaltiConfig = {
    publicKey: 'Key test_secret_key_c4b3bff221c94b9782827a38c6432ad8', // Test public key for testing
    productIdentity: "1234567890",  // Any product identity for testing
    productName: "products",  // Product name for testing
    productUrl: "https://www.khalti.com",  // Test URL for testing
    eventHandler: {
        onSuccess (payload) {
            console.log("Payment successful", payload);
           
        },
        onError (error) {
            console.error("Payment error", error);
        },
        onClose () {
            console.log("Khalti widget closed");
        }
    },
    paymentPreference: ["KHALTI", "EBANKING", "MOBILE_BANKING", "CONNECT_IPS", "SCT"]
};

export default khaltiConfig;
