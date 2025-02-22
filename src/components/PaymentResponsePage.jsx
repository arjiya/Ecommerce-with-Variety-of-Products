import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function PaymentResponsePage() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const status = queryParams.get('q'); // 'su' for success, 'fu' for failure
        const transactionId = queryParams.get('oid');

        if (status === 'su') {
            // Verify the transaction on the server
            fetch(`/api/verify-esewa-payment?transactionId=${transactionId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Payment successful!');
                        // Clear the cart and navigate to a success page
                        localStorage.removeItem('cart');
                        navigate('/payment-success');
                    } else {
                        alert('Payment verification failed.');
                        navigate('/payment-failure');
                    }
                });
        } else {
            alert('Payment failed or canceled.');
            navigate('/payment-failure');
        }
    }, [location, navigate]);

    return (
        <div>
            <h2>Processing Payment...</h2>
        </div>
    );
}

export default PaymentResponsePage;
