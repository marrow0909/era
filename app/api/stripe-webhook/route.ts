// app/api/stripe-webhook/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // EdgeではなくNodeで動かす

// Stripe クライアント
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-11-17.clover",
});

// Supabase Admin クライアント（遅延生成：import時には実行されない）
function getSupabaseAdmin(): SupabaseClient {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      "Supabase admin env vars (NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY) are not set."
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey);
}

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

  let event: Stripe.Event;

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

  // イベントタイプごとの処理
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const sessionId = session.id;

      try {
        const supabaseAdmin = getSupabaseAdmin();

        const { error } = await supabaseAdmin
          .from("orders")
          .update({ status: "PAID" })
          .eq("stripe_session_id", sessionId);

        if (error) {
          console.error("Failed to update order status to PAID:", error);
        } else {
          console.log("✅ Order marked as PAID for session:", sessionId);
        }
      } catch (e) {
        // ここで落とすと webhook 自体が 500 になるので log だけ
        console.error(
          "Unexpected error while updating order status (Supabase admin not configured?)",
          e
        );
      }

      break;
    }

    default: {
      console.log(`Unhandled event type ${event.type}`);
    }
  }

  return NextResponse.json({ received: true });
}
