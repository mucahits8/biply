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
  const allergenLabels = item.allergens.map(getAllergenLabel);
  const allergens = allergenLabels.join(" · ");
  const price = formatPrice(item.price);

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
        {item.weight ? <p className="weight">{item.weight}</p> : null}
        {item.kcal !== null ? <p className="kcal-text">{formatKcal(item.kcal, item.kcalIsEstimated)}</p> : null}
        {allergens ? <p className="allergen-line">{allergens}</p> : null}
        {price ? <strong>{price}</strong> : null}
      </div>
    </button>
  );
}

function CampaignModal({
  campaign,
  onClose,
  reviewUrl,
}: {
  campaign: BusinessCampaign;
  onClose: () => void;
  reviewUrl?: string;
}) {
  return (
    <div className="modal-backdrop campaign-backdrop" role="presentation">
      <section
        aria-labelledby="campaign-title"
        aria-modal="true"
        className="campaign-modal"
        role="dialog"
      >
        <button className="modal-close" type="button" onClick={onClose} aria-label="Kampanyayı kapat">
          ×
        </button>
        <div className="campaign-content">
          <p className="campaign-badge">{campaign.badge}</p>
          <h2 id="campaign-title">{campaign.title}</h2>
          <p className="campaign-copy">{campaign.copy}</p>
          <p className="campaign-info">{campaign.info}</p>
        </div>
        {campaign.photoUrl ? (
          <div className="campaign-photo" aria-hidden="true">
            <img src={publicAssetUrl(campaign.photoUrl)} alt="" />
          </div>
        ) : null}
        <div className="campaign-actions">
          {reviewUrl ? (
            <a href={reviewUrl} target="_blank" rel="noreferrer">
              <span>G</span>
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
                <span>Gramaj</span>
                <strong>{item.weight}</strong>
              </p>
            ) : null}
            {allergens ? (
              <p>
                <span>Alerjenler</span>
                <strong>{allergens}</strong>
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
        <div className="business-info-heading">
          <p className="eyebrow">İletişim</p>
          <h2 id="business-info-title">{profile.displayName}</h2>
          <p className="business-subtitle">{profile.subtitle}</p>
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
          campaign={profile.campaign}
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
