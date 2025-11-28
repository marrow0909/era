"use client";

import React, { useState } from "react";

type SavedPaymentMethod = {
  id: string;
  brand: string; // "Visa", "Mastercard" など
  last4: string;
  expMonth: number;
  expYear: number;
  label?: string;
  isDefault?: boolean;
};

const mockInitialMethods: SavedPaymentMethod[] = [
  {
    id: "pm_1",
    brand: "Visa",
    last4: "4242",
    expMonth: 4,
    expYear: 2028,
    label: "メインカード",
    isDefault: true,
  },
  {
    id: "pm_2",
    brand: "Mastercard",
    last4: "4444",
    expMonth: 11,
    expYear: 2027,
    label: "仕事用",
    isDefault: false,
  },
];

export function PaymentMethodsSection() {
  const [methods, setMethods] = useState<SavedPaymentMethod[]>(mockInitialMethods);
  const [label, setLabel] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [exp, setExp] = useState(""); // MM/YY
  const [cvc, setCvc] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!cardNumber || !exp || !cvc) {
      setError("カード情報を入力してください。");
      return;
    }

    // 実際にはここで Stripe Elements から token / paymentMethod を作る
    // 今は UI のみなのでダミーとしてローカル state に追加
    const [mm, yy] = exp.split("/");
    const newMethod: SavedPaymentMethod = {
      id: `local_${Date.now()}`,
      brand: "Card",
      last4: cardNumber.slice(-4),
      expMonth: Number(mm) || 1,
      expYear: 2000 + (Number(yy) || 30),
      label: label || "New card",
      isDefault: methods.length === 0,
    };

    setIsSaving(true);
    try {
      // TODO: 後でここに `/api/payment-methods` 的なエンドポイントを叩いて Stripe と Supabase に保存する
      await new Promise((res) => setTimeout(res, 400));

      setMethods((prev) => [...prev, newMethod]);
      setLabel("");
      setCardNumber("");
      setExp("");
      setCvc("");
    } catch (err) {
      console.error(err);
      setError("カードの保存に失敗しました。（後で Stripe 連携を追加）");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetDefault = (id: string) => {
    setMethods((prev) =>
      prev.map((m) => ({
        ...m,
        isDefault: m.id === id,
      }))
    );
    // TODO: Supabase にも default フラグを保存
  };

  const handleDelete = (id: string) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
    // TODO: Stripe / Supabase からも削除
  };

  return (
    <div style={{ padding: "24px 32px 40px" }}>
      {/* タイトル */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 18,
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
            ERA ACCOUNT
          </p>
          <h1
            style={{
              fontSize: 18,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              margin: "6px 0 0",
            }}
          >
            Payment methods
          </h1>
        </div>

        <div
          style={{
            fontSize: 11,
            color: "#6b7280",
            textAlign: "right",
          }}
        >
          <div>Connected to ERA: cards and wallets will be stored securely.</div>
        </div>
      </div>

      {/* 保存済みカード一覧 */}
      <div
        style={{
          borderRadius: 18,
          border: "1px solid #111827",
          background:
            "radial-gradient(circle at top left, rgba(15,23,42,0.98), rgba(15,23,42,0.95))",
          padding: 18,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "#9ca3af",
            }}
          >
            Saved methods
          </div>
          <div
            style={{
              fontSize: 11,
              color: "#6b7280",
            }}
          >
            {methods.length} method{methods.length !== 1 ? "s" : ""}
          </div>
        </div>

        {methods.length === 0 ? (
          <div style={{ fontSize: 13, color: "#6b7280" }}>
            まだ支払い方法が登録されていません。
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {methods.map((m) => (
              <div
                key={m.id}
                style={{
                  borderRadius: 12,
                  border: "1px solid #111827",
                  background:
                    "linear-gradient(to right, rgba(15,23,42,0.98), rgba(15,23,42,0.94))",
                  padding: "10px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#e5e7eb",
                      }}
                    >
                      {m.brand} •••• {m.last4}
                    </div>
                    {m.isDefault && (
                      <span
                        style={{
                          fontSize: 10,
                          textTransform: "uppercase",
                          letterSpacing: "0.18em",
                          padding: "2px 8px",
                          borderRadius: 999,
                          border: "1px solid #facc15",
                          color: "#facc15",
                        }}
                      >
                        Default
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#9ca3af",
                    }}
                  >
                    Exp {String(m.expMonth).padStart(2, "0")}/{m.expYear}
                    {m.label ? ` • ${m.label}` : null}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  {!m.isDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(m.id)}
                      style={{
                        fontSize: 11,
                        borderRadius: 999,
                        border: "1px solid #374151",
                        backgroundColor: "transparent",
                        color: "#e5e7eb",
                        padding: "4px 10px",
                        cursor: "pointer",
                      }}
                    >
                      Set default
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(m.id)}
                    style={{
                      fontSize: 11,
                      borderRadius: 999,
                      border: "1px solid #4b5563",
                      backgroundColor: "transparent",
                      color: "#9ca3af",
                      padding: "4px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 新しい支払い方法の追加フォーム */}
      <div
        style={{
          borderRadius: 18,
          border: "1px solid #111827",
          background:
            "linear-gradient(to bottom right, rgba(15,23,42,0.98), rgba(15,23,42,0.95))",
          padding: 18,
          maxWidth: 720,
        }}
      >
        <div
          style={{
            fontSize: 12,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "#9ca3af",
            marginBottom: 12,
          }}
        >
          Add new payment method
        </div>

        <p
          style={{
            fontSize: 11,
            color: "#6b7280",
            margin: "0 0 12px",
          }}
        >
          ※ 現時点では UI のみです。後で Stripe Elements / Apple Pay / Google Pay を
          接続して、本物のカード情報は Stripe 側で安全に処理します。
        </p>

        {error && (
          <div
            style={{
              marginBottom: 10,
              fontSize: 11,
              color: "#f97373",
            }}
          >
            {error}
          </div>
        )}

        <form
          onSubmit={handleAddMethod}
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 3fr",
            gap: 10,
          }}
        >
          {/* ラベル */}
          <div style={{ gridColumn: "1 / 3" }}>
            <label
              style={{
                fontSize: 11,
                color: "#9ca3af",
                display: "block",
                marginBottom: 4,
              }}
            >
              Label (optional)
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="例: メインカード / 仕事用"
              style={inputStyle}
            />
          </div>

          {/* カード番号 */}
          <div style={{ gridColumn: "1 / 3" }}>
            <label
              style={{
                fontSize: 11,
                color: "#9ca3af",
                display: "block",
                marginBottom: 4,
              }}
            >
              Card number (dummy)
            </label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="4242 4242 4242 4242"
              style={inputStyle}
            />
          </div>

          {/* 有効期限 */}
          <div>
            <label
              style={{
                fontSize: 11,
                color: "#9ca3af",
                display: "block",
                marginBottom: 4,
              }}
            >
              Expiration (MM/YY)
            </label>
            <input
              type="text"
              value={exp}
              onChange={(e) => setExp(e.target.value)}
              placeholder="04/28"
              style={inputStyle}
            />
          </div>

          {/* CVC */}
          <div>
            <label
              style={{
                fontSize: 11,
                color: "#9ca3af",
                display: "block",
                marginBottom: 4,
              }}
            >
              CVC
            </label>
            <input
              type="password"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              placeholder="123"
              style={inputStyle}
            />
          </div>

          {/* ボタン */}
          <div style={{ gridColumn: "1 / 3", marginTop: 8 }}>
            <button
              type="submit"
              disabled={isSaving}
              style={{
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "8px 20px",
                borderRadius: 999,
                border: "none",
                cursor: "pointer",
                background:
                  "radial-gradient(circle at top left, #facc15, #f59e0b)",
                color: "#111827",
                boxShadow: "0 12px 30px rgba(250, 204, 21, 0.35)",
                opacity: isSaving ? 0.7 : 1,
              }}
            >
              {isSaving ? "Saving..." : "Save method"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "7px 10px",
  borderRadius: 10,
  border: "1px solid #1f2937",
  backgroundColor: "#020617",
  color: "#e5e7eb",
  fontSize: 12,
  outline: "none",
};
