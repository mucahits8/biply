import type { AllergenKey } from "@/types/menu";

export type SeedCategory = {
  id: string;
  name: string;
  imageUrl?: string | null;
  items: Array<{
    name: string;
    price: number | null;
    weight?: string;
    imageUrl?: string | null;
    kcal?: number | null;
    allergens?: AllergenKey[];
    allergenNote?: string | null;
    active?: boolean;
  }>;
};

export const seedBusiness = {
  id: "biz_sazende",
  name: "Şazende",
  slug: "sazende",
  subtitle: "Paça · İşkembe · Kebap",
};

export const seedCategories: SeedCategory[] = [
  {
    id: "cat_corbalar",
    name: "Çorbalar",
    items: [
      { name: "Kellepaça", price: 350, imageUrl: "/images/sazende-kelle-paca-yeni.jpg" },
      { name: "İşkembe (Kazan)", price: 250, imageUrl: "/images/sazende-iskembe-damar-dana-ayak.jpg" },
      { name: "Tuzlama", price: 280, imageUrl: "/images/sazende-tuzlama.jpg" },
      { name: "Damar Tuzlama", price: 250, imageUrl: "/images/sazende-iskembe-damar-dana-ayak.jpg" },
      { name: "Dana Ayak Paça Kemiksiz", price: 280, imageUrl: "/images/sazende-ayak-paca.jpg" },
      { name: "Kuzu Ayak Paça Kemikli", price: null, active: false },
      { name: "Antep Usulü Beyran", price: 350, imageUrl: "/images/sazende-beyran.jpg" },
      { name: "Şazende Karışık Special", price: 400 },
      { name: "Beyin Söğüş", price: null, active: false },
      { name: "Yarım Tandır Kelle", price: null, active: false },
      { name: "Tam Tandır Kelle", price: null, active: false },
      { name: "Dil Söğüş", price: null, active: false },
      { name: "Çürük", price: null, active: false },
      { name: "Dil Paça", price: 350, imageUrl: "/images/sazende-dil-paca.jpg" },
      { name: "Munbar Dolması", price: 350, imageUrl: "/images/sazende-munbar-dolmasi.jpg" },
      { name: "Tavuk Suyu", price: 120, imageUrl: "/images/sazende-tavuk-suyu.jpg" },
      { name: "Mercimek", price: 100, imageUrl: "/images/sazende-mercimek.jpg" },
      { name: "Tereyağlı Mercimek", price: 120, imageUrl: "/images/sazende-tereyagli-mercimek-yeni.jpg" },
      { name: "Ezogelin", price: 100, imageUrl: "/images/sazende-ezogelin.jpg" },
    ],
  },
  {
    id: "cat_sulu_yemekler",
    name: "Sulu Yemekler",
    items: [
      { name: "Kuru Fasülye", price: 200, imageUrl: "/images/sazende-kuru-fasulye.jpg" },
      { name: "Taze Fasülye", price: 200, imageUrl: "/images/sazende-taze-fasulye.jpg" },
      { name: "Patlıcan Musakka", price: 250, imageUrl: "/images/sazende-patlican-musakka.jpg" },
      { name: "Karnıyarık", price: 250, imageUrl: "/images/sazende-karniyarik.jpg" },
      { name: "İzmir Köfte", price: 280, imageUrl: "/images/sazende-izmir-kofte.jpg" },
      { name: "Arnavut Ciğeri", price: 330, imageUrl: "/images/sazende-arnavut-cigeri.jpg" },
      { name: "Tas Kebabı", price: 350, imageUrl: "/images/sazende-tas-kebabi.jpg" },
      { name: "Fırın Köfte", price: 290, imageUrl: "/images/sazende-firin-kofte.jpg" },
      { name: "Çoban Kavurma", price: 390, imageUrl: "/images/sazende-coban-kavurma.jpg" },
      { name: "Tavuk Sote", price: 250, imageUrl: "/images/sazende-tavuk-sote.jpg" },
      { name: "Tavuk Haşlama", price: 250 },
      { name: "Ispanak", price: 200, imageUrl: "/images/sazende-ispanak.jpg" },
      { name: "Karnabahar", price: 200, imageUrl: "/images/sazende-karnabahar.jpg" },
      { name: "Pırasa", price: 200, imageUrl: "/images/sazende-pirasa.jpg" },
      { name: "Pirinç Pilavı", price: 100, imageUrl: "/images/sazende-pirinc-pilavi.jpg" },
      { name: "Bulgur Pilavı", price: 100, imageUrl: "/images/sazende-bulgur-pilavi.jpg" },
    ],
  },
  {
    id: "cat_izgaralar",
    name: "Izgaralar",
    items: [
      { name: "Adana", price: 480, imageUrl: "/images/sazende-adana-porsiyon.jpg" },
      { name: "Urfa", price: 480, imageUrl: "/images/sazende-urfa-porsiyon.jpg" },
      { name: "Tavuk Şiş", price: 380, imageUrl: "/images/sazende-tavuk-sis.jpg" },
      { name: "Kanat", price: 380, imageUrl: "/images/sazende-tavuk-kanat.jpg" },
      { name: "Et Şiş", price: null, active: false },
      { name: "Karışık Izgara", price: 1200, imageUrl: "/images/sazende-karisik-izgara.jpg" },
    ],
  },
  {
    id: "cat_durumler",
    name: "Dürümler",
    items: [
      { name: "Adana Dürüm", price: 300, imageUrl: "/images/sazende-adana-durum.jpg" },
      { name: "Urfa Dürüm", price: 300, imageUrl: "/images/sazende-urfa.jpg" },
      { name: "Ciğer Şiş Dürüm", price: null, active: false },
      { name: "Tavuk Şiş Dürüm", price: 200, imageUrl: "/images/sazende-tavuk-sis-durum.jpg" },
      { name: "Et Şiş Dürüm", price: null, active: false },
      { name: "Köfte Dürüm", price: 300, imageUrl: "/images/sazende-kofte-durum.jpg" },
    ],
  },
  {
    id: "cat_et_donerler",
    name: "Et Dönerler",
    items: [
      { name: "Yarım Ekmek Et Döner", weight: "70 gr", price: 300, imageUrl: "/images/sazende-et-doner-yarim-ekmek.jpg" },
      { name: "Tombik Et Döner", weight: "70 gr", price: 300, imageUrl: "/images/sazende-tombik-et-doner.jpg" },
      { name: "Porsiyon Et Döner", weight: "110 gr", price: 430, imageUrl: "/images/sazende-et-doner-porsiyon-pilavustu.jpg" },
      { name: "Pilavüstü Et Döner", price: 450, imageUrl: "/images/sazende-et-doner-porsiyon-pilavustu.jpg" },
      { name: "Dürüm Et Döner", weight: "90 gr", price: 330 },
      { name: "3 Çeyrek Et Döner", weight: "90 gr", price: 380, imageUrl: "/images/sazende-et-doner-3-ceyrek.jpg" },
      { name: "Beyti", weight: "180 gr", price: 550, imageUrl: "/images/sazende-beyti.jpg" },
      { name: "Tereyağlı İskender", price: 500, imageUrl: "/images/sazende-tereyagli-iskender.jpg" },
      { name: "Tam Ekmek Et Döner", weight: "110 gr", price: 430, imageUrl: "/images/sazende-tam-ekmek-et-doner.jpg" },
    ],
  },
  {
    id: "cat_tavuk_donerler",
    name: "Tavuk Dönerler",
    items: [
      { name: "Yarım Ekmek", weight: "70 gr", price: 100, imageUrl: "/images/sazende-yarim-ekmek-tavuk-doner.jpg" },
      { name: "Tombik", weight: "70 gr", price: 100, imageUrl: "/images/sazende-tombik-tavuk-doner.jpg" },
      { name: "Porsiyon", weight: "120 gr", price: 200, imageUrl: "/images/sazende-tavuk-doner-porsiyon-pilavustu.jpg" },
      { name: "Pilavüstü", weight: "120 gr", price: 250, imageUrl: "/images/sazende-tavuk-doner-porsiyon-pilavustu.jpg" },
      { name: "Dürüm", weight: "90 gr", price: 150 },
      { name: "3 Çeyrek", weight: "90 gr", price: 150, imageUrl: "/images/sazende-tavuk-doner-3-ceyrek.jpg" },
      { name: "Bütün Ekmek", weight: "120 gr", price: 200, imageUrl: "/images/sazende-tam-ekmek-tavuk-doner.jpg" },
    ],
  },
  {
    id: "cat_firinlar",
    name: "Fırınlar",
    items: [
      { name: "Lahmacun", price: 130, imageUrl: "/images/sazende-lahmacun.jpg" },
      { name: "Kaşarlı Lahmacun", price: 180, imageUrl: "/images/sazende-kasarli-lahmacun.jpg" },
      { name: "Fındık Lahmacun", price: 90, imageUrl: "/images/sazende-findik-lahmacun.jpg" },
      { name: "B. Boy Kaşarlı Pide", price: 270, imageUrl: "/images/sazende-kasarli-kusbasili-pide.jpg" },
      { name: "B. Boy Kıymalı Pide", price: 350, imageUrl: "/images/sazende-kiymali-pide.jpg" },
      { name: "Sucuklu Pide", price: 350, imageUrl: "/images/sazende-sucuklu-pide.jpg" },
      { name: "Sucuklu Kaşarlı Pide", price: 400, imageUrl: "/images/sazende-sucuklu-kasarli-pide.jpg" },
      { name: "Kuşbaşılı Pide", price: 350, imageUrl: "/images/sazende-kusbasili-pide.jpg" },
      { name: "Kavurmalı Pide", price: 400, imageUrl: "/images/sazende-kavurmali-kasarli-pide.jpg" },
      { name: "Karışık Pide", price: 400, imageUrl: "/images/sazende-karisik-pide.jpg" },
      { name: "Şazende Pizza", price: 450 },
    ],
  },
  {
    id: "cat_salatalar",
    name: "Salatalar",
    items: [
      { name: "Çoban Salata", price: 150, imageUrl: "/images/sazende-coban-salata.jpg" },
      { name: "Cacık", price: 100, imageUrl: "/images/sazende-cacik.jpg" },
      { name: "Ezme", price: 150, imageUrl: "/images/sazende-ezme.jpg" },
      { name: "Yoğurt", price: 100, imageUrl: "/images/sazende-yogurt.jpg" },
      { name: "Roka Salatası", price: 120, imageUrl: "/images/sazende-roka-salatasi.jpg" },
      { name: "Roka", price: 50, imageUrl: "/images/sazende-roka-salatasi.jpg" },
      { name: "Mevsim Salata", price: 120, imageUrl: "/images/sazende-mevsim-salata.jpg" },
      { name: "Haydari", price: 100, imageUrl: "/images/sazende-haydari.jpg" },
      { name: "Adana Salatası", price: 120, imageUrl: "/images/sazende-adana-salatasi.jpg" },
    ],
  },
  {
    id: "cat_tatlilar",
    name: "Tatlılar",
    items: [
      { name: "Sütlaç", price: 150, imageUrl: "/images/sazende-sutlac.jpg" },
      { name: "Künefe", price: 250, imageUrl: "/images/sazende-kunefe.jpg" },
      { name: "Kemalpaşa", price: 150, imageUrl: "/images/sazende-kemalpasa.jpg" },
      { name: "Zerde", price: null, active: false },
    ],
  },
  {
    id: "cat_icecekler",
    name: "İçecekler",
    items: [
      { name: "Su", price: 20, imageUrl: "/images/sazende-su.jpg" },
      { name: "Soda", price: 50, imageUrl: "/images/sazende-soda.jpg" },
      { name: "Şalgam", price: 50, imageUrl: "/images/sazende-salgam.jpg" },
      { name: "Küçük Ayran", price: 30, imageUrl: "/images/sazende-kucuk-ayran.jpg" },
      { name: "Büyük Ayran", price: 50, imageUrl: "/images/sazende-buyuk-ayran.jpg" },
      { name: "Sarıyer Kola Litrelik", price: 100, imageUrl: "/images/sazende-litrelik-sariyer.jpg" },
      { name: "Kutu Sarıyer", price: 70, imageUrl: "/images/sazende-kutu-sariyer.jpg" },
    ],
  },
];

export function seedItemId(categoryId: string, itemIndex: number) {
  return `${categoryId}_item_${String(itemIndex + 1).padStart(2, "0")}`;
}
