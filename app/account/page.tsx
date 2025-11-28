// app/account/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseClient } from "../lib/supabaseClient";

// =========================
// 型定義
// =========================

type SectionId =
  | "overview"
  | "profile"
  | "addresses"
  | "payments"
  | "orders"
  | "points"
  | "prime"
  | "giftcards"
  | "privacy"
  | "support";

const SECTIONS: { id: SectionId; label: string; description: string }[] = [
  {
    id: "overview",
    label: "Overview",
    description: "Account overview and quick links.",
  },
  {
    id: "profile",
    label: "Profile",
    description: "Name, icon, basic information.",
  },
  {
    id: "addresses",
    label: "Addresses",
    description: "Saved shipping addresses.",
  },
  {
    id: "payments",
    label: "Payment Methods",
    description: "Cards and wallets connected to ERA.",
  },
  {
    id: "orders",
    label: "Orders",
    description: "Your purchase history.",
  },
  {
    id: "points",
    label: "Points & Prime",
    description: "Point balance and ERA Prime status.",
  },
  {
    id: "prime",
    label: "ERA Prime",
    description: "Membership plan and benefits.",
  },
  {
    id: "giftcards",
    label: "ERA Gift Cards",
    description: "Gift cards and codes.",
  },
  {
    id: "privacy",
    label: "Privacy & Account",
    description: "Policy, settings, and account deletion.",
  },
  {
    id: "support",
    label: "Customer Service",
    description: "Contact ERA for help.",
  },
];

// 住所の型（Supabase addresses テーブルと対応させる）
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

// 支払い方法の型（今はローカル状態のみ）
type PaymentMethod = {
  id: string;
  brand: "VISA" | "Mastercard" | "Amex" | "Apple Pay" | "Google Pay" | "PayPay" | "Other";
  last4?: string;
  expiresAt?: string;
  isDefault: boolean;
  label?: string; // “Main Card” など
};

// 注文ステータス & Supabase orders テーブル
type OrderStatus = "PENDING" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELED";

type OrderRow = {
  id: string;
  created_at: string;
  user_id: string;
  number: string;
  total: number;
  currency: string;
  status: OrderStatus;
  items_summary: string;
};

type Order = {
  id: string;
  number: string;
  createdAt: string;
  total: number;
  currency: string;
  status: OrderStatus;
  itemsSummary: string;
};

// ポイント履歴
type PointEntry = {
  id: string;
  createdAt: string;
  delta: number; // +100 / -50
  reason: string;
};

// 共通 input style
const inputStyle: React.CSSProperties = {
  borderRadius: 999,
  border: "1px solid #111827",
  background: "rgba(15,23,42,0.9)",
  padding: "6px 10px",
  color: "#e5e7eb",
  outline: "none",
};

// =========================
// メインコンポーネント
// =========================

export default function AccountPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<SectionId>("overview");

  // TODO: Supabase でログインしてない場合は / にリダイレクト など

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        padding: "32px 40px 40px",
        maxWidth: 1120,
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "260px minmax(0, 1fr)",
        gap: 24,
      }}
    >
      {/* 左：メニュー */}
      <aside
        style={{
          borderRadius: 24,
          border: "1px solid #111827",
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(15,23,42,0.96))",
          padding: 18,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.24em",
              color: "#9ca3af",
            }}
          >
            ERA ACCOUNT
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: 14,
              color: "#e5e7eb",
            }}
          >
            Settings & Membership
          </div>
        </div>

        <div
          style={{
            height: 1,
            background:
              "linear-gradient(to right, transparent, #111827, transparent)",
          }}
        />

        <nav
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 4,
            fontSize: 12,
          }}
        >
          {SECTIONS.map((s) => {
            const active = activeSection === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSection(s.id)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  borderRadius: 999,
                  border: "none",
                  padding: "7px 10px",
                  cursor: "pointer",
                  backgroundColor: active ? "#facc15" : "transparent",
                  color: active ? "#111827" : "#e5e7eb",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <span
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    fontSize: 10,
                  }}
                >
                  {s.label}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: active ? "#111827" : "#9ca3af",
                  }}
                >
                  {s.description}
                </span>
              </button>
            );
          })}
        </nav>

        <div
          style={{
            marginTop: 10,
            fontSize: 11,
            color: "#6b7280",
          }}
        >
          <button
            type="button"
            onClick={() => {
              // TODO: Supabase サインアウト処理
              router.push("/");
            }}
            style={{
              border: "none",
              background: "transparent",
              padding: 0,
              color: "#9ca3af",
              cursor: "pointer",
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* 右：内容エリア */}
      <section
        style={{
          borderRadius: 24,
          border: "1px solid #111827",
          background:
            "linear-gradient(135deg, rgba(15,23,42,0.98), rgba(15,23,42,0.96))",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {activeSection === "overview" && <OverviewSection />}
        {activeSection === "profile" && <ProfileSection />}
        {activeSection === "addresses" && <AddressesSection />}
        {activeSection === "payments" && <PaymentsSection />}
        {activeSection === "orders" && <OrdersSection />}
        {activeSection === "points" && <PointsSection />}
        {activeSection === "prime" && <PrimeSection />}
        {activeSection === "giftcards" && <GiftCardSection />}
        {activeSection === "privacy" && <PrivacySection />}
        {activeSection === "support" && <SupportSection />}
      </section>
    </div>
  );
}

// =========================
// 共通ヘッダー
// =========================

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div>
      <h1
        style={{
          fontSize: 18,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          style={{
            marginTop: 6,
            fontSize: 12,
            color: "#9ca3af",
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

// =========================
// Overview
// =========================

function OverviewSection() {
  return (
    <>
      <SectionTitle
        title="Account Overview"
        subtitle="Quick access to your ERA membership and orders."
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 14,
          marginTop: 18,
        }}
      >
        {[
          { label: "Orders", caption: "Check your purchase history." },
          { label: "Addresses", caption: "Manage shipping addresses." },
          { label: "Payment Methods", caption: "Manage saved cards & wallets." },
          { label: "Points & Prime", caption: "View points and Prime benefits." },
        ].map((card) => (
          <div
            key={card.label}
            style={{
              borderRadius: 18,
              border: "1px solid #111827",
              background:
                "radial-gradient(circle at top, #020617, #020617 60%, #020617)",
              padding: 14,
              fontSize: 12,
              color: "#e5e7eb",
            }}
          >
            <div
              style={{
                textTransform: "uppercase",
                letterSpacing: "0.18em",
                fontSize: 11,
                marginBottom: 4,
              }}
            >
              {card.label}
            </div>
            <div
              style={{
                color: "#9ca3af",
              }}
            >
              {card.caption}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// =========================
// Profile（あとで本実装）
// =========================

function ProfileSection() {
  return (
    <>
      <SectionTitle
        title="Profile"
        subtitle="Update your ERA name, icon and personal information."
      />
      <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 18 }}>
        ここに「プロフィール画像アップロード」「表示名」「生年月日」「性別」「連絡用メール」などのフォームを追加予定。
        ERA の世界観に合わせて、シンプルで静かな設定画面にしていく。
      </p>
    </>
  );
}

// =========================
// Addresses（Supabase連携）
// =========================

function AddressesSection() {
  const supabase = useMemo(() => getSupabaseClient(), []);

  const [addresses, setAddresses] = useState<Address[]>([
    // デモ用
    {
      id: "addr-1",
      label: "Home",
      fullName: "ERA User",
      postalCode: "150-0001",
      prefecture: "Tokyo",
      city: "Shibuya",
      address1: "Jinnan 1-1-1",
      address2: "Room 501",
      phone: "080-0000-0000",
      isDefault: true,
    },
  ]);

  const [mode, setMode] = useState<AddressMode>("demo");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 新規住所フォーム
  const [newLabel, setNewLabel] = useState("");
  const [newFullName, setNewFullName] = useState("");
  const [newPostalCode, setNewPostalCode] = useState("");
  const [newPref, setNewPref] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newAddr1, setNewAddr1] = useState("");
  const [newAddr2, setNewAddr2] = useState("");
  const [newPhone, setNewPhone] = useState("");

  // マウント時に Supabase を確認
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          setMode("demo");
          setLoading(false);
          return;
        }

        const user = data.user;
        setUserId(user.id);
        setMode("db");

        const { data: rows, error: addrError } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (addrError) {
          console.warn("addresses fetch error", addrError);
          setErrorMessage("Failed to load addresses from ERA.");
          setLoading(false);
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

        setLoading(false);
      } catch (e) {
        console.error(e);
        setMode("demo");
        setErrorMessage("Unexpected error while loading addresses.");
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const handleSetDefault = async (id: string) => {
    if (mode === "demo") {
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.id === id,
        }))
      );
      return;
    }

    if (!userId) return;

    try {
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", userId);

      const { error } = await supabase
        .from("addresses")
        .update({ is_default: true })
        .eq("id", id);

      if (error) {
        console.warn("set default error", error);
        setErrorMessage("Failed to update default address.");
        return;
      }

      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.id === id,
        }))
      );
    } catch (e) {
      console.error(e);
      setErrorMessage("Unexpected error while updating default address.");
    }
  };

  const handleAddAddress = async () => {
    if (!newLabel || !newFullName || !newPostalCode || !newPref || !newCity || !newAddr1 || !newPhone) {
      setErrorMessage("Please fill required fields.");
      return;
    }

    if (mode === "demo") {
      const newAddress: Address = {
        id: `addr-${Date.now()}`,
        label: newLabel,
        fullName: newFullName,
        postalCode: newPostalCode,
        prefecture: newPref,
        city: newCity,
        address1: newAddr1,
        address2: newAddr2 || undefined,
        phone: newPhone,
        isDefault: addresses.length === 0,
      };
      setAddresses((prev) => [newAddress, ...prev]);
      resetForm();
      setErrorMessage(null);
      return;
    }

    if (!userId) {
      setErrorMessage("User not found. Please sign in again.");
      return;
    }

    try {
      const isDefault = addresses.length === 0;

      const { data, error } = await supabase
        .from("addresses")
        .insert({
          user_id: userId,
          label: newLabel,
          full_name: newFullName,
          postal_code: newPostalCode,
          prefecture: newPref,
          city: newCity,
          address1: newAddr1,
          address2: newAddr2 || null,
          phone: newPhone,
          is_default: isDefault,
        })
        .select("*")
        .single();

      if (error) {
        console.warn("insert address error", error);
        setErrorMessage("Failed to save address.");
        return;
      }

      const mapped: Address = {
        id: data.id,
        label: data.label,
        fullName: data.full_name,
        postalCode: data.postal_code,
        prefecture: data.prefecture,
        city: data.city,
        address1: data.address1,
        address2: data.address2,
        phone: data.phone,
        isDefault: data.is_default,
      };

      setAddresses((prev) => [mapped, ...prev]);
      resetForm();
      setErrorMessage(null);
    } catch (e) {
      console.error(e);
      setErrorMessage("Unexpected error while saving address.");
    }
  };

  const resetForm = () => {
    setNewLabel("");
    setNewFullName("");
    setNewPostalCode("");
    setNewPref("");
    setNewCity("");
    setNewAddr1("");
    setNewAddr2("");
    setNewPhone("");
  };

  return (
    <>
      <SectionTitle
        title="Addresses"
        subtitle="Save multiple shipping addresses and set a default one."
      />

      {/* 状態メッセージ */}
      <div style={{ marginTop: 8, fontSize: 11, color: "#6b7280" }}>
        {mode === "demo"
          ? "Demo mode: addresses are stored only in this browser for now. Once ERA Auth is ready, this will sync with your account."
          : "Connected to ERA: addresses are stored in Supabase for your account."}
      </div>

      {loading && (
        <p style={{ marginTop: 12, fontSize: 12, color: "#9ca3af" }}>
          Loading addresses...
        </p>
      )}

      {errorMessage && (
        <p style={{ marginTop: 8, fontSize: 12, color: "#f97373" }}>
          {errorMessage}
        </p>
      )}

      {/* 住所一覧 */}
      {!loading && (
        <div
          style={{
            marginTop: 18,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {addresses.length === 0 && (
            <p style={{ fontSize: 12, color: "#9ca3af" }}>
              No addresses yet. Add your first shipping address below.
            </p>
          )}

          {addresses.map((addr) => (
            <div
              key={addr.id}
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
                alignItems: "flex-start",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    color: "#9ca3af",
                    marginBottom: 4,
                  }}
                >
                  {addr.label}
                  {addr.isDefault ? " • DEFAULT" : ""}
                </div>
                <div>{addr.fullName}</div>
                <div style={{ color: "#9ca3af" }}>
                  {addr.postalCode} {addr.prefecture} {addr.city}
                </div>
                <div style={{ color: "#9ca3af" }}>{addr.address1}</div>
                {addr.address2 && (
                  <div style={{ color: "#9ca3af" }}>{addr.address2}</div>
                )}
                <div style={{ color: "#6b7280", marginTop: 4 }}>
                  TEL: {addr.phone}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  minWidth: 120,
                  alignItems: "flex-end",
                }}
              >
                {!addr.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(addr.id)}
                    style={{
                      borderRadius: 999,
                      border: "1px solid #1f2937",
                      background: "transparent",
                      color: "#e5e7eb",
                      fontSize: 11,
                      padding: "5px 10px",
                      cursor: "pointer",
                    }}
                  >
                    Set as default
                  </button>
                )}
                <button
                  type="button"
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#9ca3af",
                    fontSize: 11,
                    cursor: "pointer",
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                  }}
                >
                  Edit (later)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 新しい住所追加 */}
      <div
        style={{
          marginTop: 20,
          paddingTop: 14,
          borderTop: "1px solid #111827",
        }}
      >
        <div
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "#9ca3af",
            marginBottom: 8,
          }}
        >
          Add new address
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 8,
            fontSize: 12,
          }}
        >
          <input
            placeholder="Label (Home / Office)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Full name"
            value={newFullName}
            onChange={(e) => setNewFullName(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Postal code"
            value={newPostalCode}
            onChange={(e) => setNewPostalCode(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Prefecture"
            value={newPref}
            onChange={(e) => setNewPref(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="City"
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Address line 1"
            value={newAddr1}
            onChange={(e) => setNewAddr1(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Address line 2 (optional)"
            value={newAddr2}
            onChange={(e) => setNewAddr2(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Phone number"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            style={inputStyle}
          />
        </div>
        <button
          type="button"
          onClick={handleAddAddress}
          style={{
            marginTop: 10,
            borderRadius: 999,
            border: "1px solid #facc15",
            background: "#facc15",
            color: "#111827",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            padding: "7px 16px",
            cursor: "pointer",
          }}
        >
          Save address
        </button>
      </div>
    </>
  );
}

// =========================
// Payment Methods（ローカル状態）
// =========================

function PaymentsSection() {
  const [methods, setMethods] = useState<PaymentMethod[]>([
    {
      id: "pm-1",
      brand: "VISA",
      last4: "4242",
      expiresAt: "12/27",
      isDefault: true,
      label: "Main Card",
    },
    {
      id: "pm-2",
      brand: "Apple Pay",
      isDefault: false,
      label: "iPhone",
    },
    {
      id: "pm-3",
      brand: "PayPay",
      isDefault: false,
      label: "PayPay Wallet",
    },
  ]);

  const handleSetDefault = (id: string) => {
    setMethods((prev) =>
      prev.map((m) => ({
        ...m,
        isDefault: m.id === id,
      }))
    );
  };

  return (
    <>
      <SectionTitle
        title="Payment Methods"
        subtitle="Manage saved cards and wallets for ERA."
      />

      <div
        style={{
          marginTop: 18,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {methods.map((m) => (
          <div
            key={m.id}
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
            <div>
              <div
                style={{
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: "#9ca3af",
                  marginBottom: 4,
                }}
              >
                {m.brand}
                {m.isDefault ? " • DEFAULT" : ""}
              </div>
              <div>
                {m.brand === "VISA" ||
                m.brand === "Mastercard" ||
                m.brand === "Amex"
                  ? `•••• •••• •••• ${m.last4 ?? "XXXX"}`
                  : m.label ?? ""}
              </div>
              {m.expiresAt && (
                <div style={{ color: "#6b7280", marginTop: 2 }}>
                  Expires {m.expiresAt}
                </div>
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                minWidth: 140,
                alignItems: "flex-end",
              }}
            >
              {!m.isDefault && (
                <button
                  type="button"
                  onClick={() => handleSetDefault(m.id)}
                  style={{
                    borderRadius: 999,
                    border: "1px solid #1f2937",
                    background: "transparent",
                    color: "#e5e7eb",
                    fontSize: 11,
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  Set as default
                </button>
              )}
              <button
                type="button"
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#9ca3af",
                  fontSize: 11,
                  cursor: "pointer",
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                }}
              >
                Remove (later)
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 新しい支払い方法 */}
      <div
        style={{
          marginTop: 20,
          paddingTop: 14,
          borderTop: "1px solid #111827",
        }}
      >
        <div
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "#9ca3af",
            marginBottom: 8,
          }}
        >
          Add payment method
        </div>
        <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 0 }}>
          実際のカード登録・Apple Pay / Google Pay / PayPay 接続は Stripe / 決済ゲートウェイと連携して実装予定。
          ここは将来的に「支払い方法を追加」フローの入口にする。
        </p>
      </div>
    </>
  );
}

// =========================
// Orders（Supabase連携）
// =========================

function OrdersSection() {
  const supabase = useMemo(() => getSupabaseClient(), []);

  const [mode, setMode] = useState<"demo" | "db">("demo");
  const [userId, setUserId] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "order-demo-1",
      number: "ERA-2025-0001",
      createdAt: "2025-11-20",
      total: 26400,
      currency: "JPY",
      status: "DELIVERED",
      itemsSummary: "ERA Essential Tee / White ×1, Wide Sweatpant / Black ×1",
    },
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setErrorMessage(null);

      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          setMode("demo");
          setUserId(null);
          setLoading(false);
          return;
        }

        const user = data.user;
        setUserId(user.id);
        setMode("db");

        const { data: rows, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (ordersError) {
          console.warn("orders fetch error", ordersError);
          setErrorMessage("Failed to load orders from ERA.");
          setLoading(false);
          return;
        }

        if (rows && rows.length > 0) {
          const mapped: Order[] = (rows as OrderRow[]).map((row) => ({
            id: row.id,
            number: row.number,
            createdAt: row.created_at,
            total: row.total,
            currency: row.currency,
            status: row.status,
            itemsSummary: row.items_summary,
          }));
          setOrders(mapped);
        } else {
          setOrders([]);
        }

        setLoading(false);
      } catch (e) {
        console.error(e);
        setMode("demo");
        setErrorMessage("Unexpected error while loading orders.");
        setLoading(false);
      }
    };

    load();
  }, [supabase]);

  const statusLabel = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
        return "Pending";
      case "PAID":
        return "Paid";
      case "SHIPPED":
        return "Shipped";
      case "DELIVERED":
        return "Delivered";
      case "CANCELED":
        return "Canceled";
      default:
        return status;
    }
  };

  const statusColor = (status: OrderStatus) => {
    switch (status) {
      case "DELIVERED":
        return "#22c55e";
      case "SHIPPED":
        return "#38bdf8";
      case "PAID":
        return "#facc15";
      case "PENDING":
        return "#eab308";
      case "CANCELED":
        return "#f97373";
      default:
        return "#9ca3af";
    }
  };

  return (
    <>
      <SectionTitle
        title="Orders"
        subtitle="View your full purchase history on ERA."
      />

      <div style={{ marginTop: 8, fontSize: 11, color: "#6b7280" }}>
        {mode === "demo"
          ? "Demo mode: sample orders only. Sign in to see your real ERA orders."
          : "Connected to ERA: orders are loaded from your account in Supabase."}
      </div>

      {loading && (
        <p style={{ marginTop: 12, fontSize: 12, color: "#9ca3af" }}>
          Loading orders...
        </p>
      )}

      {errorMessage && (
        <p style={{ marginTop: 8, fontSize: 12, color: "#f97373" }}>
          {errorMessage}
        </p>
      )}

      {!loading && orders.length === 0 && (
        <p style={{ marginTop: 12, fontSize: 12, color: "#9ca3af" }}>
          You have no orders yet.
        </p>
      )}

      {!loading && orders.length > 0 && (
        <div
          style={{
            marginTop: 18,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {orders.map((o) => (
            <div
              key={o.id}
              style={{
                borderRadius: 16,
                border: "1px solid #111827",
                background:
                  "radial-gradient(circle at top, #020617, #020617 60%, #020617)",
                padding: 12,
                fontSize: 12,
                display: "grid",
                gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    color: "#9ca3af",
                  }}
                >
                  {o.number}
                </div>
                <div style={{ marginTop: 4 }}>{o.itemsSummary}</div>
                <div
                  style={{
                    marginTop: 4,
                    color: "#6b7280",
                  }}
                >
                  Ordered on {o.createdAt}
                </div>
              </div>

              <div
                style={{
                  textAlign: "right",
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                  alignItems: "flex-end",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    color: "#e5e7eb",
                  }}
                >
                  ¥{o.total.toLocaleString("ja-JP")}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: statusColor(o.status),
                  }}
                >
                  {statusLabel(o.status)}
                </div>
                <button
                  type="button"
                  style={{
                    marginTop: 4,
                    borderRadius: 999,
                    border: "1px solid #1f2937",
                    background: "transparent",
                    color: "#e5e7eb",
                    fontSize: 11,
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  View details (later)
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize: 11, color: "#6b7280", marginTop: 10 }}>
        ※ 注文レコードは `/api/checkout` + Stripe Webhook から Supabase に保存される想定。
      </p>
    </>
  );
}

// =========================
// Points & Prime
// =========================

function PointsSection() {
  const currentBalance = 1240;
  const entries: PointEntry[] = [
    {
      id: "pt-1",
      createdAt: "2025-11-26",
      delta: +240,
      reason: "Order ERA-2025-0002 reward",
    },
    {
      id: "pt-2",
      createdAt: "2025-11-20",
      delta: +1000,
      reason: "Order ERA-2025-0001 reward",
    },
    {
      id: "pt-3",
      createdAt: "2025-11-22",
      delta: -800,
      reason: "Used at checkout ERA-2025-0001",
    },
  ];

  return (
    <>
      <SectionTitle
        title="Points & Prime"
        subtitle="Check your ERA points and Prime benefits."
      />

      {/* 残高 */}
      <div
        style={{
          marginTop: 18,
          borderRadius: 18,
          border: "1px solid #111827",
          background:
            "radial-gradient(circle at top, #0f172a, #020617 70%, #020617)",
          padding: 14,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 13,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "#9ca3af",
            }}
          >
            Current Points
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 20,
              color: "#facc15",
            }}
          >
            {currentBalance.toLocaleString("ja-JP")} pt
          </div>
        </div>
        <div
          style={{
            textAlign: "right",
            fontSize: 11,
            color: "#9ca3af",
          }}
        >
          Used at checkout as ERA currency. <br />
          1 pt ≒ ¥1（仮）
        </div>
      </div>

      {/* 履歴 */}
      <div
        style={{
          marginTop: 20,
        }}
      >
        <div
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "#9ca3af",
            marginBottom: 8,
          }}
        >
          Point history
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            fontSize: 12,
          }}
        >
          {entries.map((e) => (
            <div
              key={e.id}
              style={{
                borderRadius: 14,
                border: "1px solid #111827",
                background:
                  "radial-gradient(circle at top, #020617, #020617 60%, #020617)",
                padding: 10,
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div>
                <div style={{ color: "#e5e7eb" }}>{e.reason}</div>
                <div
                  style={{
                    marginTop: 2,
                    color: "#6b7280",
                    fontSize: 11,
                  }}
                >
                  {e.createdAt}
                </div>
              </div>
              <div
                style={{
                  fontWeight: 500,
                  color: e.delta >= 0 ? "#22c55e" : "#f97373",
                }}
              >
                {e.delta >= 0 ? "+" : ""}
                {e.delta.toLocaleString("ja-JP")} pt
              </div>
            </div>
          ))}
        </div>
      </div>

      <p style={{ fontSize: 11, color: "#6b7280", marginTop: 10 }}>
        ※ 今はダミーデータ。あとで Supabase のポイント台帳テーブルと連携させる。
      </p>
    </>
  );
}

// =========================
// Prime / GiftCard / Privacy / Support
// =========================

function PrimeSection() {
  return (
    <>
      <SectionTitle
        title="ERA Prime"
        subtitle="Membership plan and benefits."
      />
      <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 18 }}>
        ERA Prime の契約状況、更新日、特典（送料無料・先行販売・限定コレクションアクセスなど）をここに集約する。
        将来的には Supabase の <code>prime_subscriptions</code> テーブルと連携。
      </p>
    </>
  );
}

function GiftCardSection() {
  return (
    <>
      <SectionTitle
        title="ERA Gift Cards"
        subtitle="Manage gift card codes and balance."
      />
      <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 18 }}>
        ギフトカードコードの登録、残高、使用履歴を表示する予定。Supabase の{" "}
        <code>gift_cards</code> テーブルと連携して、ERA ギフトコードを本格運用できるようにする。
      </p>
    </>
  );
}

function PrivacySection() {
  return (
    <>
      <SectionTitle
        title="Privacy & Account"
        subtitle="Policy, data and account deletion."
      />
      <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 18 }}>
        プライバシーポリシー、利用規約、アカウント解約のフローなどをここにまとめる。
        ERA の世界観に合わせて、静かで堅いトーンの文章をあとでしっかり書く。
      </p>
    </>
  );
}

function SupportSection() {
  return (
    <>
      <SectionTitle
        title="Customer Service"
        subtitle="Contact ERA when you need help."
      />
      <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 18 }}>
        お問い合わせフォームやサポート用のメールアドレス、よくある質問へのリンクなどをここに置く。
        「注文について」「返品・交換」「支払い」「Prime」「ギフトカード」などカテゴリ別の FAQ を作れるようにする。
      </p>
    </>
  );
}
