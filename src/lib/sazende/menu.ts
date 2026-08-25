import type { BusinessMenu, MenuCategory, MenuItem } from "@/types/menu";
import { hamaratBusiness, hamaratCategories } from "./hamarat-seed";
import { getCategoryImage } from "./category-images";
import { seedBusiness, seedCategories, seedItemId } from "./seed";
import { getNutritionInfo } from "./nutrition";
import { supabaseFetch } from "./supabase";

type BusinessRow = {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
};

type CategoryRow = {
  id: string;
  business_id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
};

type ItemRow = {
  id: string;
  business_id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number | null;
  weight: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
  is_available: boolean;
  kcal: number | null;
  kcal_is_estimated: boolean;
  allergens: string[] | null;
  allergen_note: string | null;
  allergen_is_verified: boolean;
};

function mapItem(row: ItemRow): MenuItem {
  return {
    id: row.id,
    businessId: row.business_id,
    categoryId: row.category_id,
    name: row.name,
    description: row.description,
    price: row.price,
    weight: row.weight,
    imageUrl: row.image_url,
    sortOrder: row.sort_order,
    isActive: row.is_active,
    isAvailable: row.is_available,
    kcal: row.kcal,
    kcalIsEstimated: row.kcal_is_estimated,
    allergens: (row.allergens ?? []) as MenuItem["allergens"],
    allergenNote: row.allergen_note,
    allergenIsVerified: row.allergen_is_verified,
  };
}

export async function getMenuBySlug(slug: string): Promise<BusinessMenu | null> {
  const businessParams = new URLSearchParams({
    select: "id,name,slug,subtitle",
    slug: `eq.${slug}`,
    limit: "1",
  });
  const businesses = await supabaseFetch<BusinessRow[]>("businesses", businessParams);
  const business = businesses[0];

  if (!business) {
    return null;
  }

  const categoryParams = new URLSearchParams({
    select: "id,business_id,name,sort_order,is_active",
    business_id: `eq.${business.id}`,
    is_active: "eq.true",
    order: "sort_order.asc,name.asc",
  });

  const itemParams = new URLSearchParams({
    select:
      "id,business_id,category_id,name,description,price,weight,image_url,sort_order,is_active,is_available,kcal,kcal_is_estimated,allergens,allergen_note,allergen_is_verified",
    business_id: `eq.${business.id}`,
    is_active: "eq.true",
    order: "sort_order.asc,name.asc",
  });

  const [categoryRows, itemRows] = await Promise.all([
    supabaseFetch<CategoryRow[]>("menu_categories", categoryParams),
    supabaseFetch<ItemRow[]>("menu_items", itemParams),
  ]);

  const items = itemRows.map(mapItem);
  const categories: MenuCategory[] = categoryRows.map((category) => ({
    id: category.id,
    businessId: category.business_id,
    name: category.name,
    sortOrder: category.sort_order,
    isActive: category.is_active,
    items: items.filter((item) => item.categoryId === category.id),
  }));

  return { business, categories };
}

export function getSeedMenu(slug: string): BusinessMenu | null {
  const seedMenu = {
    [seedBusiness.slug]: {
      business: seedBusiness,
      categories: seedCategories,
    },
    [hamaratBusiness.slug]: {
      business: hamaratBusiness,
      categories: hamaratCategories,
    },
  }[slug];

  if (!seedMenu) {
    return null;
  }

  const categories: MenuCategory[] = seedMenu.categories.map((category, categoryIndex) => {
    const categoryImageUrl =
      category.imageUrl === undefined ? getCategoryImage(category.name) : category.imageUrl;
    const items: MenuItem[] = category.items.map((item, itemIndex) => ({
      ...(() => {
        const nutrition = getNutritionInfo(category.name, item.name);
        return {
          kcal: item.kcal ?? nutrition?.kcal ?? null,
          allergens: item.allergens ?? nutrition?.allergens ?? [],
        };
      })(),
      id: seedItemId(category.id, itemIndex),
      businessId: seedMenu.business.id,
      categoryId: category.id,
      name: item.name,
      description: null,
      price: item.price,
      weight: item.weight ?? null,
      imageUrl: item.imageUrl ?? categoryImageUrl,
      sortOrder: (itemIndex + 1) * 10,
      isActive: item.active !== false,
      isAvailable: true,
      kcalIsEstimated: true,
      allergenNote: item.allergenNote ?? null,
      allergenIsVerified: false,
    }));

    return {
      id: category.id,
      businessId: seedMenu.business.id,
      name: category.name,
      sortOrder: (categoryIndex + 1) * 10,
      isActive: true,
      items: items.filter((item) => item.isActive),
    };
  });

  return {
    business: seedMenu.business,
    categories,
  };
}
