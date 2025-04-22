import React from 'react';
import Stripe from 'stripe';
import {loadStripe} from '@stripe/stripe-js';

// Initialize Stripe.js
const stripe =  loadStripe(process.env.STRIPE_PUBLIC_KEY!);
//let stripe =new Stripe(process.env.STRIPE_PUBLIC_KEY!);

initialize();

// Fetch Checkout Session and retrieve the client secret
async function initialize() {
  const fetchClientSecret = async () => {
  const clientSecret = await createCheckoutSession();
  return clientSecret;
};

const checkout = await stripe.initEmbeddedCheckout({
  fetchClientSecret,
});

  // Mount Checkout
  checkout.mount('#checkout');
}

function createCheckoutSession() {
  throw new Error('Function not implemented.');
}

