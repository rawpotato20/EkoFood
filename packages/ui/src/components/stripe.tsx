import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

//TODO: Toast
import toast from "react-hot-toast";

interface StripeProps {
  id: string;
}

const publicKey = process.env.NEXT_PUBLIC_STRIPE_PUB_KEY;
if (!publicKey) throw new Error("❌ Stripe Public Key is not defined");
const stripePromise = loadStripe(publicKey);

const StripeModal = (props: StripeProps) => {
  const [clientSecret, setClientSecret] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    // Call the backend to create a SetupIntent and get the client secret
    fetch("/api/user/stripe/create-setup-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ customer: props.id }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      toast.error("Kortelės forma nerasta.");
      return;
    }

    const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      console.log(error);
      toast.error(error.message ?? "Įvyko klaida bandant išsaugoti kortelę.");
    } else {
      // Send the setupIntent.payment_method to your backend to save the token
      console.log("SetupIntent succeeded:", setupIntent);
    }
  };

  // Custom styles for the CardElement
  const cardStyle = {
    style: {
      base: {
        iconColor: "#365925",
        color: "#000",
        fontWeight: "500",
        fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
        padding: "10px 12px",
        fontSize: "16px",
        fontSmoothing: "antialiased",
        ":-webkit-autofill": {
          color: "#000",
        },
        "::placeholder": {
          color: "#000",
        },
      },
      invalid: {
        iconColor: "#FF4D4D",
        color: "#FF4D4D",
      },
    },
  };

  return (
    <div className="container mx-auto">
      {clientSecret && (
        <form onSubmit={handleSubmit}>
          <CardElement options={cardStyle} />

          <button
            type="submit"
            disabled={!stripe || !elements}
            className="bg-primary text-white rounded-lg py-2 px-10 mt-5"
            data-umami-event="Clicked Save Card Button"
          >
            Save Card
          </button>
        </form>
      )}
    </div>
  );
};

const StripeWrapper = (props: StripeProps) => (
  <Elements stripe={stripePromise}>
    <StripeModal id={props.id} />
  </Elements>
);

export default StripeWrapper;
