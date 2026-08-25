export type AllergenKey =
  | "gluten"
  | "crustaceans"
  | "eggs"
  | "fish"
  | "peanuts"
  | "soy"
  | "milk"
  | "nuts"
  | "celery"
  | "mustard"
  | "sesame"
  | "sulphites"
  | "lupin"
  | "molluscs";

export type MenuItem = {
  id: string;
  businessId: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: number | null;
  weight: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  isAvailable: boolean;
  kcal: number | null;
  kcalIsEstimated: boolean;
  allergens: AllergenKey[];
  allergenNote: string | null;
  allergenIsVerified: boolean;
};

export type MenuCategory = {
  id: string;
  businessId: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
  items: MenuItem[];
};

export type BusinessMenu = {
  business: {
    id: string;
    name: string;
    slug: string;
    subtitle: string;
    shareImageUrl?: string | null;
    faviconUrl?: string | null;
  };
  categories: MenuCategory[];
};

export type BusinessSummary = BusinessMenu["business"];
