export type ProductSlug =
  | "biply-stand"
  | "biply-square"
  | "biply-personal-square"
  | "biply-round"
  | "biply-personal-mini";
export type ProductShape = "stand" | "square" | "personal-square" | "round" | "personal-mini";

export type CatalogItem = {
  id: string;
  slug: ProductSlug;
  name: string;
  eyebrow: string;
  subtitle: string;
  description: string;
  price: number;
  oldPrice: number;
  shopierUrl?: string;
  badge: string;
  saleBadge: string;
  shape: ProductShape;
  size: string;
  form: string;
  mounting: string;
  idealQuantity: string;
  hierarchy: string;
  cta: string;
  features: string[];
  details: string[];
  useCases: string[];
  detailStory: {
    headline: string;
    body: string;
    proof: string;
    bestFor: string;
  };
  salesMoments: {
    title: string;
    body: string;
  }[];
  customerReactions: {
    persona: string;
    moment: string;
    quote: string;
    signal: string;
  }[];
  reviewExamples: {
    name: string;
    sector: string;
    quote: string;
  }[];
  closingPitch: {
    title: string;
    body: string;
  };
  image: string;
  imageAlt: string;
  gallery: string[];
};

export type BundlePreset = {
  id: string;
  name: string;
  eyebrow: string;
  description: string;
  badge?: string;
  quantities: Record<ProductSlug, number>;
};

export type Promotion = {
  id: string;
  name: string;
  description: string;
  badge: string;
  productSlug: ProductSlug;
  quantity: number;
  image: string;
  imageAlt: string;
};

export type CustomCampaignExample = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
};

export const products: CatalogItem[] = [
  {
    id: "product-stand",
    slug: "biply-stand",
    name: "Stand",
    eyebrow: "Premium NFC Yorum Standı",
    subtitle: "Tek kritik nokta",
    description:
      "İşletmenizin en önemli temas noktasında müşterilerinizi tek dokunuşla Google yorumlarına yönlendirin.",
    price: 2000,
    oldPrice: 2600,
    shopierUrl: "https://www.shopier.com/biply/49453066",
    badge: "PREMIUM",
    saleBadge: "Lansmana özel 600 TL avantaj",
    shape: "stand",
    size: "110 x 160 mm",
    form: "Masaüstü, ayaklı",
    mounting: "Tezgah veya resepsiyona konumlanır",
    idealQuantity: "1-3",
    hierarchy: "Resepsiyonunuz veya kasanız için.",
    cta: "Sepete Ekle",
    features: ["NFC", "Beyaz premium gövde", "QR yok", "Tek dokunuşla Google yorum ekranı"],
    details: [
      "Otel, klinik, restoran, mağaza ve servis resepsiyonlarında premium görünürlük sağlar.",
      "Müşterinin karar anında gördüğü net ve fiziksel bir yorum çağrısıdır.",
      "Önemli tek temas noktasını temiz, kurumsal ve kalıcı bir yorum alanına çevirir.",
    ],
    useCases: [
      "Otel resepsiyonu",
      "Klinik resepsiyonu",
      "Restoran/kafe kasası",
      "Güzellik merkezi",
      "Spor salonu danışması",
      "Mağaza kasası",
      "Veteriner kliniği",
      "Oto servis",
      "Ofis resepsiyonu",
    ],
    detailStory: {
      headline: "İşletmenin en görünür noktasını yorum toplama alanına çevirir.",
      body:
        "Stand, müşterinin ödeme, kayıt, çıkış veya teslim alma anında karşısına çıkan premium temas noktasıdır. Ekip yorum istemek için uzun açıklama yapmak zorunda kalmaz; ürün zaten ne yapılacağını sessizce anlatır.",
      proof: "Tek noktada güçlü görünürlük",
      bestFor: "Resepsiyon, kasa, danışma ve karşılama alanları",
    },
    salesMoments: [
      {
        title: "Çıkış anında görünür",
        body: "Memnun müşteri ayrılmadan önce standı görür. Yorum istemek doğal bir kapanış hareketine dönüşür.",
      },
      {
        title: "Premium algıyı bozmadan çalışır",
        body: "Beyaz gövde ve masaüstü form, otel, klinik ve mağaza gibi şık alanlarda promosyon gibi değil kurumsal bir araç gibi durur.",
      },
      {
        title: "Ekibin yükünü azaltır",
        body: "Personel 'Google'a yorum bırakır mısınız?' demek yerine sadece standı işaret eder. Süreç daha kısa ve daha konforlu olur.",
      },
    ],
    customerReactions: [
      {
        persona: "Otel misafiri",
        moment: "Check-out sırasında",
        quote: "Bu kadar kolay mıydı? Telefonu yaklaştırınca direkt yorum ekranı açıldı.",
        signal: "Resepsiyonda doğal kapanış",
      },
      {
        persona: "Klinik danışanı",
        moment: "Randevu sonrası çıkarken",
        quote: "Beklemeden açıldı, iki dakikada yorumumu yazdım.",
        signal: "Hız hissi",
      },
      {
        persona: "Mağaza müşterisi",
        moment: "Ödeme bittikten sonra",
        quote: "Kasada görünce unutmadan değerlendirme yaptım.",
        signal: "Hatırlatma etkisi",
      },
    ],
    reviewExamples: [
      {
        name: "Ayşe K.",
        sector: "Klinik",
        quote: "Randevu süreci çok düzenliydi, çıkışta kolayca yorum bırakabildim. Teşekkürler.",
      },
      {
        name: "Burak S.",
        sector: "Otel",
        quote: "Resepsiyon ekibi çok ilgiliydi. Konaklama sonrası yorum ekranı hemen açıldı, deneyimimi paylaşmak kolay oldu.",
      },
      {
        name: "Deniz A.",
        sector: "Mağaza",
        quote: "Ürün seçimi ve ödeme süreci hızlıydı. Mağazadan ayrılmadan değerlendirme yapabildim.",
      },
    ],
    closingPitch: {
      title: "Tek kritik noktaya koy, yorum akışını başlat.",
      body:
        "Bir işletmede bazen en değerli yer sadece bir noktadır: resepsiyon, kasa ya da danışma. Stand o noktayı daha görünür, daha profesyonel ve daha ölçülebilir hale getirir.",
    },
    image: "/media/biply-stand-product.jpeg",
    imageAlt: "Beyaz Stand premium NFC Google yorum standı",
    gallery: [
      "/media/biply-stand-product.jpeg",
      "/media/biply-stand-hero.png",
      "/media/biply-stand-hotel-lobby.png",
      "/media/biply-stand-hotel.png",
      "/media/biply-stand-dental-clinic.png",
      "/media/biply-stand-veterinary.png",
      "/media/biply-stand-auto-service.png",
      "/media/biply-stand-retail-counter.png",
      "/media/biply-stand-retail-pos.png",
    ],
  },
  {
    id: "product-square",
    slug: "biply-square",
    name: "Kare",
    eyebrow: "NFC Yorum Etiketi",
    subtitle: "Birden fazla temas noktası",
    description: "Yapıştır. Dokundur. Yorumunu al.",
    price: 1250,
    oldPrice: 1650,
    shopierUrl: "https://www.shopier.com/biply/49453089",
    badge: "EN COK TERCIH EDILEN",
    saleBadge: "Lansmana özel 400 TL avantaj",
    shape: "square",
    size: "100 x 100 mm",
    form: "Yuvarlatılmış kare",
    mounting: "Yapışkanlı",
    idealQuantity: "2-10",
    hierarchy: "Masa, cam ve bankolar için.",
    cta: "Sepete Ekle",
    features: ["NFC", "Yapışkanlı kullanım", "QR yok", "Çok yönlü temas noktası"],
    details: [
      "İşletme içinde birden fazla noktaya yerleştirilerek yorum alma olasılığını artırır.",
      "Masa, cam, ayna, banko ve bekleme alanlarında sade ve görünür kalır.",
      "Ana satış ürünü olarak hem tekil hem adetli kullanım için dengeli seçimdir.",
    ],
    useCases: [
      "Restoran masaları",
      "Kafe masaları",
      "Resepsiyon",
      "Kasa",
      "Kuaför aynası",
      "Cam yüzey",
      "Klinik",
      "Mağaza",
      "Paket teslim noktası",
      "Bekleme alanları",
    ],
    detailStory: {
      headline: "Müşterinin doğal temas ettiği yüzeylerde yorum çağrısı oluşturur.",
      body:
        "Kare, tek bir noktaya bağlı kalmak istemeyen işletmeler için tasarlandı. Masaya, aynaya, cama veya bankoya yerleşir; müşteri hizmeti deneyimlediği yerde telefonunu yaklaştırır ve yorum ekranına geçer.",
      proof: "Birden fazla temas noktasında daha fazla fırsat",
      bestFor: "Masa, cam, ayna, banko, bekleme alanı",
    },
    salesMoments: [
      {
        title: "Müşteri beklerken çalışır",
        body: "Sipariş, işlem veya randevu beklerken yorum bırakma çağrısı göz hizasında kalır. Boş bekleme süresi değerlendirmeye dönüşür.",
      },
      {
        title: "Bir alanla sınırlı kalmaz",
        body: "Kare'yi kasaya, masaya ve cama dağıtarak müşteriye birden fazla doğal dokunma noktası sunarsın.",
      },
      {
        title: "Görünür ama rahatsız etmez",
        body: "100 x 100 mm form, mesajı net verir; alanı domine etmeden masaya veya yüzeye yerleşir.",
      },
    ],
    customerReactions: [
      {
        persona: "Kafe müşterisi",
        moment: "Kahvesini beklerken",
        quote: "Masadaki etikete dokundum, yorum ekranı hemen açıldı. QR aramak yok.",
        signal: "Bekleme anını değerlendirir",
      },
      {
        persona: "Güzellik merkezi müşterisi",
        moment: "Ayna karşısında işlem sonrası",
        quote: "Aynanın yanında görünce hizmetten memnunken yorumumu yazdım.",
        signal: "Hizmet sonrası hatırlatma",
      },
      {
        persona: "Showroom ziyaretçisi",
        moment: "Danışmanlık sonrası",
        quote: "Çıkmadan değerlendirme bırakmak çok pratikti.",
        signal: "Çok yönlü temas",
      },
    ],
    reviewExamples: [
      {
        name: "Melis T.",
        sector: "Kafe",
        quote: "Kahve ve servis çok iyiydi. Masadaki Biply sayesinde yorum bırakmak da çok kolay oldu.",
      },
      {
        name: "Seda B.",
        sector: "Güzellik",
        quote: "İşlemden çok memnun kaldım. Aynanın yanındaki etiketle direkt değerlendirme ekranı açıldı.",
      },
      {
        name: "Emre Y.",
        sector: "Showroom",
        quote: "Danışmanlık süreci açıklayıcıydı. Çıkışta hızlıca yorumumu paylaşabildim.",
      },
    ],
    closingPitch: {
      title: "Tek yer değil, tüm temas noktaları yorum toplasın.",
      body:
        "Kare, müşterinin işletme içinde dolaştığı akışa uyum sağlar. Birkaç noktaya yerleştirildiğinde yorum isteme işi personele bağlı kalmaz.",
    },
    image: "/media/biply-square-product-front.png",
    imageAlt: "Kare NFC Google yorum etiketi ürün görseli",
    gallery: [
      "/media/biply-square-product-front.png",
      "/media/biply-square-cafe.png",
      "/media/biply-square-office-door.png",
      "/media/biply-square-salon-mirror.png",
      "/media/biply-square-cafe-moment.png",
      "/media/biply-square-hotel-room.png",
      "/media/biply-square-fine-dining.png",
    ],
  },
  {
    id: "product-personal-square",
    slug: "biply-personal-square",
    name: "Kişiselleştirilmiş Kare",
    eyebrow: "Sabit Şablon Kişiselleştirilmiş Kare",
    subtitle: "Yazısı sana özel / Kare form",
    description: "Kare formda sabit Biply kampanya şablonu. İşletme mesajını söyler, ürün Biply çizgisinde hazırlanır.",
    price: 1350,
    oldPrice: 1750,
    badge: "KİŞİSELLEŞTİRİLMİŞ",
    saleBadge: "Lansmana özel 400 TL avantaj",
    shape: "personal-square",
    size: "100 x 100 mm",
    form: "Yuvarlatılmış kare",
    mounting: "Yapışkanlı",
    idealQuantity: "2-10",
    hierarchy: "Kampanya mesajı olan yüzeyler için.",
    cta: "Sepete Ekle",
    features: ["NFC", "Sabit Biply şablonu", "Kampanya metni özelleşir", "QR yok"],
    details: [
      "Standart Kare'nin görünürlüğünü kampanya mesajıyla birleştirir.",
      "Ürün tasarımı sabit Biply şablonunda kalır; üstteki teklif metni işletmeye göre hazırlanır.",
      "Masa, cam, banko ve bar gibi daha geniş yüzeylerde kampanya çağrısını net gösterir.",
    ],
    useCases: [
      "Kafe masaları",
      "Restoran masaları",
      "Bar",
      "Pastane",
      "Kasa",
      "Banko",
      "Cam yüzey",
      "Bekleme alanları",
    ],
    detailStory: {
      headline: "Kare görünürlüğünü kampanya mesajıyla daha satış odaklı hale getirir.",
      body:
        "Kişiselleştirilmiş Kare, 100 x 100 mm alanda daha büyük ve net bir kampanya çağrısı isteyen işletmeler için hazırlandı. Mesaj işletmeye göre değişir; ikon yerleşimi, Biply markası ve NFC akışı sabit kalır.",
      proof: "Daha geniş alanda sabit şablonlu kampanya mesajı",
      bestFor: "Kafe, restoran, bar, pastane, cam ve banko yüzeyleri",
    },
    salesMoments: [
      {
        title: "Mesajı uzaktan daha rahat gösterir",
        body: "Kare yüzey, 'Kahven bizden' veya 'İçeceğin bizden' gibi kampanya metinlerini Mini'ye göre daha geniş alanda taşır.",
      },
      {
        title: "Kampanya ayrı ürün gibi netleşir",
        body: "Standart Kare ile karışmaz. Müşteri normal yorum etiketi veya kişiselleştirilmiş kare arasında bilinçli seçim yapar.",
      },
      {
        title: "Sabit şablon üretimi hızlandırır",
        body: "Ürün Biply tasarım sistemi içinde kalır; sadece metin, ikon ve kısa not alanı siparişe göre düzenlenir.",
      },
    ],
    customerReactions: [
      {
        persona: "Kafe müşterisi",
        moment: "Kahvesini beklerken",
        quote: "Kahven bizden yazısını görünce yorum bırakmak daha cazip geldi.",
        signal: "Güçlü kampanya görünürlüğü",
      },
      {
        persona: "Bar misafiri",
        moment: "Servis sonrası",
        quote: "Biranız bizden mesajı masada direkt dikkat çekti.",
        signal: "Net teklif algısı",
      },
      {
        persona: "Pastane müşterisi",
        moment: "Sipariş sonrası",
        quote: "Çereziniz bizden yazısını görünce telefonu yaklaştırdım.",
        signal: "Hızlı aksiyon",
      },
    ],
    reviewExamples: [
      {
        name: "Eylül A.",
        sector: "Kafe",
        quote: "Kahvem çok iyiydi. Masadaki kişiselleştirilmiş Kare ile yorum bırakmak çok kolay oldu.",
      },
      {
        name: "Kerem D.",
        sector: "Bar",
        quote: "Servis hızlıydı, ortam keyifliydi. Yorum ekranı tek dokunuşla açıldı.",
      },
      {
        name: "Mina S.",
        sector: "Pastane",
        quote: "Tatlı ve kahve çok güzeldi. Kampanya mesajı sayesinde yorum bırakmayı unutmadım.",
      },
    ],
    closingPitch: {
      title: "Kampanya metnini büyüt, yorum çağrısını görünür kıl.",
      body:
        "Kişiselleştirilmiş Kare, özel tasarım karmaşası yaratmadan kampanya mesajınızı netleştirir. Sabit Biply şablonu sayesinde ürün temiz, hızlı ve tutarlı görünür.",
    },
    image: "/media/biply-personal-square-front.png",
    imageAlt: "Kişiselleştirilmiş Kare NFC yorum ürünü kampanya tasarımı",
    gallery: [
      "/media/biply-personal-square-front.png",
      "/media/biply-personal-square-coffee-nfc.png",
      "/media/biply-personal-square-coffee-counter.png",
      "/media/biply-personal-square-cookie-table.png",
      "/media/biply-personal-square-beer-bar.png",
    ],
  },
  {
    id: "product-round",
    slug: "biply-round",
    name: "Mini",
    eyebrow: "Kompakt NFC Yorum Etiketi",
    subtitle: "Çok sayıda masa / kompakt kullanım",
    description: "Küçük alanlarda maksimum görünürlük.",
    price: 750,
    oldPrice: 950,
    shopierUrl: "https://www.shopier.com/biply/49453111",
    badge: "KOMPAKT",
    saleBadge: "Lansmana özel 200 TL avantaj",
    shape: "round",
    size: "Çap 70 mm",
    form: "Yuvarlak",
    mounting: "Yapışkanlı",
    idealQuantity: "5+",
    hierarchy: "Her masaya bir Biply.",
    cta: "Sepete Ekle",
    features: ["NFC", "Kompakt yuvarlak form", "QR yok", "Adetli satışa uygun"],
    details: [
      "Küçük yüzeylerde ve çok sayıda müşteri temas noktasında görünür kalır.",
      "Restoran, kafe, bar ve pastane gibi masa yoğun işletmeler için güçlü giriş ürünüdür.",
      "10+ alımda birim fiyatı aşağı çeken çoklu alım avantajı ile ölçeklenir.",
    ],
    useCases: [
      "Restoran masası",
      "Kafe masası",
      "Bar",
      "Pastane",
      "Kasa",
      "Tezgah",
      "Paket teslim alanı",
      "Bekleme alanları",
    ],
    detailStory: {
      headline: "Her masayı sessiz bir yorum davetine dönüştürür.",
      body:
        "Mini, adetli kullanım için en hızlı başlangıç ürünüdür. Küçük yüzeylerde net görünür, masa düzenini bozmaz ve müşterinin telefonu zaten elindeyken yorum ekranını açmasını sağlar.",
      proof: "Çoklu kullanımda birim fiyat avantajı",
      bestFor: "Kafe, restoran, bar, pastane ve paket teslim noktaları",
    },
    salesMoments: [
      {
        title: "Her masada aynı çağrı",
        body: "Personel tek tek hatırlatmak zorunda kalmaz. Her masa kendi yorum çağrısını taşır.",
      },
      {
        title: "Kompakt alanlarda güçlü görünürlük",
        body: "70 mm yuvarlak form, küçük masalarda, bar tezgahında veya paket teslim alanında rahatça yer bulur.",
      },
      {
        title: "Adet arttıkça karar kolaylaşır",
        body: "10+ adetle masaları kaplamak daha mantıklı hale gelir; çoklu alım avantajı toplam maliyeti görünür biçimde düşürür.",
      },
    ],
    customerReactions: [
      {
        persona: "Restoran müşterisi",
        moment: "Yemek sonrası masada",
        quote: "Hesabı beklerken dokundum, yorumu hemen yazdım.",
        signal: "Masa başı dönüşüm",
      },
      {
        persona: "Pastane müşterisi",
        moment: "Tezgahta sipariş tesliminde",
        quote: "Küçük ama net görünüyor. Telefonu yaklaştırınca ekran açıldı.",
        signal: "Kompakt görünürlük",
      },
      {
        persona: "Bar misafiri",
        moment: "Servis sonrası",
        quote: "QR okutmaya çalışmadım, dokundurmak daha hızlı geldi.",
        signal: "Sürtünmesiz kullanım",
      },
    ],
    reviewExamples: [
      {
        name: "Can P.",
        sector: "Restoran",
        quote: "Yemekler ve servis çok başarılıydı. Masadaki etiketle yorumu hemen bırakabildim.",
      },
      {
        name: "İrem L.",
        sector: "Pastane",
        quote: "Ürünler tazeydi, ekip çok güler yüzlüydü. Telefonu yaklaştırınca değerlendirme ekranı açıldı.",
      },
      {
        name: "Murat E.",
        sector: "Bar",
        quote: "Servis hızlıydı, ortam keyifliydi. Çıkmadan puanımı ve yorumumu paylaşmak kolay oldu.",
      },
    ],
    closingPitch: {
      title: "Masa sayın arttıkça Mini daha çok çalışır.",
      body:
        "Mini, müşteri yoğunluğunu avantaja çevirir. Her masa ayrı bir yorum fırsatı olur; adetli alımda kampanya etkisi daha net hissedilir.",
    },
    image: "/media/biply-round-product-front.jpeg",
    imageAlt: "Mini yuvarlak NFC Google yorum etiketi ürün görseli",
    gallery: [
      "/media/biply-round-product-front.jpeg",
      "/media/biply-round-cafe.png",
      "/media/biply-round-bakery-counter.png",
      "/media/biply-round-window-large.png",
    ],
  },
  {
    id: "product-personal-mini",
    slug: "biply-personal-mini",
    name: "Kişiselleştirilmiş Mini",
    eyebrow: "Sabit Şablon Kişiselleştirilmiş Mini",
    subtitle: "Yazısı sana özel / tasarımı Biply",
    description: "Biply'nin sabit şablonunda, müşteriyi yorum sonrası küçük bir teklife yönlendiren kişiselleştirilmiş Mini.",
    price: 850,
    oldPrice: 1050,
    badge: "KİŞİSELLEŞTİRİLMİŞ",
    saleBadge: "Lansmana özel 200 TL avantaj",
    shape: "personal-mini",
    size: "Çap 70 mm",
    form: "Yuvarlak",
    mounting: "Yapışkanlı",
    idealQuantity: "5+",
    hierarchy: "Kampanya mesajı olan masalar için.",
    cta: "Sepete Ekle",
    features: ["NFC", "Sabit Biply şablonu", "Kampanya metni özelleşir", "QR yok"],
    details: [
      "Ürünün tasarım dili sabittir; değişen alan işletmenizin kampanya cümlesidir.",
      "Kahven bizden, içeceğin bizden veya işletmenize uygun kısa teklif metni ürüne yerleştirilir.",
      "Masa, bar, pastane ve hızlı servis noktalarında yorum bırakmayı küçük bir ödül hissiyle hızlandırır.",
    ],
    useCases: [
      "Kafe masası",
      "Restoran masası",
      "Pastane tezgahı",
      "Bar",
      "Paket teslim noktası",
      "Bekleme alanı",
      "Etkinlik masası",
      "Hızlı servis noktası",
    ],
    detailStory: {
      headline: "Yorum çağrısını kampanya mesajıyla daha cazip hale getirir.",
      body:
        "Kişiselleştirilmiş Mini, Biply'nin sabit yuvarlak şablonunu kullanır. İşletme sadece ürünün üzerinde hangi teklifin yazmasını istediğini söyler; tasarım dili, NFC yönlendirmesi ve yorum akışı aynı kalır.",
      proof: "Sabit şablon, özel kampanya metni",
      bestFor: "Kafe, restoran, bar, pastane ve yoğun masa kullanımı",
    },
    salesMoments: [
      {
        title: "Teklif net olduğu için aksiyon hızlanır",
        body: "Müşteri yorum bıraktığında ne kazanacağını ilk bakışta görür. Bu, yorum istemeyi pazarlık gibi değil küçük bir teşekkür gibi hissettirir.",
      },
      {
        title: "Marka dışına çıkmadan özelleşir",
        body: "Biply'nin sabit düzeni korunur; kampanya metni, ikon ve kısa not alanı işletmeye göre uyarlanır.",
      },
      {
        title: "Masa üstünde satış odaklı çalışır",
        body: "Mini form masayı kaplamaz, ama 'kahven bizden' gibi net mesajlarla yorum davranışını görünür hale getirir.",
      },
    ],
    customerReactions: [
      {
        persona: "Kafe müşterisi",
        moment: "Kahve sonrası masada",
        quote: "Kahven bizden mesajını görünce yorumu hemen bıraktım.",
        signal: "Net teşvik",
      },
      {
        persona: "Restoran misafiri",
        moment: "Hesabı beklerken",
        quote: "Telefonu yaklaştırdım, yorum ekranı açıldı. Küçük ikram fikri hoşuma gitti.",
        signal: "Pozitif kapanış",
      },
      {
        persona: "Pastane müşterisi",
        moment: "Sipariş tesliminde",
        quote: "Çereziniz bizden yazısı dikkatimi çekti, yorum bırakmak kolaydı.",
        signal: "Dikkat çekici mesaj",
      },
    ],
    reviewExamples: [
      {
        name: "Derya M.",
        sector: "Kafe",
        quote: "Kahve çok lezzetliydi, masadaki Biply ile yorum bırakmak da çok pratik oldu.",
      },
      {
        name: "Onur B.",
        sector: "Restoran",
        quote: "Servis hızlıydı. Yorum sonrası küçük ikram mesajı güzel düşünülmüş.",
      },
      {
        name: "Nehir S.",
        sector: "Pastane",
        quote: "Tatlılar tazeydi, kasadaki kişiselleştirilmiş Mini sayesinde değerlendirmeyi unutmadan yaptım.",
      },
    ],
    closingPitch: {
      title: "Mesajı sen söyle, sabit Biply şablonuna yerleştirelim.",
      body:
        "Kişiselleştirilmiş Mini, özel tasarım karmaşasına girmeden daha güçlü bir teklif alanı oluşturur. Ürün yine Biply gibi görünür, sadece işletmenin kampanya cümlesi öne çıkar.",
    },
    image: "/media/biply-campaign-kahve-table.png",
    imageAlt: "Kahven bizden yazılı Kişiselleştirilmiş Mini NFC ürününü masada kullanan müşteri",
    gallery: [
      "/media/biply-campaign-kahve-table.png",
      "/media/biply-campaign-cookie-cafe.png",
      "/media/biply-campaign-beer-bar.png",
      "/media/biply-custom-coffee.png",
      "/media/biply-custom-drink-small.png",
      "/media/biply-custom-cookie.png",
      "/media/biply-custom-beer.png",
    ],
  },
];

export const bundlePresets: BundlePreset[] = [
  {
    id: "preset-critical",
    name: "Kritik Nokta",
    eyebrow: "Resepsiyon / kasa",
    description: "Tek güçlü temas noktasını premium stand ile kapat.",
    quantities: {
      "biply-stand": 1,
      "biply-square": 0,
      "biply-personal-square": 0,
      "biply-round": 0,
      "biply-personal-mini": 0,
    },
  },
  {
    id: "preset-most-loved",
    name: "Hazır Başlangıç",
    eyebrow: "Lansman önerisi",
    description: "Bir Stand, birkaç Kare ve masa üstü Mini ile hızlı başlangıç.",
    badge: "EN AVANTAJLI",
    quantities: {
      "biply-stand": 1,
      "biply-square": 4,
      "biply-personal-square": 0,
      "biply-round": 8,
      "biply-personal-mini": 0,
    },
  },
  {
    id: "preset-table",
    name: "Masa Paketi",
    eyebrow: "Kafe / restoran",
    description: "Her masaya bir Biply koymak isteyen işletmeler için.",
    quantities: {
      "biply-stand": 0,
      "biply-square": 2,
      "biply-personal-square": 0,
      "biply-round": 10,
      "biply-personal-mini": 0,
    },
  },
  {
    id: "preset-personal-mini",
    name: "Kişisel Mini Masalar",
    eyebrow: "Yorum + teklif",
    description: "Sabit şablonda kampanya mesajı isteyen masalar için.",
    quantities: {
      "biply-stand": 0,
      "biply-square": 0,
      "biply-personal-square": 0,
      "biply-round": 0,
      "biply-personal-mini": 10,
    },
  },
];

export const promotions: Promotion[] = [
  {
    id: "promo-round-10",
    name: "10'lu Mini",
    description: "Masa yoğun kafe ve restoranlar için adetli başlangıç.",
    badge: "LANSMAN SETI",
    productSlug: "biply-round",
    quantity: 10,
    image: "/media/biply-round-bakery.png",
    imageAlt: "Pastane tezgahında Mini NFC yorum etiketi",
  },
  {
    id: "promo-square-4",
    name: "4'lü Kare",
    description: "Masa, cam, kasa ve bekleme alanını birlikte kapat.",
    badge: "MASA AVANTAJI",
    productSlug: "biply-square",
    quantity: 4,
    image: "/media/biply-square-salon.png",
    imageAlt: "Güzellik salonunda Kare NFC yorum etiketi",
  },
  {
    id: "promo-personal-square-4",
    name: "4'lü Kişiselleştirilmiş Kare",
    description: "Kampanya mesajını daha geniş kare yüzeyde göster.",
    badge: "KİŞİSEL",
    productSlug: "biply-personal-square",
    quantity: 4,
    image: "/media/biply-personal-square-coffee-nfc.png",
    imageAlt: "Kafede kullanılan kişiselleştirilmiş Kare NFC yorum ürünü",
  },
  {
    id: "promo-stand-extra",
    name: "İkinci Nokta Stand",
    description: "İkinci şube, ikinci kasa veya VIP resepsiyon noktası.",
    badge: "PREMIUM EKLEME",
    productSlug: "biply-stand",
    quantity: 1,
    image: "/media/biply-stand-hotel.png",
    imageAlt: "Otel resepsiyonunda Stand NFC yorum standı",
  },
  {
    id: "promo-personal-mini-10",
    name: "10'lu Kişiselleştirilmiş Mini",
    description: "Kahven bizden gibi sabit şablonlu kampanya mesajı.",
    badge: "KİŞİSEL",
    productSlug: "biply-personal-mini",
    quantity: 10,
    image: "/media/biply-campaign-kahve-table.png",
    imageAlt: "Kahven bizden yazılı Kişiselleştirilmiş Mini kullanım sahnesi",
  },
];

export const comparisonRows = [
  ["Fiyat", "2.000 TL", "1.250 TL", "1.350 TL", "750 TL", "850 TL"],
  ["Boyut", "11 x 16 cm", "10 x 10 cm", "10 x 10 cm", "Ø7 cm", "Ø7 cm"],
  ["Kullanım", "Masaüstü", "Yapışkanlı", "Yapışkanlı", "Yapışkanlı", "Yapışkanlı"],
  ["Segment", "Premium", "Çok yönlü", "Kişisel", "Kompakt", "Kişisel"],
  ["İdeal adet", "1-3", "2-10", "2-10", "5+", "5+"],
  ["NFC", "Var", "Var", "Var", "Var", "Var"],
  ["QR", "Yok", "Yok", "Yok", "Yok", "Yok"],
];

export const customCampaignExamples: CustomCampaignExample[] = [
  {
    id: "custom-drink",
    title: "İçeceğin bizden",
    description: "Kafe, restoran ve hızlı servis noktaları için yorum sonrası küçük ikram kurgusu.",
    image: "/media/biply-custom-drink-small.png",
    imageAlt: "İçeceğin bizden kişiselleştirilmiş Mini tasarım örneği",
  },
  {
    id: "custom-coffee",
    title: "Kahven bizden",
    description: "Kahve dükkanları ve bekleme alanları için sıcak, net ve satışa dönük mesaj.",
    image: "/media/biply-custom-coffee.png",
    imageAlt: "Kahven bizden kişiselleştirilmiş Mini tasarım örneği",
  },
  {
    id: "custom-cookie",
    title: "Çereziniz bizden",
    description: "Pastane, restoran ve masa üstü kullanım için hızlı teşvik mesajı.",
    image: "/media/biply-custom-cookie.png",
    imageAlt: "Çereziniz bizden kişiselleştirilmiş Mini tasarım örneği",
  },
  {
    id: "custom-beer",
    title: "Biranız bizden",
    description: "Bar ve etkinlik alanları için markaya göre uyarlanabilir kampanya dili.",
    image: "/media/biply-custom-beer.png",
    imageAlt: "Biranız bizden kişiselleştirilmiş Mini tasarım örneği",
  },
];

export const sectors = [
  "Kafe & restoran",
  "Klinik & güzellik",
  "Otel & konaklama",
  "Mağaza & showroom",
  "Oto servis",
  "Veteriner kliniği",
];

export const testimonials = [
  {
    name: "Ece Y.",
    role: "Kafe işletmecisi",
    sector: "Kafe",
    quote:
      "Masalara Mini koyunca yoruma yönlendirme kasadaki anlatımdan çıktı. Müşteri sadece telefonunu yaklaştırıyor.",
  },
  {
    name: "Selin D.",
    role: "Güzellik merkezi kurucusu",
    sector: "Güzellik",
    quote:
      "Kare etiketi aynanın yanında çok doğal durdu. Hizmet sonrası yorum istemek daha zarif hale geldi.",
  },
  {
    name: "Mert K.",
    role: "Otel operasyon yöneticisi",
    sector: "Otel",
    quote:
      "Resepsiyondaki Stand premium görünüyor ve ekibin açıklama yapmasına gerek bırakmıyor.",
  },
];

export const faqs = [
  {
    question: "Biply nasıl çalışır?",
    answer:
      "Müşteri telefonunu Biply NFC alanına yaklaştırır ve Google yorum ekranınız anında açılır. Uygulama indirme veya QR tarama gerekmez.",
  },
  {
    question: "Ürünlerde QR var mı?",
    answer: "Hayır. Bu yeni ürün ailesi NFC odaklıdır; QR yok, sadece dokundur deneyimi vardır.",
  },
  {
    question: "Çoklu alım indirimi nasıl hesaplanır?",
    answer:
      "Adet arttıkça avantaj otomatik uygulanır. 2 adette %5, 3-4 adette %10, 5-9 adette %15, 10+ adette %20 avantaj gösterilir.",
  },
  {
    question: "Şu an nasıl satın alıyoruz?",
    answer:
      "Sipariş özetinizi oluşturup WhatsApp'tan gönderirsiniz. Temsilcimiz ödeme, teslimat ve kurulum bilgilerini aynı görüşmede netleştirir.",
  },
  {
    question: "Telefonlar NFC'yi destekliyor mu?",
    answer:
      "Güncel iPhone ve Android telefonların büyük çoğunluğu NFC destekler. Müşteri telefonunu ürün üzerindeki NFC alanına yaklaştırdığında yorum ekranı açılır.",
  },
  {
    question: "Google yorum linkim ürüne nasıl tanımlanıyor?",
    answer:
      "Sipariş sırasında işletmenizin Google yorum bağlantısı alınır ve ürünler bu bağlantıya göre hazırlanır. Kurulum için gerekli bilgiler WhatsApp üzerinden netleştirilir.",
  },
  {
    question: "Havale sonrası süreç nasıl ilerler?",
    answer:
      "Sipariş WhatsApp'ta teyit edildikten sonra ödeme bilgisi paylaşılır. Ödeme onayıyla birlikte üretim, bağlantı tanımı ve teslimat süreci başlar.",
  },
  {
    question: "Fatura veya belge süreci nasıl olacak?",
    answer:
      "Sipariş öncesinde ihtiyaç duyduğunuz belge ve teslimat bilgilerini temsilcimizle netleştirebilirsiniz. Satın alma akışı WhatsApp üzerinden kayıtlı ilerler.",
  },
  {
    question: "Google yorumlarında teşvik var mı?",
    answer:
      "Hayır. Biply müşteriyi yorum ekranına kolayca ulaştırır; belirli puan, olumlu yorum veya ödül vaadi kullanmaz.",
  },
];
