{/*
import Stripe from "stripe";

// Initialize Stripe.js
const stripePromise = Stripe(process.env.STRIPE_PUBLIC_KEY!);

initialize();

// Fetch Checkout Session and retrieve the client secret
async function initialize() {
  const stripe = await stripePromise;
  const fetchClientSecret = async () => {
    const response = await fetch("/create-checkout-session", {
      method: "POST",
    });
    const { clientSecret } = await response.json();
    return clientSecret;
  };

  // Initialize Checkout
  const checkout = await stripe.initEmbeddedCheckout({
    fetchClientSecret,
  });

  // Mount Checkout
  checkout.mount('#checkout');
}
*/}
