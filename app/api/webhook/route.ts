import Stripe from "stripe"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { Prisma } from "@prisma/client"

import { stripe } from "@/lib/stripe"
import prismadb from "@/lib/prismadb"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("Stripe-Signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_SECRET_KEY!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(', ');


  if (event.type === "checkout.session.completed") {
    const orderId = session?.metadata?.orderId ? Number(session.metadata.orderId) : undefined;
    if (!orderId) {
      return new NextResponse("Invalid order ID", { status: 400 });
    }
    const order = (await prismadb.order.update({
      where: {
        id: orderId,
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone || "",
      },
      include: {
        orderItems: true,
      },
    })) as Prisma.OrderGetPayload<{ include: { orderItems: true } }>;

    const productIds = order.orderItems.map((orderItem) => orderItem.productId);

    await prismadb.product.updateMany({
      where: {
        id: {
          in: [...productIds],
        },
      },
      data: {
        isArchived: true
      }
    });
  }

  return new NextResponse(null, { status: 200 });
};
