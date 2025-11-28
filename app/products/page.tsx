// app/products/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import {
  PRODUCTS,
  CATEGORY_FILTERS,
  type CategoryFilterId,
  type Product,
  type Gender,
} from "../lib/products-data";

// 性別フィルター用
type GenderFilterId = "ALL" | Gender;

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] =
    useState<CategoryFilterId>("ALL");
  const [activeGender, setActiveGender] = useState<GenderFilterId>("ALL");

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;

    if (activeCategory !== "ALL") {
      result = result.filter((p) => p.category === activeCategory);
    }

    if (activeGender !== "ALL") {
      result = result.filter((p) => p.gender === activeGender);
    }

    return result;
  }, [activeCategory, activeGender]);

  return (
    <div
      style={{
        minHeight: "calc(100vh - 120px)",
        padding: "32px 40px 40px",
        maxWidth: 1120,
        margin: "0 auto",
      }}
    >
      {/* タイトル行 */}
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
            ERA COLLECTION
          </p>
          <h1
            style={{
              fontSize: 20,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              margin: "8px 0 0",
            }}
          >
            Products
          </h1>
        </div>

        <div
          style={{
            fontSize: 11,
            color: "#6b7280",
            textAlign: "right",
          }}
        >
          <div>{filteredProducts.length} items</div>
        </div>
      </div>

      {/* 性別フィルター（大枠：男・女・ユニセックス） */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 10,
          fontSize: 11,
        }}
      >
        {(
          [
            { id: "ALL", label: "All" },
            { id: "MEN", label: "Men" },
            { id: "WOMEN", label: "Women" },
            { id: "UNISEX", label: "Unisex" },
          ] as { id: GenderFilterId; label: string }[]
        ).map((g) => {
          const active = activeGender === g.id;
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => setActiveGender(g.id)}
              style={{
                borderRadius: 999,
                border: "1px solid #111827",
                background: active ? "#facc15" : "transparent",
                color: active ? "#111827" : "#e5e7eb",
                padding: "5px 14px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              {g.label}
            </button>
          );
        })}
      </div>

      {/* カテゴリーバー（Tops / Jackets / Pants / Accessories） */}
      <div
        style={{
          borderRadius: 999,
          border: "1px solid #111827",
          background:
            "linear-gradient(to right, rgba(15,23,42,0.98), rgba(15,23,42,0.96))",
          padding: 4,
          display: "inline-flex",
          gap: 4,
          marginBottom: 18,
        }}
      >
        {CATEGORY_FILTERS.map((cat) => {
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              style={{
                borderRadius: 999,
                border: "none",
                padding: "6px 16px",
                cursor: "pointer",
                fontSize: 11,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                backgroundColor: active ? "#facc15" : "transparent",
                color: active ? "#111827" : "#e5e7eb",
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 商品グリッド */}
      <div
        style={{
          marginTop: 10,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 18,
        }}
      >
        {filteredProducts.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.id}`}
            style={{ textDecoration: "none" }}
          >
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const categoryLabel =
    product.category === "TOPS"
      ? "Tops"
      : product.category === "JACKETS"
      ? "Outer"
      : product.category === "PANTS"
      ? "Bottoms"
      : product.category === "ACCESSORIES"
      ? "Accessory"
      : "Item";

  const genderLabel =
    product.gender === "MEN"
      ? "Men"
      : product.gender === "WOMEN"
      ? "Women"
      : "Unisex";

  const roundedRating = product.rating > 0 ? Math.round(product.rating * 2) / 2 : 0;
  const fullStars = Math.floor(roundedRating);
  const halfStar = roundedRating - fullStars >= 0.5;

  const starText =
    roundedRating === 0
      ? "No reviews yet"
      : "★".repeat(fullStars) +
        (halfStar ? "½" : "") +
        `  (${product.rating.toFixed(1)} / 5, ${product.reviewCount})`;

  const isSoon = product.tag === "Soon";

  return (
    <div
      style={{
        borderRadius: 18,
        border: "1px solid #111827",
        background:
          "linear-gradient(to bottom right, rgba(15,23,42,0.97), rgba(15,23,42,0.94))",
        padding: 10,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        transition: "transform 0.16s ease, box-shadow 0.16s ease",
      }}
    >
      {/* 画像プレースホルダー */}
      <div
        style={{
          borderRadius: 14,
          border: "1px dashed #1f2937",
          background:
            "radial-gradient(circle at top, #020617 0, #020617 50%, #020617 100%)",
          height: 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 11,
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: "#6b7280",
        }}
      >
        {isSoon ? "SOON" : "ERA"}
      </div>

      {/* テキスト部分 */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#9ca3af",
          }}
        >
          {categoryLabel} • {genderLabel}
        </div>

        <div
          style={{
            fontSize: 13,
            color: "#e5e7eb",
          }}
        >
          {product.name}
        </div>

        <div
          style={{
            fontSize: 12,
            color: "#d1d5db",
          }}
        >
          ¥{product.price.toLocaleString("ja-JP")}
        </div>

        {/* レビュー表示 */}
        <div
          style={{
            fontSize: 11,
            color: product.rating > 0 ? "#facc15" : "#6b7280",
            marginTop: 2,
          }}
        >
          {starText}
        </div>

        {/* タグ（New / Soon / Limited） */}
        {product.tag && (
          <div
            style={{
              marginTop: 2,
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              color: product.tag === "Soon" ? "#f97373" : "#facc15",
            }}
          >
            {product.tag}
          </div>
        )}
      </div>
    </div>
  );
}
