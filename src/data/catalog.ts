export type ProductSlug = "biply-desk" | "biply-glass" | "biply-card" | "biply-pad";
export type PackageSlug = "start" | "business" | "growth" | "pro";
export type UpsellSlug =
  | "extra-glass"
  | "extra-desk"
  | "instagram-card"
  | "extra-card"
  | "second-branch";

export type CatalogItem = {
  id: string;
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  price: number;
  badge?: string;
  shape: "desk" | "glass" | "card" | "pad" | "social";
  features: string[];
  details: string[];
  image: string;
  imageAlt: string;
};

export const products: CatalogItem[] = [
  {
    id: "product-desk",
    slug: "biply-desk",
    name: "Biply Desk",
    eyebrow: "Masa üstü NFC stand",
    description:
      "Kasa, resepsiyon ve masa üstlerinde yorumu tek dokunuşa indiren premium stand.",
    price: 1190,
    shape: "desk",
    features: ["NFC alanı önde", "QR yedek erişim", "Beyaz veya siyah gövde"],
    details: [
      "Kareye yakın premium ön panel",
      "Google yorum bağlantısına hızlı yönlendirme",
      "İşletmenize özel kurulum ve tasarım",
    ],
    image: "/images/product-biply-desk-wood-clean.png",
    imageAlt: "Ahşap tabanlı beyaz Biply Desk masa üstü yorum standı",
  },
  {
    id: "product-glass",
    slug: "biply-glass",
    name: "Biply Glass",
    eyebrow: "Şeffaf cam sticker",
    description:
      "Vitrin, cam kapı ve masa yüzeylerinde şeffaf, minimal ve kalıcı temas noktası.",
    price: 890,
    shape: "glass",
    features: ["Şeffaf akrilik his", "Güçlü yapışkan", "İz bırakmadan sökülebilir"],
    details: [
      "Cam yüzeyle bütünleşen kırık beyaz baskı",
      "NFC dokundurma ikonu büyük ve yönlendirici",
      "QR kod yalnızca alternatif erişim olarak konumlanır",
    ],
    image: "/images/product-biply-glass-white-window.png",
    imageAlt: "Beyaz cam yüzeyde kullanılan Biply Glass NFC etiketi",
  },
  {
    id: "product-card",
    slug: "biply-card",
    name: "Biply Card",
    eyebrow: "El kartı NFC + QR",
    description:
      "Garson, ekip ve saha kullanımı için cepte taşınan hızlı yorum ve takip kartı.",
    price: 590,
    shape: "card",
    features: ["NFC dokundur", "QR ile paylaş", "Ekip kullanımına uygun"],
    details: [
      "Müşteriyle yüz yüze temas anında kullanılır",
      "İnce kart formu sayesinde kolay taşınır",
      "Google yorum veya sosyal medya yönlendirmesi yapılabilir",
    ],
    image: "/images/product-biply-card-white-hand.png",
    imageAlt: "Elde tutulan beyaz Biply Card NFC ve QR kartı",
  },
  {
    id: "product-pad",
    slug: "biply-pad",
    name: "Biply Pad",
    eyebrow: "Kompakt NFC temas pedi",
    description:
      "Tezgah, paket teslimi ve bekleme alanları için küçük ama dikkat çeken temas pedi.",
    price: 790,
    shape: "pad",
    features: ["Kompakt form", "NFC odaklı", "Yoğun alanlara uygun"],
    details: [
      "Az yer kaplayan yuvarlatılmış kare form",
      "Telefonunu dokundur aksiyonunu net gösterir",
      "Paketlere ek temas noktası olarak güçlü tamamlayıcı üründür",
    ],
    image: "/images/product-biply-pad-white-round.png",
    imageAlt: "Tezgah üzerinde yuvarlak beyaz Biply Pad NFC yorum ürünü",
  },
];

export const packages = [
  {
    id: "package-start",
    slug: "start" as const,
    name: "Start",
    price: 1490,
    description: "İlk temas noktasını hızlı kurmak isteyen küçük işletmeler için.",
    includes: ["1 Biply Desk veya Card", "Google yorum NFC kurulumu", "Kolay kurulum desteği"],
  },
  {
    id: "package-business",
    slug: "business" as const,
    name: "Business",
    price: 3490,
    badge: "En Çok Tercih Edilen",
    description: "Masa, cam ve sosyal temasları aynı sistemde toplar.",
    includes: ["Biply Desk + Biply Glass", "Google yorum + Instagram", "Öncelikli destek"],
  },
  {
    id: "package-growth",
    slug: "growth" as const,
    name: "Growth",
    price: 4990,
    description: "Birden çok temas noktasıyla yorum akışını büyütmek için.",
    includes: ["Desk + Glass + Card", "Google + Instagram + WhatsApp", "Çok şubeli yönetime hazır"],
  },
  {
    id: "package-pro",
    slug: "pro" as const,
    name: "Pro",
    price: 0,
    description: "Zincir, otel, klinik ve çok lokasyonlu yapılar için özel teklif.",
    includes: ["Özel ürün kombinasyonu", "Şube bazlı kurulum", "Teklif ve operasyon planı"],
    quoteOnly: true,
  },
];

export const upsells = [
  {
    id: "upsell-glass",
    slug: "extra-glass" as const,
    name: "Ek Biply Glass",
    description: "Cam sticker",
    oldPrice: 990,
    price: 690,
    shape: "glass" as const,
    image: "/images/product-biply-glass-white-window.png",
    imageAlt: "Ek beyaz Biply Glass cam etiketi",
  },
  {
    id: "upsell-desk",
    slug: "extra-desk" as const,
    name: "Ek Biply Desk",
    description: "Masa üstü stand",
    oldPrice: 1190,
    price: 890,
    shape: "desk" as const,
    image: "/images/product-biply-desk-wood-clean.png",
    imageAlt: "Ek ahşap tabanlı Biply Desk masa üstü stand",
  },
  {
    id: "upsell-instagram",
    slug: "instagram-card" as const,
    name: "Instagram takip kartı",
    description: "Sosyal medya odaklı",
    oldPrice: 790,
    price: 590,
    shape: "social" as const,
    image: "/images/product-biply-card-white-hand.png",
    imageAlt: "Sosyal medya yönlendirmesi için beyaz Biply kart",
  },
  {
    id: "upsell-card",
    slug: "extra-card" as const,
    name: "Ek beyaz Biply Card",
    description: "NFC + QR kart",
    oldPrice: 590,
    price: 390,
    shape: "card" as const,
    image: "/images/product-biply-card-white-hand.png",
    imageAlt: "Ek beyaz Biply Card",
  },
  {
    id: "upsell-branch",
    slug: "second-branch" as const,
    name: "İkinci şube kurulumu",
    description: "Aynı yönetim paneli",
    oldPrice: 990,
    price: 690,
    shape: "pad" as const,
    image: "/images/product-biply-pad-white-round.png",
    imageAlt: "İkinci şube kurulumu için beyaz Biply temas ürünü",
  },
];

export const testimonials = [
  {
    name: "Ece Y.",
    role: "Kafe işletmecisi",
    sector: "Kafe",
    quote:
      "Masaya koyduğumuz ilk hafta müşterilerimiz yoruma nasıl ulaşacağını sormadan aksiyona geçti. Görüntüsü de mekânın diline yakıştı.",
  },
  {
    name: "Burak A.",
    role: "Gym kurucusu",
    sector: "Gym",
    quote:
      "Girişteki cam etiketi üyeler için çok doğal bir temas noktası oldu. Ekip link anlatmak yerine sadece dokundurma alanını gösteriyor.",
  },
  {
    name: "Mert K.",
    role: "Boks salonu yöneticisi",
    sector: "Boks",
    quote:
      "Antrenman sonrası memnun kalan üyeye kart göstermek yeterli oluyor. Hızlı, sade ve salonun premium hissini bozmuyor.",
  },
  {
    name: "Selin D.",
    role: "Emlak danışmanı",
    sector: "Emlak",
    quote:
      "Portföy görüşmelerinden sonra müşteriyi doğru sayfaya yönlendirmek kolaylaştı. Kart ve masa standı birlikte daha güvenli hissettiriyor.",
  },
];

export const sectors = [
  "Kafe & restoran",
  "Klinik & güzellik",
  "Otel & konaklama",
  "Mağaza & showroom",
  "Servis & teknik ekip",
  "Eğitim & stüdyo",
];

export const faqs = [
  {
    question: "Biply ne yapar?",
    answer:
      "Müşterinizin Google yorum, sosyal medya veya WhatsApp gibi aksiyonlara NFC dokundurma ya da QR tarama ile ulaşmasını sağlar.",
  },
  {
    question: "Google yorumlarında teşvik var mı?",
    answer:
      "Hayır. Biply nötr yönlendirme dili kullanır: deneyimi paylaşmaya davet eder, belirli puan veya olumlu yorum istemez.",
  },
  {
    question: "Ödeme altyapısı hazır mı?",
    answer:
      "Bu V1 sürümünde checkout mock çalışır; sipariş özeti WhatsApp üzerinden hızlı teklif ve kurulum akışına gönderilir.",
  },
  {
    question: "Tasarım işletmeye özel mi?",
    answer:
      "Evet. Ürün üzerindeki bağlantılar, QR ve temel metinler işletmenize göre hazırlanır.",
  },
];
