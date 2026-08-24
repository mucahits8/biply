"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getAllergenLabel } from "@/lib/sazende/allergens";
import { publicAssetUrl } from "@/lib/sazende/assets";
import { businessInfo } from "@/lib/sazende/business-info";
import { formatKcal, formatPrice } from "@/lib/sazende/format";
import type { BusinessMenu, MenuCategory, MenuItem } from "@/types/menu";

type Props = {
  menu: BusinessMenu;
};

const CAMPAIGN_STORAGE_KEY = "sazende_campaign_seen";
const GOOGLE_REVIEW_URL =
  "https://www.google.com/search?q=%C5%9Eazende+Pa%C3%A7a+%C4%B0%C5%9Fkembe+Kebap+Google+yorum";

function allergenText(item: MenuItem) {
  return item.allergens.map(getAllergenLabel).join(" · ");
}

function displayItemName(name: string) {
  return name.replaceAll("Sazende", "Şazende");
}

function getFallbackDescription(item: MenuItem, category?: MenuCategory) {
  if (item.description) {
    return item.description;
  }

  if (category?.name === "Çorbalar") {
    return "Şazende mutfağında sıcak servis edilen, geleneksel usulde hazırlanan lezzet.";
  }

  if (category?.name === "Fırınlar") {
    return "Taş fırın lezzetinde, sıcak ve taze servis edilen özel hamur işi.";
  }

  if (category?.name.includes("Döner")) {
    return "Günlük hazırlanan döner lezzeti, Şazende sunumuyla servis edilir.";
  }

  if (category?.name === "İçecekler") {
    return "Menü lezzetlerine eşlik eden içecek seçeneği.";
  }

  return "Şazende menüsünden özenle hazırlanan restoran lezzeti.";
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
        <strong>{formatPrice(item.price)}</strong>
      </div>
    </button>
  );
}

function CampaignModal({ onClose }: { onClose: () => void }) {
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
          <p className="campaign-badge">Kampanya</p>
          <h2 id="campaign-title">
            Google&apos;da yorum yap,
            <span>%10 indirim kazan!</span>
          </h2>
          <p className="campaign-copy">
            Yorumunuzu gösterin, hesabınızda %10 indirim fırsatını yakalayın.
          </p>
          <p className="campaign-info">Kasada personelimize göstermeniz yeterli.</p>
        </div>
        <div className="campaign-photo" aria-hidden="true">
          <img src={publicAssetUrl("/menu-default.png")} alt="" />
        </div>
        <div className="campaign-actions">
          <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noreferrer">
            <span>G</span>
            Google&apos;da Yorum Yap
          </a>
          <button type="button" onClick={onClose}>
            Menüye Devam Et
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
}: {
  category?: MenuCategory;
  item: MenuItem;
  onClose: () => void;
}) {
  const allergens = allergenText(item);

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
          <p className="detail-description">{getFallbackDescription(item, category)}</p>
          <div className="detail-price-row">
            <strong>{formatPrice(item.price)}</strong>
            {item.kcal !== null ? <span>{formatKcal(item.kcal, item.kcalIsEstimated)}</span> : null}
          </div>
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

function BusinessInfoFooter() {
  return (
    <section className="business-info" aria-labelledby="business-info-title">
      <div className="business-info-top">
        <div className="business-info-heading">
          <p className="eyebrow">İletişim</p>
          <h2 id="business-info-title">{businessInfo.displayName}</h2>
          <p className="business-subtitle">{businessInfo.subtitle}</p>
        </div>
        <a className="business-instagram" href={businessInfo.instagramUrl} target="_blank" rel="noreferrer">
          <InstagramMark />
          @{businessInfo.instagramHandle}
        </a>
      </div>

      <div className="business-info-grid">
        <div className="business-info-block">
          <h3>Telefon</h3>
          <div className="contact-link-list">
            {businessInfo.phones.map((phone) => (
              <a href={phone.href} key={phone.href}>
                <span>Ara</span>
                <strong>{phone.label}</strong>
              </a>
            ))}
          </div>
        </div>

        <div className="business-info-block">
          <h3>Adres</h3>
          <p className="address-line">
            <span>Konum</span>
            {businessInfo.address}
          </p>
        </div>

        <div className="business-info-block business-info-block-wide">
          <h3>Ödeme Seçenekleri</h3>
          <p className="payment-note">Yemek kartları ve kartlı ödeme kabul edilir.</p>
          <ul className="payment-strip" aria-label="Geçerli ödeme yöntemleri">
            {businessInfo.acceptedPayments.map((payment) => (
              <li key={payment}>{payment}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function MenuClient({ menu }: Props) {
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
    const hasSeenCampaign = sessionStorage.getItem(CAMPAIGN_STORAGE_KEY);
    if (!hasSeenCampaign) {
      window.setTimeout(() => setCampaignOpen(true), 0);
    }
  }, []);

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
    sessionStorage.setItem(CAMPAIGN_STORAGE_KEY, "true");
    setCampaignOpen(false);
  }

  return (
    <main className="menu-shell">
      <header className="brand-header">
        <div className="brand-emblem">
          <Image
            src="/images/sazende-header.png"
            alt={`${businessInfo.displayName} Dijital Menü`}
            width={1448}
            height={1086}
            priority
            sizes="(max-width: 520px) 92vw, 560px"
          />
        </div>
        <a className="header-social-link" href={businessInfo.instagramUrl} target="_blank" rel="noreferrer">
          <InstagramMark />
          @{businessInfo.instagramHandle}
        </a>
      </header>

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

      <BusinessInfoFooter />

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
      {campaignOpen ? <CampaignModal onClose={closeCampaign} /> : null}
      {selectedItem ? (
        <ProductDetailModal
          category={selectedCategory}
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      ) : null}
    </main>
  );
}
