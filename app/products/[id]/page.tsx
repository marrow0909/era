"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PRODUCTS, type Product } from "../../lib/products-data";
import { useCart } from "../../context/cart-context";
import { getSupabaseClient } from "../../lib/supabaseClient";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const supabase = getSupabaseClient();
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const product = useMemo(
    () => PRODUCTS.find((p) => p.id === params.id),
    [params.id]
  );

  if (!product) {
    return (
      <div
        style={{
          minHeight: "calc(100vh - 120px)",
          padding: "32px 40px 40px",
          maxWidth: 1120,
          margin: "0 auto",
          color: "#e5e7eb",
        }}
      >
        <p>Product not found.</p>
      </div>
    );
  }

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const categoryLabel =
    product.category === "TOPS"
      ? "Tops"
      : product.category === "JACKETS"
      ? "Outer"
      : product.category === "PANTS"
      ? "Bottoms"
      : "Accessory";

  const handleAddToCart = async () => {
    // サイズ必須ならチェック
    if (product.sizes && product.sizes.length > 0) {
      if (!selectedSize) {
        alert("Please select a size before adding to cart.");
        return;
      }
    }

    // Supabase セッションチェック
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      alert("Add to Cart requires sign-in.");
      router.push("/account");
      return;
    }

    // カートへ追加（サイズ付き）
    addToCart(product, { size: selectedSize ?? undefined, quantity: 1 });

    alert(
      `"${product.name}"${
        selectedSize ? ` (${selectedSize})` : ""
      } added to your cart.`
    );
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        padding: "32px 40px 40px",
        maxWidth: 1120,
        margin: "0 auto",
      }}
    >
      {/* パンくず */}
      <div
        style={{
          fontSize: 11,
          color: "#6b7280",
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div>
          <Link href="/products">Products</Link>
          <span style={{ margin: "0 6px" }}>/</span>
          <span style={{ color: "#9ca3af" }}>{categoryLabel}</span>
        </div>
      </div>

      {/* 上段 */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.4fr) minmax(0, 1.1fr)",
          gap: 28,
          alignItems: "flex-start",
        }}
      >
        {/* 左：画像 */}
        <div
          style={{
            borderRadius: 24,
            border: "1px solid #111827",
            background:
              "radial-gradient(circle at top, #020617 0, #020617 45%, #020617 100%)",
            padding: 14,
            boxShadow: "0 26px 60px rgba(0,0,0,0.9)",
          }}
        >
          <div
            style={{
              borderRadius: 18,
              border: "1px dashed #1f2937",
              height: 340,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6b7280",
              fontSize: 12,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            IMAGE COMING SOON
          </div>
          <p
            style={{
              marginTop: 10,
              fontSize: 10,
              color: "#6b7280",
              textAlign: "right",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            ERA / {categoryLabel}
          </p>
        </div>

        {/* 右：情報 */}
        <div>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#9ca3af",
              margin: 0,
            }}
          >
            {categoryLabel}
          </p>
          <h1
            style={{
              fontSize: 20,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              margin: "8px 0 4px",
            }}
          >
            {product.name}
          </h1>

          <div
            style={{
              fontSize: 14,
              color: "#e5e7eb",
              marginBottom: 10,
            }}
          >
            ¥{product.price.toLocaleString("ja-JP")}
          </div>

          {/* 配送目安 */}
          <div
            style={{
              fontSize: 11,
              color: "#9ca3af",
              marginBottom: 12,
            }}
          >
            Ships from Japan in 3–5 business days.
            <br />
            Estimated delivery inside Japan: 3–7 days.
          </div>

          {/* サイズ選択 */}
          {product.sizes && product.sizes.length > 0 && (
            <div
              style={{
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  color: "#9ca3af",
                  marginBottom: 6,
                }}
              >
                Select Size
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                }}
              >
                {product.sizes.map((s) => {
                  const active = selectedSize === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      style={{
                        borderRadius: 999,
                        border: active
                          ? "1px solid #facc15"
                          : "1px solid #1f2937",
                        padding: "6px 14px",
                        backgroundColor: active ? "#facc15" : "transparent",
                        fontSize: 11,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: active ? "#111827" : "#e5e7eb",
                        cursor: "pointer",
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ボタン */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 18,
            }}
          >
            <button
              type="button"
              onClick={handleAddToCart}
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
              }}
            >
              Add to Cart
            </button>

            <button
              type="button"
              style={{
                borderRadius: 999,
                border: "1px solid #1f2937",
                padding: "9px 18px",
                backgroundColor: "transparent",
                color: "#e5e7eb",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Save for Later
            </button>
          </div>

          {/* 説明 */}
          <div
            style={{
              fontSize: 12,
              color: "#d1d5db",
              marginBottom: 14,
              lineHeight: 1.7,
            }}
          >
            {product.description}
          </div>

          {/* 素材など */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,1fr) minmax(0,1fr)",
              gap: 10,
              fontSize: 11,
              color: "#9ca3af",
            }}
          >
            {product.material && (
              <div>
                <div
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    marginBottom: 3,
                  }}
                >
                  Material
                </div>
                <div style={{ color: "#e5e7eb" }}>{product.material}</div>
              </div>
            )}
            {product.fit && (
              <div>
                <div
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    marginBottom: 3,
                  }}
                >
                  Fit
                </div>
                <div style={{ color: "#e5e7eb" }}>{product.fit}</div>
              </div>
            )}
            {product.care && (
              <div>
                <div
                  style={{
                    textTransform: "uppercase",
                    letterSpacing: "0.18em",
                    marginBottom: 3,
                  }}
                >
                  Care
                </div>
                <div style={{ color: "#e5e7eb" }}>{product.care}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 関連商品は前と同じ */}
      {related.length > 0 && (
        <div
          style={{
            marginTop: 32,
          }}
        >
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: "#9ca3af",
              margin: "0 0 10px",
            }}
          >
            Related Items
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.id}`}
                style={{ textDecoration: "none" }}
              >
                <RelatedCard product={item} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RelatedCard({ product }: { product: Product }) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid #111827",
        background:
          "linear-gradient(to bottom right, rgba(15,23,42,0.97), rgba(15,23,42,0.94))",
        padding: 10,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div
        style={{
          borderRadius: 12,
          border: "1px dashed #1f2937",
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 10,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#6b7280",
        }}
      >
        ERA
      </div>
      <div
        style={{
          fontSize: 12,
          color: "#e5e7eb",
        }}
      >
        {product.name}
      </div>
      <div
        style={{
          fontSize: 11,
          color: "#d1d5db",
        }}
      >
        ¥{product.price.toLocaleString("ja-JP")}
      </div>
    </div>
  );
}
