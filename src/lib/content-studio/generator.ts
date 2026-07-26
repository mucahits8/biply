import type { ContentBrief, GeneratedContentDraft } from "./types";

const contentSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "hook", "slides", "caption", "hashtags", "cta", "canva_brief"],
  properties: {
    title: { type: "string" },
    hook: { type: "string" },
    slides: {
      type: "array",
      minItems: 7,
      maxItems: 10,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["slide", "headline", "body", "visual_direction"],
        properties: {
          slide: { type: "number" },
          headline: { type: "string" },
          body: { type: "string" },
          visual_direction: { type: "string" },
        },
      },
    },
    caption: { type: "string" },
    hashtags: {
      type: "array",
      minItems: 5,
      maxItems: 12,
      items: { type: "string" },
    },
    cta: { type: "string" },
    canva_brief: { type: "string" },
  },
} as const;

export async function generateCarouselContent(brief: ContentBrief): Promise<GeneratedContentDraft> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return buildFallbackContent(brief);
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: [
                "Sen Biply için çalışan senior growth strategist, marka editörü ve art director gibi düşünürsün.",
                "Biply, işletmelerin NFC ve QR destekli fiziksel ürünlerle daha fazla Google yorumu ve sosyal aksiyon almasını sağlar.",
                "Instagram ve TikTok için reklam gibi görünmeyen, premium ve editorial carousel içerikleri üretirsin.",
                "Dil; sakin, güven veren, rafine ve danışman notu gibi olmalı. Abartılı pazarlama, clickbait ve emir kipinden kaçın.",
                "Satış cümlesi, kampanya dili, ünlem, emoji, aşırı iddialı vaat ve 'hemen satın al' benzeri CTA kullanma.",
                "Ürün yalnızca son bölümde, doğal bir operasyonel çözüm olarak görünmeli.",
                "Her slide tek fikre odaklansın; metinler kısa ama ucuz reklam cümlesi gibi olmasın.",
              ].join("\n"),
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: buildUserPrompt(brief),
            },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "biply_carousel_content",
          schema: contentSchema,
          strict: true,
        },
      },
      max_output_tokens: 2200,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI içerik üretimi başarısız: ${errorText}`);
  }

  const payload = await response.json();
  const outputText = extractResponseText(payload);

  if (!outputText) {
    throw new Error("OpenAI yanıtında JSON metni bulunamadı.");
  }

  return normalizeGeneratedContent(JSON.parse(outputText), brief);
}

function buildUserPrompt(brief: ContentBrief) {
  return [
    `Sektör: ${brief.sector}`,
    `Amaç: ${brief.goal}`,
    `Ton: ${brief.tone}`,
    `Ürün yönlendirmesi: ${brief.product}`,
    `Carousel uzunluğu: ${brief.slideCount} slide`,
    `Ek not: ${brief.notes || "Yok"}`,
    "",
    "Yaratıcı yön:",
    "- Bu bir reklam değil; işletme sahiplerine yazılmış kısa bir strateji içgörüsü gibi hissettirsin.",
    "- İlk slide bağırmasın; net, merak uyandıran ve sofistike olsun.",
    "- Problemi suçlayıcı anlatma; gözlem ve içgörü olarak anlat.",
    "- Ürün ismini en erken sondan ikinci slide'da geçir.",
    "- CTA yumuşak olsun: incele, düşün, temas noktasını seç gibi.",
    "- Başlıklarda 'Neden artmıyor?', 'Bunu yapın', 'Kaçırıyorsunuz' gibi jenerik reklam kalıplarını kullanma.",
    "",
    "Profesyonel carousel yapısı:",
    "1. Slide: sakin ama güçlü içgörü",
    "2. Slide: müşterinin gerçek davranışı",
    "3. Slide: işletmenin gözden kaçırdığı temas anı",
    "4. Slide: bunun görünürlük/güven etkisi",
    "5. Slide: daha iyi yaklaşım prensibi",
    "6. Slide: kısa sektör senaryosu",
    "7. Slide: Biply'nin doğal rolü",
    "8+. Slide: rafine kapanış ve yumuşak CTA",
    "",
    "JSON alanlarını eksiksiz doldur. Slides dizisi tam olarak istenen slide sayısında olsun.",
  ].join("\n");
}

function extractResponseText(payload: unknown): string | null {
  if (isRecord(payload) && typeof payload.output_text === "string") {
    return payload.output_text;
  }

  if (!isRecord(payload) || !Array.isArray(payload.output)) {
    return null;
  }

  for (const outputItem of payload.output) {
    if (!isRecord(outputItem) || !Array.isArray(outputItem.content)) {
      continue;
    }

    for (const contentItem of outputItem.content) {
      if (isRecord(contentItem) && typeof contentItem.text === "string") {
        return contentItem.text;
      }
    }
  }

  return null;
}

function normalizeGeneratedContent(value: unknown, brief: ContentBrief): GeneratedContentDraft {
  if (!isRecord(value)) {
    throw new Error("AI çıktısı beklenen JSON obje formatında değil.");
  }

  const slides = Array.isArray(value.slides) ? value.slides : [];

  return {
    title: toText(value.title) || `${brief.sector} için ${brief.goal}`,
    hook: toText(value.hook),
    slides: slides.slice(0, brief.slideCount).map((slide, index) => {
      const item = isRecord(slide) ? slide : {};

      return {
        slide: typeof item.slide === "number" ? item.slide : index + 1,
        headline: toText(item.headline),
        body: toText(item.body),
        visual_direction: toText(item.visual_direction),
      };
    }),
    caption: toText(value.caption),
    hashtags: Array.isArray(value.hashtags)
      ? value.hashtags.map((hashtag) => toText(hashtag)).filter(Boolean)
      : [],
    cta: toText(value.cta),
    canva_brief: toText(value.canva_brief),
  };
}

function buildFallbackContent(brief: ContentBrief): GeneratedContentDraft {
  const slideTemplates = [
    ["İyi deneyim her zaman görünür olmaz.", `${brief.sector} işletmelerinde müşteri memnuniyeti çoğu zaman yaşanır; fakat dijital iz bırakmadan kaybolur.`, "Krem zemin, tek güçlü başlık, küçük ve sakin bir yıldız detayı; fotoğraf kullanılmaz."],
    ["Müşteri kararını o anda verir.", "Memnuniyet anı kısadır. Müşteri mekândan ayrıldıktan sonra yorum ya da takip davranışı hızla ertelenir.", "Masa üzerinde telefon, kahve fincanı ve boş alan; sıcak, gerçekçi, reklamsız fotoğraf."],
    ["Asıl mesele hatırlatmanın biçimidir.", "Sözlü rica çoğu zaman aceleye gelir. Daha iyi çalışan şey, doğru yerde duran sessiz bir yönlendirmedir.", "Resepsiyon ya da masa kenarında sade bir temas noktası; insan yüzü ikinci planda."],
    ["Görünürlük küçük temaslardan birikir.", "Google ve sosyal medya güveni, tek büyük kampanyadan çok tekrar eden küçük aksiyonlarla güçlenir.", "Minimal grid: yorum, harita pini, takip simgesi; çizgisel ve düşük kontrast ikonlar."],
    ["Doğru yaklaşım sürtünmeyi azaltır.", "Müşteriye ne yapacağını uzun uzun anlatmak yerine, aksiyonu tek dokunuş mesafesine getirmek gerekir.", "Telefon ekranı ve sade yönlendirme akışı; az metin, bol boşluk."],
    ["Örnek: çıkıştan önceki birkaç saniye.", `${brief.sector.toLowerCase()} müşterisi memnun ayrılırken küçük bir temas noktası, yorum ya da takip aksiyonunu doğal hale getirir.`, "Kapı/tezgâh yakınında doğal ışıklı sahne; ürün yoksa sadece temas anı ima edilir."],
    [`${brief.product}, bu temas anı için tasarlandı.`, "NFC odaklı, QR'sız yapı; müşteriyi baskı kurmadan doğru Google yorum aksiyonuna yönlendirir.", "Biply ürününün sade yakın planı; krem/siyah premium kompozisyon."],
    ["Daha az istemek, daha doğru yerde bulunmak.", "Biply’nin rolü satış yapmak değil; memnuniyet anını görünür bir aksiyona çevirmeyi kolaylaştırmaktır.", "Final slide: tek cümle, küçük ürün detayı, boşluklu editorial düzen."],
    ["İlk temas noktanızı seçin.", "Müşterinin en doğal bekleme anını belirleyin. Yorum, takip veya WhatsApp aksiyonunu o ana bağlayın.", "Checklist değil; sakin üç seçenekli editorial kart düzeni."],
    ["Yumuşak kapanış", "Biply ürün ailesini inceleyin ve işletmenizin doğal temas noktasına en uygun formatı seçin.", "Ürün ailesi küçük ölçekte; tasarım ürün kataloğu değil, strateji notu gibi."],
  ];

  const slides = slideTemplates.slice(0, brief.slideCount).map(([headline, body, visualDirection], index) => ({
    slide: index + 1,
    headline,
    body,
    visual_direction: visualDirection,
  }));

  return {
    title: `${brief.sector} için rafine ${brief.goal} carousel fikri`,
    hook: slides[0]?.headline ?? "İyi deneyim her zaman görünür olmaz.",
    slides,
    caption: `${brief.sector} işletmeleri için görünürlük çoğu zaman yüksek sesli kampanyalarla değil, doğru yerde duran küçük temaslarla büyür. Biply, bu temas anlarını daha sade ve takip edilebilir hale getirir.`,
    hashtags: ["#Biply", "#MüşteriDeneyimi", "#GoogleYorum", "#Yerelİşletme", "#GoogleMaps", "#NFC", "#İşletmeStratejisi"],
    cta: `${brief.product} formatını inceleyin ve işletmenizdeki en doğal temas anını belirleyin.`,
    canva_brief: "Reklam şablonu gibi görünmesin. Editorial, premium ve sakin bir marka sunumu gibi tasarla. Krem zemin, siyah tipografi, çok boşluk, küçük ürün/ikon detayları. Büyük stok fotoğraflardan kaçın; fotoğraf varsa doğal ışıklı ve belgesel hissinde olsun. 4:5 oran, Instagram carousel için 1080x1350.",
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
