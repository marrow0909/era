// app/cart/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/cart-context";
import { getSupabaseClient } from "../lib/supabaseClient";
// カテゴリー表示用のヘルパー（型は any にして TS エラーを避ける）
const renderCategoryLabel = (item: any): string => {
  // もし昔のデータで categoryLabel があればそれを優先
  if (item && item.categoryLabel) {
    return item.categoryLabel;
  }

  // category からラベルを推測（なければ "Item"）
  const cat = item?.category;

  switch (cat) {
    case "TOPS":
      return "Tops";
    case "JACKETS":
      return "Outer";
    case "PANTS":
      return "Bottoms";
    case "ACCESSORIES":
      return "Accessory";
    default:
      return "Item";
  }
};

// 住所（Account の AddressesSection と同じ構造）
type Address = {
  id: string;
  label: string;
  fullName: string;
  postalCode: string;
  prefecture: string;
  city: string;
  address1: string;
  address2?: string | null;
  phone: string;
  isDefault: boolean;
};

type AddressMode = "demo" | "db";

export default function CartPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();

  const supabase = useMemo(() => getSupabaseClient(), []);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const [addressMode, setAddressMode] = useState<AddressMode>("demo");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressLoading, setAddressLoading] = useState(true);
  const [addressError, setAddressError] = useState<string | null>(null);

  const [pointsAvailable, setPointsAvailable] = useState<number>(1240); // 仮のポイント残高
  const [pointsToUse, setPointsToUse] = useState<number>(0);

  const [creatingSession, setCreatingSession] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // サインイン状態チェック + 住所ロード
  useEffect(() => {
    const run = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          setIsLoggedIn(false);
          setAddressMode("demo");
          setAddressLoading(false);
          return;
        }

        setIsLoggedIn(true);
        setAddressMode("db");

        // Supabase から住所読み込み
        const { data: rows, error: addrError } = await supabase
          .from("addresses")
          .select("*")
          .order("created_at", { ascending: false });

        if (addrError) {
          console.warn(addrError);
          setAddressError("Failed to load shipping addresses.");
          setAddressLoading(false);
          return;
        }

        if (rows && rows.length > 0) {
          const mapped: Address[] = rows.map((row: any) => ({
            id: row.id,
            label: row.label,
            fullName: row.full_name,
            postalCode: row.postal_code,
            prefecture: row.prefecture,
            city: row.city,
            address1: row.address1,
            address2: row.address2,
            phone: row.phone,
            isDefault: row.is_default,
          }));
          setAddresses(mapped);
        } else {
          setAddresses([]);
        }

        setAddressLoading(false);
      } catch (e) {
        console.error(e);
        setIsLoggedIn(false);
        setAddressMode("demo");
        setAddressLoading(false);
        setAddressError("Unexpected error while loading account info.");
      }
    };

    run();
  }, [supabase]);

  // カート小計
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // ポイント利用の制限
  const maxPointsUsable = Math.min(pointsAvailable, subtotal);
  const safePointsToUse = Math.min(Math.max(pointsToUse, 0), maxPointsUsable);
  const payableTotal = subtotal - safePointsToUse;

  const defaultAddress: Address | null = useMemo(() => {
    if (addresses.length === 0) return null;
    const found = addresses.find((a) => a.isDefault);
    return found ?? addresses[0];
  }, [addresses]);

  const handleChangePoints = (value: string) => {
    const n = Number(value.replace(/[^\d]/g, ""));
    if (Number.isNaN(n)) {
      setPointsToUse(0);
    } else {
      setPointsToUse(n);
    }
  };

  const handleProceedToCheckout = async () => {
    setErrorMessage(null);

    if (!isLoggedIn) {
      router.push("/auth");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Your cart is empty.");
      return;
    }

    setCreatingSession(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          // 情報だけ Stripe 側に渡しておく（今は金額の調整まではしない）
          shippingAddressId: defaultAddress?.id ?? null,
          pointsToUse: safePointsToUse,
        }),
      });

      if (!res.ok) {
        console.error(await res.text());
        setErrorMessage("Failed to create checkout session.");
        setCreatingSession(false);
        return;
      }

      const data = await res.json();
      if (!data?.url) {
        setErrorMessage("Stripe did not return a checkout URL.");
        setCreatingSession(false);
        return;
      }

      // Stripe Checkout にリダイレクト
      window.location.href = data.url as string;
    } catch (err) {
      console.error(err);
      setErrorMessage("Unexpected error while creating checkout session.");
      setCreatingSession(false);
    }
  };

  const goToAuth = () => router.push("/auth");
  const goToHome = () => router.push("/");
  const goToAccountAddresses = () => router.push("/account");

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        padding: "32px 40px 40px",
        maxWidth: 1120,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "minmax(0, 3fr) minmax(280px, 2fr)",
        gap: 24,
      }}
    >
      {/* 左：カート内容 */}
      <section
        style={{
          borderRadius: 24,
          border: "1px solid #111827",
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(15,23,42,0.96))",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {/* タイトル */}
        <div>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: "#9ca3af",
            }}
          >
            ERA CART
          </div>
          <h1
            style={{
              margin: "8px 0 0",
              fontSize: 20,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Items
          </h1>
        </div>

        {/* ログイン状態メッセージ */}
        {isLoggedIn === false && (
          <div
            style={{
              borderRadius: 16,
              border: "1px solid #451a03",
              background:
                "linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,64,175,0.25))",
              padding: 12,
              fontSize: 12,
              color: "#e5e7eb",
            }}
          >
            <div
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                color: "#facc15",
                marginBottom: 4,
              }}
            >
              Sign in required
            </div>
            <div>
              To complete your purchase and save your address & payment details,
              please sign in to ERA.
            </div>
            <button
              type="button"
              onClick={goToAuth}
              style={{
                marginTop: 8,
                borderRadius: 999,
                border: "1px solid #facc15",
                background: "#facc15",
                color: "#111827",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                padding: "6px 14px",
                cursor: "pointer",
              }}
            >
              Go to sign in
            </button>
          </div>
        )}

        {/* カートの中身 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                fontSize: 12,
                color: "#9ca3af",
              }}
            >
              Your cart is empty.
              <button
                type="button"
                onClick={goToHome}
                style={{
                  marginLeft: 8,
                  border: "none",
                  background: "transparent",
                  color: "#facc15",
                  cursor: "pointer",
                  fontSize: 12,
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                Continue shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                style={{
                  borderRadius: 16,
                  border: "1px solid #111827",
                  background:
                    "radial-gradient(circle at top, #020617, #020617 60%, #020617)",
                  padding: 12,
                  fontSize: 12,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.18em",
                      color: "#9ca3af",
                    }}
                  >
                    {renderCategoryLabel(item)}
                  </div>
                  <div>{item.name}</div>
                  <div
                    style={{
                      color: "#9ca3af",
                    }}
                  >
                    Qty: {item.quantity}
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "right",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    minWidth: 120,
                    alignItems: "flex-end",
                  }}
                >
                  <div>¥{(item.price * item.quantity).toLocaleString("ja-JP")}</div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#6b7280",
                    }}
                  >
                    ¥{item.price.toLocaleString("ja-JP")} each
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div
            style={{
              marginTop: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 12,
            }}
          >
            <div
              style={{
                color: "#6b7280",
              }}
            >
              Subtotal
            </div>
            <div>¥{subtotal.toLocaleString("ja-JP")}</div>
          </div>
        )}

        {items.length > 0 && (
          <button
            type="button"
            onClick={clearCart}
            style={{
              marginTop: 6,
              border: "none",
              background: "transparent",
              color: "#9ca3af",
              fontSize: 11,
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            Clear cart
          </button>
        )}
      </section>

      {/* 右：チェックアウト情報 */}
      <section
        style={{
          borderRadius: 24,
          border: "1px solid #111827",
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(15,23,42,0.96))",
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* 配送先 */}
        <div>
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "#9ca3af",
            }}
          >
            Shipping address
          </div>

          {addressLoading ? (
            <p
              style={{
                marginTop: 8,
                fontSize: 12,
                color: "#9ca3af",
              }}
            >
              Loading address...
            </p>
          ) : addressError ? (
            <p
              style={{
                marginTop: 8,
                fontSize: 12,
                color: "#f97373",
              }}
            >
              {addressError}
            </p>
          ) : !isLoggedIn ? (
            <p
              style={{
                marginTop: 8,
                fontSize: 12,
                color: "#9ca3af",
              }}
            >
              Sign in to select a shipping address.
            </p>
          ) : defaultAddress ? (
            <div
              style={{
                marginTop: 8,
                fontSize: 12,
                color: "#e5e7eb",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.16em",
                  color: "#9ca3af",
                  marginBottom: 4,
                }}
              >
                {defaultAddress.label} • DEFAULT
              </div>
              <div>{defaultAddress.fullName}</div>
              <div style={{ color: "#9ca3af" }}>
                {defaultAddress.postalCode} {defaultAddress.prefecture}{" "}
                {defaultAddress.city}
              </div>
              <div style={{ color: "#9ca3af" }}>{defaultAddress.address1}</div>
              {defaultAddress.address2 && (
                <div style={{ color: "#9ca3af" }}>
                  {defaultAddress.address2}
                </div>
              )}
              <div
                style={{
                  color: "#6b7280",
                  marginTop: 4,
                }}
              >
                TEL: {defaultAddress.phone}
              </div>
              <button
                type="button"
                onClick={goToAccountAddresses}
                style={{
                  marginTop: 6,
                  border: "none",
                  background: "transparent",
                  color: "#facc15",
                  fontSize: 11,
                  cursor: "pointer",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                Manage addresses in account
              </button>
            </div>
          ) : (
            <div
              style={{
                marginTop: 8,
                fontSize: 12,
                color: "#9ca3af",
              }}
            >
              No shipping address yet.
              <br />
              Add one in your account page.
              <div>
                <button
                  type="button"
                  onClick={goToAccountAddresses}
                  style={{
                    marginTop: 6,
                    borderRadius: 999,
                    border: "1px solid #111827",
                    background: "transparent",
                    color: "#e5e7eb",
                    fontSize: 11,
                    padding: "5px 12px",
                    cursor: "pointer",
                  }}
                >
                  Open account
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 支払い方法（今は説明だけ） */}
        <div>
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "#9ca3af",
            }}
          >
            Payment method
          </div>
          <p
            style={{
              marginTop: 8,
              fontSize: 12,
              color: "#9ca3af",
            }}
          >
            ERA will use your saved card / wallet in Stripe Checkout. Later, this
            area will show your default ERA payment method (VISA, Apple Pay,
            PayPay, etc.).
          </p>
        </div>

        {/* ポイント */}
        <div>
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "#9ca3af",
            }}
          >
            ERA points
          </div>

          <div
            style={{
              marginTop: 6,
              fontSize: 12,
              color: "#e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>Available</span>
            <span>{pointsAvailable.toLocaleString("ja-JP")} pt</span>
          </div>

          <div
            style={{
              marginTop: 8,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <input
              type="text"
              inputMode="numeric"
              placeholder="Use points"
              value={pointsToUse ? String(pointsToUse) : ""}
              onChange={(e) => handleChangePoints(e.target.value)}
              style={{
                flex: 1,
                borderRadius: 999,
                border: "1px solid #111827",
                background: "rgba(15,23,42,0.9)",
                padding: "6px 10px",
                color: "#e5e7eb",
                fontSize: 12,
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={() => setPointsToUse(maxPointsUsable)}
              style={{
                borderRadius: 999,
                border: "1px solid #facc15",
                background: "transparent",
                color: "#facc15",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.16em",
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              Max
            </button>
          </div>

          {safePointsToUse > 0 && (
            <p
              style={{
                marginTop: 6,
                fontSize: 11,
                color: "#9ca3af",
              }}
            >
              Applying {safePointsToUse.toLocaleString("ja-JP")} pt this order.
              （今は見た目だけ。実際の決済額の調整は Stripe + Supabase 連携時に実装予定）
            </p>
          )}
        </div>

        {/* 合計 */}
        <div
          style={{
            marginTop: 4,
            paddingTop: 10,
            borderTop: "1px solid #111827",
            display: "flex",
            flexDirection: "column",
            gap: 6,
            fontSize: 13,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>Subtotal</span>
            <span>¥{subtotal.toLocaleString("ja-JP")}</span>
          </div>
          {safePointsToUse > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 12,
                color: "#22c55e",
              }}
            >
              <span>Points applied</span>
              <span>- ¥{safePointsToUse.toLocaleString("ja-JP")}</span>
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 4,
              fontWeight: 500,
            }}
          >
            <span>Total (preview)</span>
            <span>¥{payableTotal.toLocaleString("ja-JP")}</span>
          </div>
          <p
            style={{
              marginTop: 4,
              fontSize: 11,
              color: "#6b7280",
            }}
          >
            Shipping and tax will be finalized in Stripe Checkout. Points
            integration to actual payment will be added later.
          </p>
        </div>

        {/* エラーメッセージ */}
        {errorMessage && (
          <p
            style={{
              marginTop: 4,
              fontSize: 12,
              color: "#f97373",
            }}
          >
            {errorMessage}
          </p>
        )}

        {/* チェックアウトボタン */}
        <button
          type="button"
          disabled={
            creatingSession || items.length === 0 || isLoggedIn === false
          }
          onClick={handleProceedToCheckout}
          style={{
            marginTop: 8,
            borderRadius: 999,
            border: "1px solid #facc15",
            background:
              creatingSession || !isLoggedIn || items.length === 0
                ? "#eab308"
                : "#facc15",
            color: "#111827",
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            padding: "9px 16px",
            cursor:
              creatingSession || items.length === 0 || isLoggedIn === false
                ? "default"
                : "pointer",
          }}
        >
          {creatingSession
            ? "Preparing checkout..."
            : isLoggedIn === false
            ? "Sign in to checkout"
            : items.length === 0
            ? "Cart is empty"
            : "Proceed to checkout"}
        </button>
      </section>
    </div>
  );
}
