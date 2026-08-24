import type { AllergenKey } from "@/types/menu";

export const allergenLabels: Record<AllergenKey, string> = {
  gluten: "Gluten",
  crustaceans: "Kabuklular",
  eggs: "Yumurta",
  fish: "Balık",
  peanuts: "Yer fıstığı",
  soy: "Soya",
  milk: "Süt",
  nuts: "Sert kabuklu yemişler",
  celery: "Kereviz",
  mustard: "Hardal",
  sesame: "Susam",
  sulphites: "Sülfit",
  lupin: "Acı bakla",
  molluscs: "Yumuşakçalar",
};

export function getAllergenLabel(key: string) {
  return allergenLabels[key as AllergenKey] ?? key;
}
