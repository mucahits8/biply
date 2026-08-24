const categoryImageMap: Record<string, string> = {
  "Çorbalar": "/category-soups.jpg",
  "Sulu Yemekler": "/category-stews.webp",
  "Dürümler": "/category-wraps.jpeg",
  "Et Dönerler": "/category-wraps.jpeg",
  "Tavuk Dönerler": "/category-wraps.jpeg",
  "Fırınlar": "/category-oven.jpeg",
  "Salatalar": "/category-salads.jpg",
  "İçecekler": "/category-drinks.jpg",
};

export function getCategoryImage(categoryName: string) {
  return categoryImageMap[categoryName] ?? "/menu-default.png";
}
