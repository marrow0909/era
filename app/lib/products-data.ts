// app/lib/products-data.ts

// 大きいカテゴリ（今まで通り）
export type CategoryFilterId = "ALL" | "TOPS" | "JACKETS" | "PANTS" | "ACCESSORIES";

// 男・女・ユニセックス
export type Gender = "MEN" | "WOMEN" | "UNISEX";

// もう一段細かいカテゴリ（靴下・パンツなど）
export type SubCategory =
  | "TEE"
  | "HOODIE"
  | "SWEATSHIRT"
  | "JACKET"
  | "COAT"
  | "PANTS"
  | "SOCKS"
  | "UNDERWEAR"
  | "CAP"
  | "OTHER";

// Product 型
export type Product = {
  id: string;
  name: string;
  price: number;
  category: Exclude<CategoryFilterId, "ALL">;
  tag?: "New" | "Soon" | "Limited";
  gender: Gender;
  subCategory: SubCategory;
  rating: number; // 0.0〜5.0
  reviewCount: number;
  isPrimeEligible?: boolean;
};

// カテゴリーフィルター
export const CATEGORY_FILTERS: { id: CategoryFilterId; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "TOPS", label: "Tops" },
  { id: "JACKETS", label: "Outer" },
  { id: "PANTS", label: "Bottoms" },
  { id: "ACCESSORIES", label: "Accessories" },
];

// 商品データ（サンプル）
export const PRODUCTS: Product[] = [
  // ---------- TOPS ----------
  {
    id: "era-essential-tee-white",
    name: "ERA Essential Tee / White",
    price: 8800,
    category: "TOPS",
    tag: "New",
    gender: "UNISEX",
    subCategory: "TEE",
    rating: 4.7,
    reviewCount: 32,
    isPrimeEligible: true,
  },
  {
    id: "era-essential-tee-black",
    name: "ERA Essential Tee / Black",
    price: 8800,
    category: "TOPS",
    gender: "UNISEX",
    subCategory: "TEE",
    rating: 4.9,
    reviewCount: 54,
    isPrimeEligible: true,
  },
  {
    id: "era-heavy-hoodie-black",
    name: "ERA Heavy Hoodie / Black",
    price: 19800,
    category: "TOPS",
    tag: "Limited",
    gender: "UNISEX",
    subCategory: "HOODIE",
    rating: 5.0,
    reviewCount: 18,
    isPrimeEligible: true,
  },
  {
    id: "era-crew-sweat-grey",
    name: "ERA Crew Sweat / Grey",
    price: 17600,
    category: "TOPS",
    gender: "UNISEX",
    subCategory: "SWEATSHIRT",
    rating: 4.6,
    reviewCount: 21,
    isPrimeEligible: true,
  },

  // ---------- JACKETS ----------
  {
    id: "era-gabardine-trench-black",
    name: "ERA Gabardine Trench / Black",
    price: 132000,
    category: "JACKETS",
    tag: "Soon",
    gender: "MEN",
    subCategory: "COAT",
    rating: 0,
    reviewCount: 0,
    isPrimeEligible: false,
  },
  {
    id: "era-gabardine-trench-camel",
    name: "ERA Gabardine Trench / Camel",
    price: 132000,
    category: "JACKETS",
    tag: "Soon",
    gender: "WOMEN",
    subCategory: "COAT",
    rating: 0,
    reviewCount: 0,
    isPrimeEligible: false,
  },

  // ---------- PANTS ----------
  {
    id: "era-wide-sweatpant-black",
    name: "ERA Wide Sweatpant / Black",
    price: 19800,
    category: "PANTS",
    gender: "UNISEX",
    subCategory: "PANTS",
    rating: 4.8,
    reviewCount: 27,
    isPrimeEligible: true,
  },
  {
    id: "era-tailored-trouser-black",
    name: "ERA Tailored Trouser / Black",
    price: 27500,
    category: "PANTS",
    gender: "MEN",
    subCategory: "PANTS",
    rating: 4.5,
    reviewCount: 12,
    isPrimeEligible: true,
  },

  // ---------- SOCKS / UNDERWEAR（ここが C のメイン） ----------
  {
    id: "era-logo-socks-black",
    name: "ERA Logo Socks / Black",
    price: 2200,
    category: "ACCESSORIES",
    tag: "New",
    gender: "MEN",
    subCategory: "SOCKS",
    rating: 4.9,
    reviewCount: 41,
    isPrimeEligible: true,
  },
  {
    id: "era-logo-socks-white",
    name: "ERA Logo Socks / White",
    price: 2200,
    category: "ACCESSORIES",
    gender: "WOMEN",
    subCategory: "SOCKS",
    rating: 4.7,
    reviewCount: 23,
    isPrimeEligible: true,
  },
  {
    id: "era-brief-black",
    name: "ERA Essential Brief / Black",
    price: 3300,
    category: "ACCESSORIES",
    tag: "New",
    gender: "MEN",
    subCategory: "UNDERWEAR",
    rating: 4.8,
    reviewCount: 35,
    isPrimeEligible: true,
  },
  {
    id: "era-bikini-brief-sand",
    name: "ERA Bikini Brief / Sand",
    price: 3300,
    category: "ACCESSORIES",
    gender: "WOMEN",
    subCategory: "UNDERWEAR",
    rating: 4.6,
    reviewCount: 19,
    isPrimeEligible: true,
  },

  // ---------- OTHER ACCESSORIES ----------
  {
    id: "era-cap-black-e",
    name: "ERA Cap / Black — E Symbol",
    price: 9900,
    category: "ACCESSORIES",
    gender: "UNISEX",
    subCategory: "CAP",
    rating: 4.9,
    reviewCount: 48,
    isPrimeEligible: true,
  },
  {
    id: "era-leather-belt-black",
    name: "ERA Leather Belt / Black",
    price: 16500,
    category: "ACCESSORIES",
    gender: "MEN",
    subCategory: "OTHER",
    rating: 4.4,
    reviewCount: 9,
    isPrimeEligible: true,
  },
];
