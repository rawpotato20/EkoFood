// components/PaymentButton.js
import { useEffect } from 'react';

const PaymentButton = () => {
  useEffect(() => {
    // Load the external script
    const script = document.createElement('script');
    script.src = 'https://static.cc.maksekeskus.ee/checkout/dist/checkout.js';
    script.async = true;
    script.onload = () => {
      // Initialize the payment dialog
      window.cc_callback = function(data) {
        alert('The CC dialog returned: \r\n \r\n' + JSON.stringify(data));
      };

      window.Maksekeskus.Checkout.initialize({
        key: 'your_publishable_key', // Replace with your publishable key
        transaction: 'your_transaction_id', // Replace with your transaction ID
        amount: 'your_amount', // Replace with your amount
        currency: 'your_currency', // Replace with your currency
        email: 'john@diehard.ly', // Replace with the customer's email
        clientName: 'John McLane', // Replace with the customer's name
        locale: 'en', // Replace with your desired locale
        name: 'MyService.com', // Replace with your service name
        description: 'Order no. 123abc', // Replace with your order description
        recurringRequired: 'true',
        recurringTitle: 'MyService.com subscription',
        recurringDescription: 'membership fee is 10€ monthly',
        recurringConfirmation: 'I agree that the fee will be taken from my credit card each month automatically',
        completed: 'cc_callback',
        cancelled: 'cc_callback'
      });
    };

    document.body.appendChild(script);

    // Clean up the script when the component is unmounted
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleClick = () => {
    if (window.Maksekeskus && window.Maksekeskus.Checkout) {
      window.Maksekeskus.Checkout.open();
    }
  };

  return (
    <button
      type="button"
      className="btn btn-primary"
      aria-label="Open Recurring CC Payment dialog"
      onClick={handleClick}
      data-umami-event="Recurring CC Payment Button Clicked"
    >
      Open CC Payment dialog
    </button>
  );
};

export default PaymentButton;
