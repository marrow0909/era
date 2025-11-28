// app/api/stripe-webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // Edgeじゃなく Node で動かす

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-11-17.clover",
});

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return new NextResponse("Missing stripe-signature header", {
      status: 400,
    });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return new NextResponse("Webhook secret not configured", {
      status: 500,
    });
  }

  let event: any;

  try {
    const body = await req.arrayBuffer();
    const buffer = Buffer.from(body);
    event = stripe.webhooks.constructEvent(buffer, sig, webhookSecret);
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed.", err?.message);
    return new NextResponse(
      `Webhook Error: ${err?.message ?? "Invalid signature"}`,
      { status: 400 }
    );
  }

  // イベントタイプによって分岐
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as any;
      const sessionId = session.id as string;

      try {
        // この session に紐づく注文を PAID に更新
        const { error } = await supabaseAdmin
          .from("orders")
          .update({ status: "PAID" })
          .eq("stripe_session_id", sessionId);

        if (error) {
          console.error(
            "Failed to update order status to PAID:",
            error
          );
        } else {
          console.log(
            "✅ Order marked as PAID for session:",
            sessionId
          );
        }
      } catch (e) {
        console.error("Unexpected error while updating order status:", e);
      }

      break;
    }

    default: {
      // 他のイベントは一旦ログだけ
      console.log(`Unhandled event type ${event.type}`);
    }
  }

  return NextResponse.json({ received: true });
}
