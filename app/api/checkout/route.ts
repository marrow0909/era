// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Stripe クライアント
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-11-17.clover",
});

// Supabase Admin クライアント（遅延生成版）
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

type CartItem = {
  id: string;
  name: string;
  price: number; // 円 (例: 19800)
  quantity: number;
};

// 注文番号生成
function generateOrderNumber(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `ERA-${y}${m}${d}-${rand}`;
}

// カート概要テキスト
function buildItemsSummary(items: CartItem[]): string {
  if (!items.length) return "";
  const text = items
    .map((it) => `${it.name} ×${it.quantity}`)
    .join(", ");
  return text.length > 280 ? text.slice(0, 277) + "..." : text;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items: CartItem[] = body.items ?? [];
    const userId: string | undefined = body.userId;
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    if (!items.length) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Stripe 用 line_items
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "jpy",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }));

    // Stripe セッション作成
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${baseUrl}/sucess`,
      cancel_url: `${baseUrl}/cart`,
    });

    // Supabase に注文保存（userId と session.id がある時だけ）
    if (userId && session.id) {
      try {
        const supabaseAdmin = getSupabaseAdmin();

        const total = items.reduce(
          (sum, it) => sum + it.price * it.quantity,
          0
        );
        const number = generateOrderNumber();
        const itemsSummary = buildItemsSummary(items);

        await supabaseAdmin.from("orders").insert({
          user_id: userId,
          number,
          total,
          currency: "JPY",
          status: "PENDING",
          items_summary: itemsSummary,
          stripe_session_id: session.id,
        });
      } catch (e) {
        console.error("[checkout] Failed to store order in Supabase:", e);
        // ここで throw すると決済自体もできなくなるので、ログだけ残して続行
      }
    } else {
      console.warn(
        "[checkout] userId or session.id missing, order not stored.",
        { userId, sessionId: session.id }
      );
    }

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe did not return a URL" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] error", err);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
