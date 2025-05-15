import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  let event;
const stripeSignature = (await headers()).get("stripe-signature");

if (!stripeSignature) {
  console.error("Stripe signature is missing");
  return NextResponse.json(
    { message: "Stripe signature is missing" },
    { status: 400 }
  );
}
  try {
    event = stripe.webhooks.constructEvent(
      await req.text(),
      stripeSignature,
      process.env.STRIPE_SECRET_KEY!
    );
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Unknown error";
    // On error, log and return the error message.
    if (err) console.log(err);
    console.log(`Error message: ${errorMessage}`);
    return NextResponse.json(
      { message: `Webhook Error: ${errorMessage}` },
      { status: 400 }
    );
  }

  const permittedEvents = ["payment_intent.succeeded"];

  if (permittedEvents.includes(event.type)) {
    let data;

    try {
      switch (event.type) {
        case "payment_intent.succeeded":
          data = event.data.object;
          console.log(`Payment status: ${data.status}`);
          break;
        default:
          throw new Error(`Unhandled event: ${event.type}`);
      }
    } catch (error) {
      console.log(error);
      return NextResponse.json(
        { message: "Webhook handler failed" },
        { status: 500 }
      );
    }
  }
  // Return a response to acknowledge receipt of the event.
  return NextResponse.json({ message: "Received" }, { status: 200 });
}
