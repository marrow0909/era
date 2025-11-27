// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set in .env.local");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-04-10",
});

type CartItem = {
  id: string;
  name: string;
  price: number;    // JPY（例: 12000）
  quantity: number;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { items?: CartItem[] };

    const items = body.items || [];

    if (!items.length) {
      return NextResponse.json(
        { error: "カートが空です。" },
        { status: 400 }
      );
    }

    // Stripe に渡す line_items を組み立て
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "jpy",
          product_data: {
            name: item.name,
          },
          // Stripe は最小単位（JPY は「円」そのまま）
          unit_amount: item.price,
        },
      })
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/cart?status=success`,
      cancel_url: `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/cart?status=cancel`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe から URL が返ってきませんでした" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe error:", err);
    return NextResponse.json(
      {
        error: err?.message || "Unknown error",
      },
      { status: 400 }
    );
  }
}
