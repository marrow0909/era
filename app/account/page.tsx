"use client";

export const dynamic = "force-dynamic";


 feature/shadow-org
import React, { useEffect, useState } from "react";
import { getSupabaseClient } from "../lib/supabaseClient";

type ShippingInfo = {
  shipping_name: string;
  shipping_postal: string;
  shipping_address: string;
};

export default function AccountPage() {
  const supabase = getSupabaseClient();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // shipping
  const [shippingName, setShippingName] = useState("");
  const [shippingPostal, setShippingPostal] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");

  const [eraPoints, setEraPoints] = useState<number | null>(null);

  const [message, setMessage] = useState<string | null>(null);

  // 初期ロード
  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserEmail(user.email ?? null);
        const meta = (user.user_metadata || {}) as any;
        setName(meta.display_name ?? "");
        setEmail(user.email ?? "");
        setShippingName(meta.shipping_name ?? "");
        setShippingPostal(meta.shipping_postal ?? "");
        setShippingAddress(meta.shipping_address ?? "");
        if (typeof meta.era_points === "number") {
          setEraPoints(meta.era_points);
        } else {
          setEraPoints(0);
        }
      }
    };
    load();
  }, [supabase]);

  const loggedIn = !!userEmail;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
          era_points: 0,
        },
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        data.user?.email_confirmed_at
          ? "Account created and signed in."
          : "Sign-up email sent. Please check your inbox."
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUserEmail(user?.email ?? null);

    setLoading(false);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Signed in.");
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? null);
        const meta = (user.user_metadata || {}) as any;
        setName(meta.display_name ?? "");
        setShippingName(meta.shipping_name ?? "");
        setShippingPostal(meta.shipping_postal ?? "");
        setShippingAddress(meta.shipping_address ?? "");
        if (typeof meta.era_points === "number") {
          setEraPoints(meta.era_points);
        } else {
          setEraPoints(0);
        }
      }
    }

    setLoading(false);
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      data: {
        display_name: name,
        shipping_name: shippingName,
        shipping_postal: shippingPostal,
        shipping_address: shippingAddress,
        era_points: eraPoints ?? 0,
      },
    });

    if (error) setMessage(error.message);
    else setMessage("Profile & address updated.");

    setLoading(false);
  };

  const handleSignOut = async () => {
    setMessage(null);
    setLoading(true);

    await supabase.auth.signOut();
    setUserEmail(null);
    setLoading(false);
    setMessage("Signed out. Cart actions will require sign-in again.");
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        padding: "32px 40px 40px",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      {/* ヘッダー */}
      <header
        style={{
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
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
            ERA ACCOUNT
          </p>
          <h1
            style={{
              fontSize: 20,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              margin: "8px 0 0",
            }}
          >
            {loggedIn ? "Profile" : "Sign In"}
          </h1>
        </div>

        <div
          style={{
            fontSize: 11,
            color: "#6b7280",
            textAlign: "right",
          }}
        >
          {loggedIn ? (
            <>
              <div>Signed in as</div>
              <div style={{ color: "#e5e7eb" }}>{userEmail}</div>
              {eraPoints !== null && (
                <div style={{ marginTop: 4 }}>
                  ERA Points:{" "}
                  <span style={{ color: "#facc15" }}>
                    {eraPoints.toLocaleString("ja-JP")} pt
                  </span>
                </div>
              )}
            </>
          ) : (
            <div>Use your email to access ERA.</div>
          )}
        </div>
      </header>

      {/* メインカード */}
      <div
        style={{
          borderRadius: 24,
          border: "1px solid #111827",
          background:
            "linear-gradient(to bottom right, rgba(15,23,42,0.98), rgba(15,23,42,0.95))",
          padding: 22,
          boxShadow: "0 26px 60px rgba(0,0,0,0.85)",
        }}
      >
        {message && (
          <p
            style={{
              fontSize: 11,
              color: "#e5e7eb",
              marginBottom: 14,
            }}
          >
            {message}
          </p>
        )}

        {loggedIn ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
              gap: 18,
            }}
          >
            {/* 左：プロフィール＋住所 */}
            <form onSubmit={handleUpdateProfile}>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#9ca3af",
                  margin: "0 0 10px",
                }}
              >
                Profile & Address
              </p>

              <Field
                label="Display Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="How ERA should address you"
              />

              <Field
                label="Shipping Name"
                type="text"
                value={shippingName}
                onChange={(e) => setShippingName(e.target.value)}
                placeholder="Name for delivery"
              />

              <Field
                label="Postal Code"
                type="text"
                value={shippingPostal}
                onChange={(e) => setShippingPostal(e.target.value)}
                placeholder="e.g. 123-4567"
              />

              <Field
                label="Address"
                type="text"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder="Prefecture, city, street, building"
              />

              <button type="submit" style={primaryButtonStyle} disabled={loading}>
                {loading ? "Saving…" : "Save Profile & Address"}
              </button>
            </form>

            {/* 右：セッション＆ポイント説明 */}
            <div>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "#9ca3af",
                  margin: "0 0 10px",
                }}
              >
                Session & Points
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "#d1d5db",
                  marginBottom: 10,
                }}
              >
                Cart and shadow access checks use this session. ERA points will
                grow as you complete orders. In future, they can be applied to
                selected pieces or experiences.
              </p>
              <button
                type="button"
                onClick={handleSignOut}
                style={secondaryButtonStyle}
                disabled={loading}
              >
                {loading ? "…" : "Sign Out"}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* タブ */}
            <div
              style={{
                display: "inline-flex",
                borderRadius: 999,
                border: "1px solid #111827",
                padding: 3,
                marginBottom: 18,
              }}
            >
              <TabButton
                active={mode === "signin"}
                onClick={() => setMode("signin")}
              >
                Sign In
              </TabButton>
              <TabButton
                active={mode === "signup"}
                onClick={() => setMode("signup")}
              >
                Create Account
              </TabButton>
            </div>

            {mode === "signin" ? (
              <form onSubmit={handleSignIn}>
                <Field
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                <Field
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="submit"
                  style={primaryButtonStyle}
                  disabled={loading}
                >
                  {loading ? "Signing in…" : "Sign In"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUp}>
                <Field
                  label="Display Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="How ERA should address you"
                />
                <Field
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                <Field
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                />
                <button
                  type="submit"
                  style={primaryButtonStyle}
                  disabled={loading}
                >
                  {loading ? "Creating…" : "Create Account"}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ---- 小さい部品 ＋ スタイル ---- */

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        borderRadius: 999,
        border: "none",
        padding: "6px 18px",
        fontSize: 11,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        cursor: "pointer",
        backgroundColor: active ? "#facc15" : "transparent",
        color: active ? "#111827" : "#e5e7eb",
      }}
    >
      {children}
    </button>
  );
}

function Field(props: {
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  const { label, type, value, onChange, placeholder } = props;
  return (
    <div style={{ marginBottom: 12 }}>
      <label
        style={{
          display: "block",
          fontSize: 11,
          marginBottom: 4,
          color: "#d1d5db",
        }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 999,
  border: "1px solid #1f2937",
  padding: "8px 14px",
  backgroundColor: "rgba(15,23,42,0.9)",
  color: "#e5e7eb",
  fontSize: 12,
  outline: "none",
};

const primaryButtonStyle: React.CSSProperties = {
  marginTop: 6,
  borderRadius: 999,
  border: "1px solid #facc15",
  padding: "9px 22px",
  background: "linear-gradient(to right, #facc15, #eab308, #facc15)",
  color: "#111827",
  fontSize: 11,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  cursor: "pointer",
};

const secondaryButtonStyle: React.CSSProperties = {
  borderRadius: 999,
  border: "1px solid #1f2937",
  padding: "8px 18px",
  backgroundColor: "transparent",
  color: "#e5e7eb",
  fontSize: 11,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  cursor: "pointer",
};
