// app/sucess/page.tsx
"use client";
import { useEffect, useState } from "react";
import { getSupabaseClient } from "../lib/supabaseClient";

type Order = {
  id: string;
  number: string;
  total: number;
  currency: string;
  items_summary: string;
  status: string;
  created_at: string;
};

export default function SuccessPage() {
  const supabase = getSupabaseClient();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLatestOrder();
  }, []);

  const loadLatestOrder = async () => {
    setLoading(true);

    // ログインユーザーを取得
    const { data: auth, error: authErr } = await supabase.auth.getUser();
    if (authErr || !auth?.user) {
      setLoading(false);
      return;
    }
    const userId = auth.user.id;

    // 最新の注文（PAID）を取得
    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (orders && orders.length > 0) {
      setOrder(orders[0]);
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        padding: "40px",
        maxWidth: 700,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* タイトル */}
      <h1
        style={{
          fontSize: 24,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#facc15",
          margin: 0,
        }}
      >
        Thank you for your order
      </h1>

      <p style={{ fontSize: 14, color: "#9ca3af" }}>
        ご注文ありがとうございます。ERA のチームが処理を開始しました。
      </p>

      {loading && (
        <p style={{ fontSize: 12, color: "#9ca3af" }}>読み込み中...</p>
      )}

      {!loading && !order && (
        <p style={{ fontSize: 12, color: "#f87171" }}>
          注文が見つかりませんでした。
        </p>
      )}

      {/* 注文内容 */}
      {order && (
        <div
          style={{
            borderRadius: 20,
            border: "1px solid #111827",
            background:
              "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(15,23,42,0.96))",
            padding: 20,
            fontSize: 14,
          }}
        >
          <div style={{ marginBottom: 10 }}>
            <div
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.14em",
                color: "#9ca3af",
              }}
            >
              Order Number
            </div>
            <div style={{ color: "#e5e7eb", fontSize: 16 }}>
              {order.number}
            </div>
          </div>

          <div style={{ marginBottom: 10 }}>
            <div
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                color: "#9ca3af",
                letterSpacing: "0.14em",
              }}
            >
              Items
            </div>
            <div style={{ color: "#e5e7eb" }}>
              {order.items_summary}
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: 12,
                textTransform: "uppercase",
                color: "#9ca3af",
                letterSpacing: "0.14em",
              }}
            >
              Total
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 18,
                color: "#facc15",
              }}
            >
              ¥{order.total.toLocaleString("ja-JP")}
            </div>
          </div>
        </div>
      )}

      {/* ボタン */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginTop: 12,
        }}
      >
        <a
          href="/account"
          style={{
            borderRadius: 999,
            background: "#facc15",
            padding: "10px 18px",
            color: "#111827",
            textDecoration: "none",
            fontSize: 12,
            letterSpacing: "0.12em",
          }}
        >
          View Order History
        </a>

        <a
          href="/"
          style={{
            borderRadius: 999,
            border: "1px solid #facc15",
            padding: "10px 18px",
            color: "#facc15",
            textDecoration: "none",
            fontSize: 12,
            letterSpacing: "0.12em",
          }}
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
