"use client";

import { useRouter } from "next/navigation";
import { useCart } from "../context/cart-context";
import { getSupabaseClient } from "../lib/supabaseClient";
import { useEffect, useState } from "react";

export default function CartPage() {
  const router = useRouter();
  const supabase = getSupabaseClient();
  const { items, total, pointsToEarn, removeItem, clearCart } = useCart();
  const [currentPoints, setCurrentPoints] = useState<number | null>(null);

  // ユーザーのポイント読み込み（user_metadata.era_points 想定）
  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const meta = user.user_metadata as any;
        if (meta && typeof meta.era_points === "number") {
          setCurrentPoints(meta.era_points);
        } else {
          setCurrentPoints(0);
        }
      }
    };
    load();
  }, [supabase]);

  const handleCheckout = async () => {
    if (items.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("Sign in is required before checkout.");
      router.push("/account");
      return;
    }

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(
        "決済セッションの作成に失敗しました: " +
          (data.error || "Unknown error")
      );
    }
  };

  const estimatedShipping = items.length > 0 ? "3–5 business days" : "-";

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        padding: "32px 40px 40px",
        maxWidth: 980,
        margin: "0 auto",
      }}
    >
      {/* ヘッダー行 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 18,
          gap: 16,
        }}
      >
        <div>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "#9ca3af",
              margin: 0,
            }}
          >
            ERA CART
          </p>
          <h1
            style={{
              fontSize: 20,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              margin: "8px 0 0",
            }}
          >
            Items
          </h1>
        </div>

        <div
          style={{
            fontSize: 11,
            color: "#6b7280",
            textAlign: "right",
          }}
        >
          <div>{items.length} items</div>
          <div>
            Total:{" "}
            <span style={{ color: "#e5e7eb" }}>
              ¥{total.toLocaleString("ja-JP")}
            </span>
          </div>
          <div style={{ marginTop: 4 }}>
            {items.length > 0 ? (
              <>
                Earn:{" "}
                <span style={{ color: "#facc15" }}>
                  {pointsToEarn.toLocaleString("ja-JP")} pt
                </span>
              </>
            ) : (
              "Add items to earn ERA points."
            )}
          </div>
          {currentPoints !== null && (
            <div style={{ marginTop: 2 }}>
              Balance:{" "}
              <span style={{ color: "#e5e7eb" }}>
                {currentPoints.toLocaleString("ja-JP")} pt
              </span>
            </div>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div
          style={{
            borderRadius: 24,
            border: "1px solid #111827",
            background:
              "linear-gradient(to bottom right, rgba(15,23,42,0.98), rgba(15,23,42,0.95))",
            padding: 24,
            textAlign: "center",
            fontSize: 12,
            color: "#9ca3af",
          }}
        >
          Your cart is currently empty.
          <br />
          <span style={{ fontSize: 11 }}>
            Browse the collection and add pieces when you&apos;re ready.
          </span>
        </div>
      ) : (
        <>
          {/* カート内容 */}
          <div
            style={{
              borderRadius: 24,
              border: "1px solid #111827",
              background:
                "linear-gradient(to bottom right, rgba(15,23,42,0.98), rgba(15,23,42,0.95))",
              padding: "16px 18px 18px",
              marginBottom: 18,
              boxShadow: "0 26px 60px rgba(0,0,0,0.85)",
            }}
          >
            {items.map((item) => (
              <div
                key={`${item.id}-${item.size ?? "nosize"}`}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(0, 1.6fr) minmax(0, 0.8fr) 80px",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: "1px solid #111827",
                  alignItems: "center",
                }}
              >
                {/* 左：商品名＋サイズ */}
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#e5e7eb",
                    }}
                  >
                    {item.name}
                  </div>
                  {item.size && (
                    <div
                      style={{
                        fontSize: 11,
                        color: "#9ca3af",
                        marginTop: 2,
                      }}
                    >
                      Size: {item.size}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: 11,
                      color: "#9ca3af",
                      marginTop: 2,
                    }}
                  >
                    ¥{item.price.toLocaleString("ja-JP")} / unit
                  </div>
                </div>

                {/* 中央：数量＋小計 */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    fontSize: 12,
                    color: "#e5e7eb",
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 11,
                      color: "#9ca3af",
                    }}
                  >
                    <span>Qty</span>
                    <span
                      style={{
                        minWidth: 26,
                        textAlign: "center",
                        borderRadius: 999,
                        border: "1px solid #1f2937",
                        padding: "2px 8px",
                        fontSize: 11,
                        color: "#e5e7eb",
                      }}
                    >
                      {item.quantity}
                    </span>
                  </div>
                  <div>
                    ¥
                    {(item.price * item.quantity).toLocaleString("ja-JP")}
                  </div>
                </div>

                {/* 右：削除ボタン */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => removeItem(item.id, item.size)}
                    style={{
                      borderRadius: 999,
                      border: "1px solid #111827",
                      padding: "4px 10px",
                      backgroundColor: "transparent",
                      color: "#9ca3af",
                      fontSize: 10,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* サマリー行 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
              gap: 16,
              alignItems: "flex-start",
            }}
          >
            {/* 左：配送 */}
            <div
              style={{
                borderRadius: 18,
                border: "1px solid #111827",
                background:
                  "linear-gradient(to bottom right, rgba(15,23,42,0.96), rgba(15,23,42,0.94))",
                padding: 14,
                fontSize: 11,
                color: "#9ca3af",
              }}
            >
              <div
                style={{
                  textTransform: "uppercase",
                  letterSpacing: "0.2em",
                  marginBottom: 6,
                  color: "#d1d5db",
                  fontSize: 10,
                }}
              >
                Shipping Estimate
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#e5e7eb",
                  marginBottom: 6,
                }}
              >
                {estimatedShipping}
              </div>
              <div
                style={{
                  lineHeight: 1.7,
                }}
              >
                Ships from Japan. Final shipping cost and taxes (if any) will be
                calculated at checkout.
              </div>
            </div>

            {/* 右：合計＆ポイント＆ボタン */}
            <div
              style={{
                borderRadius: 18,
                border: "1px solid #111827",
                background:
                  "linear-gradient(to bottom right, rgba(8,16,32,0.98), rgba(8,16,32,0.96))",
                padding: 14,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  color: "#d1d5db",
                }}
              >
                <span>Subtotal</span>
                <span>¥{total.toLocaleString("ja-JP")}</span>
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: "#6b7280",
                }}
              >
                Tax and shipping calculated at Stripe checkout.
              </div>

              <div
                style={{
                  fontSize: 11,
                  color: "#9ca3af",
                }}
              >
                This order will earn approximately{" "}
                <span style={{ color: "#facc15" }}>
                  {pointsToEarn.toLocaleString("ja-JP")} ERA points
                </span>
                .
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                  marginTop: 6,
                }}
              >
                <button
                  type="button"
                  onClick={clearCart}
                  style={{
                    borderRadius: 999,
                    border: "1px solid #111827",
                    padding: "8px 16px",
                    backgroundColor: "transparent",
                    color: "#e5e7eb",
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  Clear
                </button>

                <button
                  type="button"
                  onClick={handleCheckout}
                  style={{
                    borderRadius: 999,
                    border: "1px solid #facc15",
                    padding: "9px 22px",
                    background:
                      "linear-gradient(to right, #facc15, #eab308, #facc15)",
                    color: "#111827",
                    fontSize: 11,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    flexGrow: 1,
                    textAlign: "center",
                  }}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
