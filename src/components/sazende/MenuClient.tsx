"use client";

import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { getAllergenLabel } from "@/lib/sazende/allergens";
import { publicAssetUrl } from "@/lib/sazende/assets";
import type { BusinessCampaign, BusinessProfile, BusinessTheme } from "@/lib/sazende/business-info";
import { getCampaignStorageKey } from "@/lib/sazende/business-info";
import { formatKcal, formatPrice } from "@/lib/sazende/format";
import type { BusinessMenu, MenuCategory, MenuItem } from "@/types/menu";

type Props = {
  menu: BusinessMenu;
  profile: BusinessProfile;
};

function allergenText(item: MenuItem) {
  return item.allergens.map(getAllergenLabel).join(" · ");
}

function getPortionLabel(weight?: string | null) {
  if (!weight) {
    return "Porsiyon";
  }

  const normalizedWeight = weight.toLocaleLowerCase("tr-TR");
  return normalizedWeight.includes("gr") || normalizedWeight.includes("g") ? "Porsiyon / gramaj" : "Porsiyon";
}

function displayItemName(name: string) {
  return name;
}

function getFallbackDescription(item: MenuItem, profile: BusinessProfile, category?: MenuCategory) {
  if (item.description) {
    return item.description;
  }

  if (!profile.useFallbackDescriptions) {
    return "";
  }

  if (category?.name === "Çorbalar") {
    return `${profile.displayName} mutfağında sıcak servis edilen, geleneksel usulde hazırlanan lezzet.`;
  }

  if (category?.name === "Fırınlar") {
    return "Taş fırın lezzetinde, sıcak ve taze servis edilen özel hamur işi.";
  }

  if (category?.name.includes("Döner")) {
    return `Günlük hazırlanan döner lezzeti, ${profile.displayName} sunumuyla servis edilir.`;
  }

  if (category?.name === "İçecekler") {
    return "Menü lezzetlerine eşlik eden içecek seçeneği.";
  }

  return `${profile.displayName} menüsünden özenle hazırlanan restoran lezzeti.`;
}

function FoodVisual({ item, className = "" }: { item: MenuItem; className?: string }) {
  if (!item.imageUrl) {
    return (
      <div className={`food-visual food-visual-empty ${className}`} aria-hidden="true">
        <span>{displayItemName(item.name).slice(0, 1)}</span>
      </div>
    );
  }

  return <img className={`food-visual ${className}`} src={publicAssetUrl(item.imageUrl) ?? ""} alt="" loading="lazy" />;
}

function InstagramMark() {
  return (
    <span className="instagram-mark" aria-hidden="true">
      <span />
    </span>
  );
}

function ProductCard({
  item,
  onSelect,
}: {
  item: MenuItem;
  onSelect: (item: MenuItem) => void;
}) {
  const allergens = allergenText(item);
  const price = formatPrice(item.price);
  const kcal = item.kcal !== null ? formatKcal(item.kcal, item.kcalIsEstimated) : "";

  return (
    <button
      aria-label={`${displayItemName(item.name)} detayını aç`}
      className={`food-card ${!item.isAvailable ? "is-unavailable" : ""}`}
      onClick={() => onSelect(item)}
      type="button"
    >
      <div className="food-card-media">
        <FoodVisual item={item} />
        {!item.isAvailable ? <span className="unavailable-pill">Mevcut değil</span> : null}
      </div>
      <div className="food-card-body">
        <h3>{displayItemName(item.name)}</h3>
        {item.weight || kcal ? (
          <div className="food-meta-row">
            {item.weight ? <span className="meta-pill">{item.weight}</span> : null}
            {kcal ? <span className="meta-pill">{kcal}</span> : null}
          </div>
        ) : null}
        {allergens ? <p className="allergen-line">Olası: {allergens}</p> : null}
        {price ? <strong>{price}</strong> : null}
      </div>
    </button>
  );
}

function renderHighlightedText(text: string, highlight?: string) {
  if (!highlight) {
    return text;
  }

  const highlightIndex = text.toLocaleLowerCase("tr-TR").indexOf(highlight.toLocaleLowerCase("tr-TR"));
  if (highlightIndex === -1) {
    return text;
  }

  const before = text.slice(0, highlightIndex);
  const highlighted = text.slice(highlightIndex, highlightIndex + highlight.length);
  const after = text.slice(highlightIndex + highlight.length);

  return (
    <>
      {before}
      <span>{highlighted}</span>
      {after}
    </>
  );
}

function getGiftLabelParts(label?: string) {
  if (!label) {
    return null;
  }

  const parts = label.split(" ").filter(Boolean);

  if (parts.length < 3) {
    return {
      lead: "",
      main: label,
      tail: "",
    };
  }

  return {
    lead: parts[0],
    main: parts.slice(1, -1).join(" "),
    tail: parts.at(-1) ?? "",
  };
}

function CampaignModal({
  campaign,
  businessName,
  logoUrl,
  onClose,
  reviewUrl,
}: {
  campaign: BusinessCampaign;
  businessName: string;
  logoUrl?: string;
  onClose: () => void;
  reviewUrl?: string;
}) {
  const giftLabel = getGiftLabelParts(campaign.giftLabel);

  return (
    <div className="modal-backdrop campaign-backdrop" role="presentation">
      <section
        aria-labelledby="campaign-title"
        aria-modal="true"
        className={`campaign-modal ${campaign.photoUrl ? "campaign-modal-with-art" : ""}`}
        role="dialog"
      >
        <span className="campaign-sparkle campaign-sparkle-one" aria-hidden="true" />
        <span className="campaign-sparkle campaign-sparkle-two" aria-hidden="true" />
        <span className="campaign-sparkle campaign-sparkle-three" aria-hidden="true" />
        <button className="modal-close" type="button" onClick={onClose} aria-label="Kampanyayı kapat">
          ×
        </button>
        <div className="campaign-content">
          {logoUrl ? (
            <img className="campaign-logo" src={publicAssetUrl(logoUrl) ?? ""} alt={`${businessName} logosu`} />
          ) : null}
          <p className="campaign-badge">{campaign.badge}</p>
          <h2 id="campaign-title">{renderHighlightedText(campaign.title, campaign.titleHighlight)}</h2>
          <div className="campaign-divider" aria-hidden="true">
            <span />
          </div>
          <p className="campaign-copy">{renderHighlightedText(campaign.copy, campaign.copyHighlight)}</p>
          {(campaign.photoUrl || giftLabel) ? (
            <div className="campaign-visual-row" aria-hidden="true">
              {campaign.photoUrl ? (
                <div className="campaign-treat">
                  <img src={publicAssetUrl(campaign.photoUrl)} alt="" />
                </div>
              ) : null}
              {giftLabel ? (
                <div className="campaign-gift-badge">
                  {giftLabel.lead ? <span>{giftLabel.lead}</span> : null}
                  <strong>{giftLabel.main}</strong>
                  {giftLabel.tail ? <small>{giftLabel.tail}</small> : null}
                </div>
              ) : null}
            </div>
          ) : null}
          <p className="campaign-info">
            <span aria-hidden="true">i</span>
            {campaign.info}
          </p>
          {campaign.chip ? (
            <p className="campaign-chip">
              <span aria-hidden="true" />
              {campaign.chip}
            </p>
          ) : null}
        </div>
        <div className="campaign-actions">
          {reviewUrl ? (
            <a href={reviewUrl} target="_blank" rel="noreferrer" onClick={onClose}>
              <span className="campaign-google-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="presentation" focusable="false">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A10.99 10.99 0 0 0 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.11A6.62 6.62 0 0 1 5.48 12c0-.73.13-1.44.36-2.11V7.05H2.18A10.99 10.99 0 0 0 1 12c0 1.77.42 3.44 1.18 4.95l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.36c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.07 14.97 1 12 1A10.99 10.99 0 0 0 2.18 7.05l3.66 2.84C6.71 7.29 9.14 5.36 12 5.36z"
                    fill="#EA4335"
                  />
                </svg>
              </span>
              {campaign.actionLabel}
            </a>
          ) : null}
          <button type="button" onClick={onClose}>
            {campaign.continueLabel}
          </button>
        </div>
      </section>
    </div>
  );
}

function ProductDetailModal({
  category,
  item,
  onClose,
  profile,
}: {
  category?: MenuCategory;
  item: MenuItem;
  onClose: () => void;
  profile: BusinessProfile;
}) {
  const allergens = allergenText(item);
  const price = formatPrice(item.price);
  const kcal = item.kcal !== null ? formatKcal(item.kcal, item.kcalIsEstimated) : "";
  const description = getFallbackDescription(item, profile, category);

  return (
    <div className="modal-backdrop product-backdrop" role="presentation">
      <section
        aria-labelledby="product-title"
        aria-modal="true"
        className="product-sheet"
        role="dialog"
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Ürün detayını kapat">
          ×
        </button>
        <div className="product-hero">
          <FoodVisual item={item} />
          {!item.isAvailable ? <span className="unavailable-pill">Mevcut değil</span> : null}
        </div>
        <div className="product-detail-body">
          <p className="detail-category">{category?.name}</p>
          <h2 id="product-title">{displayItemName(item.name)}</h2>
          {description ? <p className="detail-description">{description}</p> : null}
          {price || kcal ? (
            <div className="detail-price-row">
              {price ? <strong>{price}</strong> : null}
              {kcal ? <span>{kcal}</span> : null}
            </div>
          ) : null}
          <div className="detail-facts">
            {item.weight ? (
              <p>
                <span>{getPortionLabel(item.weight)}</span>
                <strong>{item.weight}</strong>
              </p>
            ) : null}
            {allergens ? (
              <p>
                <span>Alerjenler</span>
                <strong>{allergens}</strong>
              </p>
            ) : null}
            {item.allergenNote ? (
              <p>
                <span>Not</span>
                <strong>{item.allergenNote}</strong>
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

function BusinessInfoFooter({ profile }: { profile: BusinessProfile }) {
  const hasContact = profile.phones.length > 0 || profile.address || profile.instagramUrl;
  const hasPayments = profile.acceptedPayments.length > 0;

  if (!hasContact && !hasPayments) {
    return null;
  }

  return (
    <section className="business-info" aria-labelledby="business-info-title">
      <div className="business-info-top">
        <div className="business-info-brand">
          {profile.logoUrl ? (
            <img
              className="business-logo"
              src={publicAssetUrl(profile.logoUrl) ?? ""}
              alt={`${profile.displayName} logosu`}
              loading="lazy"
            />
          ) : null}
          <div className="business-info-heading">
            <p className="eyebrow">İletişim</p>
            <h2 id="business-info-title">{profile.displayName}</h2>
            <p className="business-subtitle">{profile.subtitle}</p>
          </div>
        </div>
        {profile.instagramUrl && profile.instagramHandle ? (
          <a className="business-instagram" href={profile.instagramUrl} target="_blank" rel="noreferrer">
            <InstagramMark />
            @{profile.instagramHandle}
          </a>
        ) : null}
      </div>

      <div className="business-info-grid">
        {profile.phones.length > 0 ? (
          <div className="business-info-block">
            <h3>Telefon</h3>
            <div className="contact-link-list">
              {profile.phones.map((phone) => (
                <a href={phone.href} key={phone.href}>
                  <span>Ara</span>
                  <strong>{phone.label}</strong>
                </a>
              ))}
            </div>
          </div>
        ) : null}

        {profile.address ? (
          <div className="business-info-block">
            <h3>Adres</h3>
            {profile.mapUrl ? (
              <a className="address-line" href={profile.mapUrl} target="_blank" rel="noreferrer">
                <span>Konum</span>
                {profile.address}
              </a>
            ) : (
              <p className="address-line">
                <span>Konum</span>
                {profile.address}
              </p>
            )}
          </div>
        ) : null}

        {hasPayments ? (
          <div className="business-info-block business-info-block-wide">
            <h3>Ödeme Seçenekleri</h3>
            <p className="payment-note">Yemek kartları ve kartlı ödeme kabul edilir.</p>
            <ul className="payment-strip" aria-label="Geçerli ödeme yöntemleri">
              {profile.acceptedPayments.map((payment) => (
                <li key={payment}>{payment}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function getThemeStyle(theme?: BusinessTheme): CSSProperties {
  return {
    "--menu-bg": theme?.background,
    "--menu-surface": theme?.surface,
    "--menu-surface-strong": theme?.surfaceStrong,
    "--menu-ink": theme?.ink,
    "--menu-soft": theme?.soft,
    "--menu-faint": theme?.faint,
    "--menu-gold": theme?.accent,
    "--menu-gold-strong": theme?.accentStrong,
    "--menu-line": theme?.line,
    "--menu-shadow": theme?.shadow,
    "--menu-font": theme?.fontFamily,
    "--menu-heading-font": theme?.headingFontFamily,
    "--menu-glow": theme?.glow,
    "--menu-wash": theme?.wash,
    "--menu-grid-line": theme?.gridLine,
  } as CSSProperties;
}

export function MenuClient({ menu, profile }: Props) {
  const visibleCategories = useMemo(
    () => menu.categories.filter((category) => category.items.length > 0),
    [menu.categories],
  );
  const [selectedId, setSelectedId] = useState(visibleCategories[0]?.id ?? "");
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [campaignOpen, setCampaignOpen] = useState(false);
  const selectedCategory =
    visibleCategories.find((category) => category.id === selectedId) ?? visibleCategories[0];

  useEffect(() => {
    if (!profile.campaign?.enabled) {
      return;
    }

    const hasSeenCampaign = sessionStorage.getItem(getCampaignStorageKey(profile.slug));
    if (!hasSeenCampaign) {
      window.setTimeout(() => setCampaignOpen(true), 0);
    }
  }, [profile.campaign?.enabled, profile.slug]);

  useEffect(() => {
    if (!campaignOpen && !selectedItem) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setCampaignOpen(false);
        setSelectedItem(null);
      }
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [campaignOpen, selectedItem]);

  function closeCampaign() {
    sessionStorage.setItem(getCampaignStorageKey(profile.slug), "true");
    setCampaignOpen(false);
  }

  const isPosterHero = profile.heroMode === "poster" && profile.heroImageUrl;

  return (
    <main
      className={`menu-shell ${profile.theme?.mode === "dark" ? "menu-shell-dark" : ""}`}
      style={getThemeStyle(profile.theme)}
    >
      {isPosterHero ? (
        <header className="brand-header brand-header-poster" aria-label={`${profile.displayName} dijital menü`}>
          <img src={publicAssetUrl(profile.heroImageUrl) ?? ""} alt="" />
          {profile.instagramUrl && profile.instagramHandle ? (
            <a className="header-social-link poster-social-link" href={profile.instagramUrl} target="_blank" rel="noreferrer">
              <InstagramMark />
              @{profile.instagramHandle}
            </a>
          ) : null}
          <div className="sr-only">
            <p>Dijital Menü</p>
            <h1>{profile.displayName}</h1>
            {profile.brandDescriptor ? <p>{profile.brandDescriptor}</p> : null}
            {profile.tagline ? <p>{profile.tagline}</p> : null}
            <p>{profile.subtitle}</p>
          </div>
        </header>
      ) : (
        <header className={`brand-header ${profile.heroImageUrl ? "brand-header-visual" : ""}`}>
          <p className="eyebrow">Dijital Menü</p>
          <div className="brand-lockup">
            <h1>{profile.displayName}</h1>
            {profile.brandDescriptor ? (
              <p className="brand-descriptor">{profile.brandDescriptor}</p>
            ) : null}
          </div>
          {profile.tagline ? <p className="brand-tagline">{profile.tagline}</p> : null}
          <div className="ornament" />
          <p className="brand-subtitle">
            <span>{profile.subtitle}</span>
          </p>
          {profile.instagramUrl && profile.instagramHandle ? (
            <a className="header-social-link" href={profile.instagramUrl} target="_blank" rel="noreferrer">
              <InstagramMark />
              @{profile.instagramHandle}
            </a>
          ) : null}
          {profile.heroImageUrl ? (
            <div className="brand-storefront" aria-hidden="true">
              <img src={publicAssetUrl(profile.heroImageUrl) ?? ""} alt="" />
            </div>
          ) : null}
        </header>
      )}

      <nav className="category-grid" aria-label="Menü kategorileri">
        {visibleCategories.map((category) => (
          <button
            key={category.id}
            aria-pressed={category.id === selectedCategory?.id}
            className={category.id === selectedCategory?.id ? "active" : ""}
            onClick={() => setSelectedId(category.id)}
            type="button"
          >
            <span>{category.name}</span>
            <small>{category.items.length} ürün</small>
          </button>
        ))}
      </nav>

      {selectedCategory ? (
        <section className="category-section" aria-labelledby="category-title">
          <div className="section-heading">
            <div>
              <h2 id="category-title">{selectedCategory.name}</h2>
              <p>{selectedCategory.items.length} ürün</p>
            </div>
          </div>
          <div className="items-list">
            {selectedCategory.items.map((item) => (
              <ProductCard key={item.id} item={item} onSelect={setSelectedItem} />
            ))}
          </div>
        </section>
      ) : null}

      <BusinessInfoFooter profile={profile} />

      <footer className="menu-notes">
        <p>
          Kalori değerleri standart porsiyonlara göre yaklaşık olarak hesaplanmıştır.
          Porsiyon ve hazırlanış şekline göre değişiklik gösterebilir.
        </p>
        <p>
          Alerjen bilgileri ürünlerin standart hazırlanış biçimine göre sunulmaktadır.
          Reçeteler ve çapraz temas koşulları değişebileceğinden, ciddi alerjiniz varsa
          sipariş vermeden önce işletme personeline danışınız.
        </p>
      </footer>
      {campaignOpen && profile.campaign?.enabled ? (
        <CampaignModal
          businessName={profile.displayName}
          campaign={profile.campaign}
          logoUrl={profile.logoUrl}
          onClose={closeCampaign}
          reviewUrl={profile.reviewUrl}
        />
      ) : null}
      {selectedItem ? (
        <ProductDetailModal
          category={selectedCategory}
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          profile={profile}
        />
      ) : null}
    </main>
  );
}
