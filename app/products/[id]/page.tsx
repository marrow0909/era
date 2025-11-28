// app/products/[id]/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  PRODUCTS,
  type Product,
} from "../../lib/products-data";
import { getSupabaseClient } from "../../lib/supabaseClient";

// =====================
// 型
// =====================

type ReviewRow = {
  id: string;
  created_at: string;
  user_id: string;
  product_id: string;
  rating: number;
  comment: string;
  display_name: string | null;
};

// 星の UI
function RatingStars({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  if (reviewCount === 0) {
    return <span style={{ color: "#6b7280", fontSize: 12 }}>No reviews yet</span>;
  }

  const rounded = Math.round(rating * 2) / 2;
  const full = Math.floor(rounded);
  const half = rounded - full >= 0.5;

  return (
    <span style={{ color: "#facc15", fontSize: 12 }}>
      {"★".repeat(full)}
      {half ? "½" : ""}
      <span style={{ color: "#9ca3af" }}>
        {" "}
        ({rating.toFixed(1)} / 5 • {reviewCount})
      </span>
    </span>
  );
}

// 関連商品
function getRelatedProducts(current: Product): Product[] {
  return PRODUCTS.filter(
    (p) =>
      p.id !== current.id &&
      (p.subCategory === current.subCategory ||
        p.gender === current.gender ||
        p.category === current.category)
  ).slice(0, 6);
}

// =====================
// メインページ
// =====================

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = useMemo(() => getSupabaseClient(), []);

  const idParam = params?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  const product = PRODUCTS.find((p) => p.id === id);

  const [userId, setUserId] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string | null>(null);

  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState<boolean>(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>("");
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // 1) ユーザー情報取得
  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();
        if (error || !data?.user) {
          setUserId(null);
          setUserDisplayName(null);
          return;
        }
        setUserId(data.user.id);
        const email = data.user.email ?? "";
        setUserDisplayName(data.user.user_metadata?.name ?? email);
      } catch (e) {
        console.error(e);
        setUserId(null);
        setUserDisplayName(null);
      }
    };
    loadUser();
  }, [supabase]);

  // 2) レビュー一覧ロード
  useEffect(() => {
    if (!product) return;

    const loadReviews = async () => {
      setReviewsLoading(true);
      setReviewsError(null);
      try {
        const { data, error } = await supabase
          .from("reviews")
          .select("*")
          .eq("product_id", product.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.warn("reviews fetch error", error);
          setReviewsError("Failed to load reviews.");
          setReviewsLoading(false);
          return;
        }

        setReviews((data as ReviewRow[]) ?? []);
        setReviewsLoading(false);
      } catch (e) {
        console.error(e);
        setReviewsError("Unexpected error while loading reviews.");
        setReviewsLoading(false);
      }
    };

    loadReviews();
  }, [supabase, product]);

  if (!product) {
    return (
      <div style={{ padding: 40 }}>
        <h1 style={{ color: "#e5e7eb" }}>Product not found.</h1>
      </div>
    );
  }

  // 3) 表示用の平均値（Supabase にレビューがあればそれを優先）
  const effectiveReviewCount =
    reviews.length > 0 ? reviews.length : product.reviewCount;
  const effectiveRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : product.rating;

  const related = getRelatedProducts(product);

  // 4) レビュー投稿
  const handleSubmitReview = async () => {
    setSubmitError(null);

    if (!userId) {
      router.push("/auth");
      return;
    }

    if (!newComment.trim()) {
      setSubmitError("Please write a comment.");
      return;
    }

    if (newRating < 1 || newRating > 5) {
      setSubmitError("Rating must be between 1 and 5.");
      return;
    }

    setSubmitLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .insert({
          user_id: userId,
          product_id: product.id,
          rating: newRating,
          comment: newComment.trim(),
          display_name: userDisplayName,
        })
        .select("*")
        .single();

      if (error) {
        console.warn("insert review error", error);
        setSubmitError("Failed to submit review.");
        setSubmitLoading(false);
        return;
      }

      const inserted = data as ReviewRow;
      setReviews((prev) => [inserted, ...prev]);
      setNewComment("");
      setNewRating(5);
      setSubmitLoading(false);
    } catch (e) {
      console.error(e);
      setSubmitError("Unexpected error while submitting review.");
      setSubmitLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: "32px 40px 40px",
        maxWidth: 1100,
        margin: "0 auto",
        color: "#e5e7eb",
      }}
    >
      {/* 戻る */}
      <Link
        href="/products"
        style={{ fontSize: 12, color: "#9ca3af", textDecoration: "underline" }}
      >
        ← Back to Products
      </Link>

      {/* 上：商品メイン */}
      <div
        style={{
          marginTop: 24,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 28,
        }}
      >
        {/* 画像エリア（仮） */}
        <div
          style={{
            borderRadius: 18,
            border: "1px solid #111827",
            height: 420,
            background:
              "radial-gradient(circle at top, #020617, #020617 60%, #020617)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            letterSpacing: "0.26em",
            textTransform: "uppercase",
            color: "#6b7280",
          }}
        >
          {product.tag === "Soon" ? "SOON" : "ERA PRODUCT"}
        </div>

        {/* 詳細情報 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              color: "#9ca3af",
            }}
          >
            {product.category} • {product.gender} • {product.subCategory}
          </div>

          <h1
            style={{
              fontSize: 24,
              margin: 0,
              letterSpacing: "0.12em",
            }}
          >
            {product.name}
          </h1>

          {/* レビュー（Supabaseの数値 or ダミー） */}
          <RatingStars
            rating={effectiveRating}
            reviewCount={effectiveReviewCount}
          />

          {/* PRIME */}
          {product.isPrimeEligible && (
            <div
              style={{
                marginTop: 4,
                fontSize: 11,
                color: "#facc15",
                textTransform: "uppercase",
              }}
            >
                ERA PRIME ✔ Free Shipping
            </div>
          )}

          {/* 価格 */}
          <div
            style={{
              marginTop: 8,
              fontSize: 22,
              fontWeight: 500,
            }}
          >
            ¥{product.price.toLocaleString("ja-JP")}
          </div>

          {/* カートボタン（後で本実装） */}
          <button
            style={{
              marginTop: 14,
              borderRadius: 999,
              border: "none",
              background: "#facc15",
              color: "#111827",
              padding: "12px 22px",
              fontSize: 14,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
            onClick={() =>
              alert("ログインしてカートに入れる（後で本実装と統合）")
            }
          >
            Add to Cart
          </button>

          {/* 商品説明（仮） */}
          <p style={{ marginTop: 20, color: "#9ca3af", fontSize: 13 }}>
            ERA のミニマルでラグジュアリーなデザインに基づいたアイテムです。
            最高の品質をベースに、ユニセックスでどのスタイルにも合うように設計。
          </p>
        </div>
      </div>

      {/* レビュー一覧 */}
      <div style={{ marginTop: 40 }}>
        <h2
          style={{
            fontSize: 16,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          Customer Reviews
        </h2>

        {reviewsLoading ? (
          <p style={{ marginTop: 8, fontSize: 13, color: "#9ca3af" }}>
            Loading reviews...
          </p>
        ) : reviewsError ? (
          <p style={{ marginTop: 8, fontSize: 13, color: "#f97373" }}>
            {reviewsError}
          </p>
        ) : reviews.length === 0 ? (
          <p style={{ marginTop: 8, fontSize: 13, color: "#9ca3af" }}>
            レビューはまだありません。
          </p>
        ) : (
          <div
            style={{
              marginTop: 12,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
        )}

        {/* レビュー投稿フォーム */}
        <div
          style={{
            marginTop: 20,
            padding: 16,
            borderRadius: 18,
            border: "1px solid #111827",
          }}
        >
          <div
            style={{
              fontSize: 13,
              marginBottom: 8,
            }}
          >
            Write a Review
          </div>

          {userId === null && (
            <p
              style={{
                fontSize: 12,
                color: "#9ca3af",
                marginBottom: 8,
              }}
            >
              ログインするとレビューを書けます。
            </p>
          )}

          {/* 評価（1〜5） */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
              fontSize: 12,
            }}
          >
            <span>Rating:</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setNewRating(n)}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  border:
                    n === newRating ? "1px solid #facc15" : "1px solid #111827",
                  background:
                    n === newRating ? "#facc15" : "rgba(15,23,42,0.9)",
                  color: n === newRating ? "#111827" : "#e5e7eb",
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                {n}
              </button>
            ))}
          </div>

          <textarea
            placeholder="レビューを書く..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            style={{
              width: "100%",
              height: 80,
              background: "rgba(15,23,42,0.9)",
              border: "1px solid #1f2937",
              borderRadius: 12,
              padding: 10,
              color: "#e5e7eb",
              resize: "none",
              fontSize: 12,
            }}
          />

          {submitError && (
            <p
              style={{
                marginTop: 6,
                fontSize: 12,
                color: "#f97373",
              }}
            >
              {submitError}
            </p>
          )}

          <button
            type="button"
            disabled={submitLoading}
            onClick={handleSubmitReview}
            style={{
              marginTop: 10,
              borderRadius: 999,
              background: submitLoading ? "#eab308" : "#facc15",
              border: "none",
              padding: "8px 18px",
              color: "#111827",
              cursor: submitLoading ? "default" : "pointer",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
            }}
          >
            {submitLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

      {/* 関連商品 */}
      <div style={{ marginTop: 50 }}>
        <h2
          style={{
            fontSize: 16,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            marginBottom: 14,
          }}
        >
          Related Products
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 18,
          }}
        >
          {related.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`} style={{ textDecoration: "none" }}>
              <RelatedCard product={p} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

// =====================
// 小さいカードたち
// =====================

function ReviewCard({ review }: { review: ReviewRow }) {
  const rounded = Math.round(review.rating * 2) / 2;
  const full = Math.floor(rounded);
  const half = rounded - full >= 0.5;

  const labelName =
    review.display_name && review.display_name.trim().length > 0
      ? review.display_name
      : "ERA Member";

  return (
    <div
      style={{
        borderRadius: 14,
        border: "1px solid #111827",
        padding: 12,
        background:
          "linear-gradient(to bottom right, rgba(15,23,42,0.97), rgba(15,23,42,0.94))",
      }}
    >
      <div style={{ fontSize: 12, color: "#facc15" }}>
        {"★".repeat(full)}
        {half ? "½" : ""}
      </div>
      <div style={{ fontSize: 12, marginTop: 4 }}>{review.comment}</div>
      <div style={{ fontSize: 11, marginTop: 6, color: "#9ca3af" }}>— {labelName}</div>
    </div>
  );
}

function RelatedCard({ product }: { product: Product }) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid #111827",
        padding: 12,
        background:
          "linear-gradient(to bottom right, rgba(15,23,42,0.97), rgba(15,23,42,0.94))",
      }}
    >
      <div
        style={{
          borderRadius: 14,
          border: "1px dashed #1f2937",
          height: 140,
          background: "#020617",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#6b7280",
          fontSize: 11,
        }}
      >
        ERA
      </div>

      <div style={{ marginTop: 8, fontSize: 12 }}>{product.name}</div>
      <div style={{ marginTop: 4, fontSize: 12, color: "#d1d5db" }}>
        ¥{product.price.toLocaleString("ja-JP")}
      </div>
    </div>
  );
}
