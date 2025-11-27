// app/lib/products-data.ts

export type CategoryFilterId =
  | "ALL"
  | "TOPS"
  | "JACKETS"
  | "PANTS"
  | "ACCESSORIES";

export type Product = {
  id: string;
  name: string;
  price: number;
  description: string;
  category: "TOPS" | "JACKETS" | "PANTS" | "ACCESSORIES";
  material?: string;
  fit?: string;
  care?: string;
  tag?: string;
  sizes?: string[]; // ★ 追加：サイズ展開
};

export const CATEGORY_FILTERS: { id: CategoryFilterId; label: string }[] = [
  { id: "ALL", label: "All" },
  { id: "TOPS", label: "Tops" },
  { id: "JACKETS", label: "Jackets" },
  { id: "PANTS", label: "Pants" },
  { id: "ACCESSORIES", label: "Accessories" },
];

export const PRODUCTS: Product[] = [
  {
    id: "tee-essential-white",
    name: "ERA Essential Tee / White",
    price: 8800,
    description: "Minimal ERA tee with a clean neck and balanced silhouette.",
    category: "TOPS",
    material: "100% Cotton",
    fit: "Slightly relaxed",
    care: "Machine wash cold, hang dry",
    tag: "Core",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "tee-essential-black",
    name: "ERA Essential Tee / Black",
    price: 8800,
    description: "Black core tee built on ERA proportions.",
    category: "TOPS",
    material: "100% Cotton",
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "wide-sweatpants-black",
    name: "ERA Wide Sweatpants / Black",
    price: 14300,
    description: "Heavyweight wide sweatpants with quiet branding.",
    category: "PANTS",
    material: "Cotton blend",
    fit: "Wide, relaxed",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "trench-gabardine-black",
    name: "ERA Trench Coat / Gabardine Black",
    price: 82500,
    description: "Long trench coat in cotton gabardine, built for quiet presence.",
    category: "JACKETS",
    material: "Cotton gabardine",
    fit: "Tailored over an ERA hoodie",
    sizes: ["S", "M", "L"],
  },
  {
    id: "cap-black",
    name: "ERA Cap / Black",
    price: 6600,
    description: "Minimal cap with ERA three-line emblem.",
    category: "ACCESSORIES",
    sizes: ["ONE SIZE"],
  },
];
