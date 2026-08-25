"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { allergenLabels, getAllergenLabel } from "@/lib/sazende/allergens";
import { publicAssetUrl } from "@/lib/sazende/assets";
import { getBusinessProfile, getBusinessProfileBySlug } from "@/lib/sazende/business-info";
import { formatKcal } from "@/lib/sazende/format";
import { getSeedMenu } from "@/lib/sazende/menu";
import { supabaseAnonKey, supabaseFetch, supabaseUrl } from "@/lib/sazende/supabase";
import type { AllergenKey, BusinessMenu, MenuItem } from "@/types/menu";

const TOKEN_KEY = "biply_admin_token";
const REFRESH_KEY = "biply_admin_refresh";

type AdminMode = "loading" | "login" | "ready";

type EditableItem = MenuItem & {
  imageFile?: File | null;
};

type SaveStage = "idle" | "uploading" | "saving" | "refreshing";

const allergenOptions = Object.entries(allergenLabels) as Array<[AllergenKey, string]>;

function getStoredToken() {
  if (typeof window === "undefined") {
    return "";
  }

  return localStorage.getItem(TOKEN_KEY) ?? "";
}

function displayItemName(name: string) {
  return name;
}

async function signIn(email: string, password: string) {
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      apikey: supabaseAnonKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("E-posta veya şifre hatalı.");
  }

  return (await response.json()) as {
    access_token: string;
    refresh_token: string;
  };
}

async function uploadImage(file: File, token: string, slug: string) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const key = `items/${slug}/${crypto.randomUUID()}.${extension}`;
  const response = await fetch(`${supabaseUrl}/storage/v1/object/menu-images/${key}`, {
    method: "POST",
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${token}`,
      "Cache-Control": "3600",
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "true",
    },
    body: file,
  });

  if (!response.ok) {
    throw new Error("Görsel yüklenemedi.");
  }

  return `${supabaseUrl}/storage/v1/object/public/menu-images/${key}`;
}

async function loadAdminMenu(token: string, slug: string): Promise<BusinessMenu> {
  const businessParams = new URLSearchParams({
    select: "id,name,slug,subtitle",
    slug: `eq.${slug}`,
    limit: "1",
  });
  const [business] = await supabaseFetch<BusinessMenu["business"][]>(
    "businesses",
    businessParams,
    token,
  );

  if (!business) {
    const bootstrapped = await bootstrapSeedMenu(token, slug);
    if (bootstrapped) {
      return bootstrapped;
    }

    throw new Error("Bu slug ile kayıtlı işletme bulunamadı.");
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

  const [categories, items] = await Promise.all([
    supabaseFetch<
      Array<{
        id: string;
        business_id: string;
        name: string;
        sort_order: number;
        is_active: boolean;
      }>
    >("menu_categories", categoryParams, token),
    supabaseFetch<
      Array<{
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
      }>
    >("menu_items", itemParams, token),
  ]);

  const mappedItems: EditableItem[] = items.map((item) => ({
    id: item.id,
    businessId: item.business_id,
    categoryId: item.category_id,
    name: item.name,
    description: item.description,
    price: item.price,
    weight: item.weight,
    imageUrl: item.image_url,
    sortOrder: item.sort_order,
    isActive: item.is_active,
    isAvailable: item.is_available,
    kcal: item.kcal,
    kcalIsEstimated: item.kcal_is_estimated,
    allergens: (item.allergens ?? []) as MenuItem["allergens"],
    allergenNote: item.allergen_note,
    allergenIsVerified: item.allergen_is_verified,
  }));

  return {
    business,
    categories: categories.map((category) => ({
      id: category.id,
      businessId: category.business_id,
      name: category.name,
      sortOrder: category.sort_order,
      isActive: category.is_active,
      items: mappedItems.filter((item) => item.categoryId === category.id),
    })),
  };
}

async function bootstrapSeedMenu(token: string, slug: string): Promise<BusinessMenu | null> {
  const seedMenu = getSeedMenu(slug);

  if (!seedMenu) {
    return null;
  }

  const [business] = await supabaseFetch<BusinessMenu["business"][]>(
    "businesses",
    undefined,
    token,
    {
      method: "POST",
      body: JSON.stringify({
        name: seedMenu.business.name,
        slug: seedMenu.business.slug,
        subtitle: seedMenu.business.subtitle,
      }),
    },
  );

  for (const category of seedMenu.categories) {
    const [createdCategory] = await supabaseFetch<
      Array<{
        id: string;
      }>
    >("menu_categories", undefined, token, {
      method: "POST",
      body: JSON.stringify({
        business_id: business.id,
        name: category.name,
        sort_order: category.sortOrder,
        is_active: true,
      }),
    });

    if (category.items.length === 0) {
      continue;
    }

    await supabaseFetch("menu_items", undefined, token, {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(
        category.items.map((item) => ({
          business_id: business.id,
          category_id: createdCategory.id,
          name: item.name,
          description: item.description,
          price: item.price,
          weight: item.weight,
          image_url: item.imageUrl,
          sort_order: item.sortOrder,
          is_active: item.isActive,
          is_available: item.isAvailable,
          kcal: item.kcal,
          kcal_is_estimated: item.kcalIsEstimated,
          allergens: item.allergens,
          allergen_note: item.allergenNote,
          allergen_is_verified: item.allergenIsVerified,
        })),
      ),
    });
  }

  return loadAdminMenu(token, slug);
}

export function AdminClient({ slug = "sazende" }: { slug?: string }) {
  const [mode, setMode] = useState<AdminMode>(() => (getStoredToken() ? "loading" : "login"));
  const [token, setToken] = useState(getStoredToken);
  const [menu, setMenu] = useState<BusinessMenu | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [priceDrafts, setPriceDrafts] = useState<Record<string, string>>({});
  const [dirtyItemIds, setDirtyItemIds] = useState<Set<string>>(new Set());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveStage, setSaveStage] = useState<SaveStage>("idle");
  const [showNewItem, setShowNewItem] = useState(false);
  const [newCategoryId, setNewCategoryId] = useState("");
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newKcal, setNewKcal] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);

  const categories = useMemo(() => menu?.categories ?? [], [menu]);
  const selectedCategory =
    categories.find((category) => category.id === selectedCategoryId) ?? categories[0];
  const profile = menu ? getBusinessProfile(menu.business) : getBusinessProfileBySlug(slug);
  const hasChanges = dirtyItemIds.size > 0;
  const saveLabel = saving
    ? saveStage === "uploading"
      ? "Görsel yükleniyor..."
      : saveStage === "refreshing"
        ? "Menü yenileniyor..."
        : "Kaydediliyor..."
    : hasChanges
      ? `${dirtyItemIds.size} değişiklik kaydet`
      : "Değişiklik yok";

  function setMenuState(data: BusinessMenu) {
    setMenu(data);
    setSelectedCategoryId(data.categories[0]?.id || "");
    setNewCategoryId(data.categories[0]?.id || "");
    setPriceDrafts(
      Object.fromEntries(
        data.categories.flatMap((category) =>
          category.items.map((item) => [item.id, item.price === null ? "" : String(item.price)]),
        ),
      ),
    );
    setDirtyItemIds(new Set());
  }

  useEffect(() => {
    const storedToken = token;
    if (!storedToken) {
      return;
    }

    loadAdminMenu(storedToken, slug)
      .then((data) => {
        setMenuState(data);
        setMode("ready");
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_KEY);
        setMode("login");
      });
  }, [slug, token]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    try {
      const session = await signIn(email, password);
      localStorage.setItem(TOKEN_KEY, session.access_token);
      localStorage.setItem(REFRESH_KEY, session.refresh_token);
      setToken(session.access_token);
      const data = await loadAdminMenu(session.access_token, slug);
      setMenuState(data);
      setMode("ready");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Giriş yapılamadı.");
    }
  }

  function updateItem(itemId: string, patch: Partial<EditableItem>) {
    setDirtyItemIds((current) => new Set(current).add(itemId));
    setMenu((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        categories: current.categories.map((category) => ({
          ...category,
          items: category.items.map((item) =>
            item.id === itemId ? ({ ...item, ...patch } as EditableItem) : item,
          ),
        })),
      };
    });
  }

  async function handleSave() {
    if (!menu || saving || dirtyItemIds.size === 0) {
      return;
    }

    setSaving(true);
    setSaveStage("saving");
    setMessage("");
    try {
      const dirtyItems = menu.categories
        .flatMap((category) => category.items)
        .filter((item) => dirtyItemIds.has(item.id)) as EditableItem[];

      const invalidItem = dirtyItems.find((item) => {
        const draft = priceDrafts[item.id]?.trim() ?? "";
        return draft !== "" && Number.isNaN(Number(draft));
      });

      if (invalidItem) {
        setMessage(`${invalidItem.name} için geçerli bir fiyat gir.`);
        setSaving(false);
        setSaveStage("idle");
        return;
      }

      const invalidKcalItem = dirtyItems.find(
        (item) => item.kcal !== null && Number.isNaN(Number(item.kcal)),
      );

      if (invalidKcalItem) {
        setMessage(`${invalidKcalItem.name} için geçerli bir kcal değeri gir.`);
        setSaving(false);
        setSaveStage("idle");
        return;
      }

      for (const item of dirtyItems) {
        let imageUrl = item.imageUrl;
        if (item.imageFile) {
          setSaveStage("uploading");
          imageUrl = await uploadImage(item.imageFile, token, slug);
        }

        setSaveStage("saving");
        const params = new URLSearchParams({ id: `eq.${item.id}` });
        await supabaseFetch(
          "menu_items",
          params,
          token,
          {
            method: "PATCH",
            headers: { Prefer: "return=minimal" },
            body: JSON.stringify({
              price:
                priceDrafts[item.id]?.trim() === ""
                  ? null
                  : Number(priceDrafts[item.id]),
              weight: item.weight?.trim() || null,
              kcal: item.kcal,
              kcal_is_estimated: item.kcalIsEstimated,
              allergens: item.allergens,
              allergen_note: item.allergenNote?.trim() || null,
              allergen_is_verified: item.allergenIsVerified,
              is_available: item.isAvailable,
              image_url: imageUrl,
              updated_at: new Date().toISOString(),
            }),
          },
        );
      }

      setSaveStage("refreshing");
      const fresh = await loadAdminMenu(token, slug);
      setMenuState(fresh);
      setMessage("Değişiklikler kaydedildi.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kaydetme sırasında hata oluştu.");
    } finally {
      setSaving(false);
      setSaveStage("idle");
    }
  }

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!menu || !newCategoryId || !newName.trim()) {
      setMessage("Ürün adı ve kategori gerekli.");
      return;
    }

    const normalizedPrice = newPrice.trim();
    if (normalizedPrice && Number.isNaN(Number(normalizedPrice))) {
      setMessage("Fiyat için geçerli bir sayı gir.");
      return;
    }

    const normalizedKcal = newKcal.trim();
    if (normalizedKcal && Number.isNaN(Number(normalizedKcal))) {
      setMessage("Kalori için geçerli bir sayı gir.");
      return;
    }

    setSaving(true);
    setSaveStage(newImage ? "uploading" : "saving");
    setMessage("");
    try {
      const imageUrl = newImage ? await uploadImage(newImage, token, slug) : null;
      const category = menu.categories.find((entry) => entry.id === newCategoryId);
      const sortOrder =
        Math.max(0, ...(category?.items.map((item) => item.sortOrder) ?? [0])) + 10;

      await supabaseFetch(
        "menu_items",
        undefined,
        token,
        {
          method: "POST",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({
            business_id: menu.business.id,
            category_id: newCategoryId,
            name: newName.trim(),
            description: newDescription.trim() || null,
            price: normalizedPrice ? Number(normalizedPrice) : null,
            weight: newWeight.trim() || null,
            image_url: imageUrl,
            sort_order: sortOrder,
            is_active: true,
            is_available: true,
            kcal: normalizedKcal ? Number(normalizedKcal) : null,
            kcal_is_estimated: true,
            allergens: [],
            allergen_note: null,
            allergen_is_verified: false,
          }),
        },
      );

      setNewName("");
      setNewPrice("");
      setNewKcal("");
      setNewWeight("");
      setNewDescription("");
      setNewImage(null);
      const fresh = await loadAdminMenu(token, slug);
      setMenuState(fresh);
      setMessage("Ürün eklendi.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Ürün eklenemedi.");
    } finally {
      setSaving(false);
      setSaveStage("idle");
    }
  }

  async function handleDelete(itemId: string) {
    if (saving) {
      return;
    }

    setSaving(true);
    setSaveStage("saving");
    setMessage("");
    try {
      await supabaseFetch(
        "menu_items",
        new URLSearchParams({ id: `eq.${itemId}` }),
        token,
        {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({
            is_active: false,
            updated_at: new Date().toISOString(),
          }),
        },
      );
      const fresh = await loadAdminMenu(token, slug);
      setMenuState(fresh);
      setMessage("Ürün kaldırıldı.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Ürün kaldırılamadı.");
    } finally {
      setSaving(false);
      setSaveStage("idle");
    }
  }

  function toggleItemAllergen(item: EditableItem, allergen: AllergenKey, checked: boolean) {
    const nextAllergens = checked
      ? Array.from(new Set([...item.allergens, allergen]))
      : item.allergens.filter((entry) => entry !== allergen);

    updateItem(item.id, {
      allergens: nextAllergens,
      allergenIsVerified: false,
    });
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    setToken("");
    setMenu(null);
    setMode("login");
  }

  if (mode === "loading") {
    return <main className="admin-shell">Menü yönetimi yükleniyor...</main>;
  }

  if (mode === "login") {
    return (
      <main className="admin-shell login-shell">
        <form className="login-panel" onSubmit={handleLogin}>
          {profile.logoUrl ? (
            <img
              className="admin-logo"
              src={publicAssetUrl(profile.logoUrl) ?? ""}
              alt={`${profile.displayName} logosu`}
            />
          ) : null}
          <p className="eyebrow">Admin</p>
          <h1>{profile.displayName} Menü Yönetimi</h1>
          <label>
            E-posta
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
          </label>
          <label>
            Şifre
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
            />
          </label>
          <button type="submit">Giriş Yap</button>
          {message ? <p className="admin-message">{message}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main className={`admin-shell ${saving ? "is-saving" : ""}`}>
      <header className="admin-header">
        <div className="admin-title-row">
          {profile.logoUrl ? (
            <img
              className="admin-header-logo"
              src={publicAssetUrl(profile.logoUrl) ?? ""}
              alt={`${profile.displayName} logosu`}
            />
          ) : null}
          <div>
            <p className="eyebrow">{profile.displayName}</p>
            <h1>Menü Yönetimi</h1>
          </div>
        </div>
        <button type="button" className="ghost-button" onClick={logout} disabled={saving}>
          Çıkış
        </button>
      </header>

      {message ? <p className="admin-message">{message}</p> : null}

      <section className="admin-actions">
        <button
          className="admin-section-toggle"
          type="button"
          disabled={saving}
          onClick={() => setShowNewItem((current) => !current)}
        >
          <span>Yeni Ürün</span>
          <strong>{showNewItem ? "Kapat" : "Ekle"}</strong>
        </button>
        {showNewItem ? (
          <form className="new-item-form" onSubmit={handleCreate}>
            <select
              value={newCategoryId}
              onChange={(event) => setNewCategoryId(event.target.value)}
              disabled={saving}
            >
              {categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              placeholder="Ürün adı"
              disabled={saving}
            />
            <input
              value={newPrice}
              onChange={(event) => setNewPrice(event.target.value)}
              placeholder="Fiyat"
              inputMode="numeric"
              disabled={saving}
            />
            <input
              value={newKcal}
              onChange={(event) => setNewKcal(event.target.value)}
              placeholder="Kcal"
              inputMode="numeric"
              disabled={saving}
            />
            <input
              value={newWeight}
              onChange={(event) => setNewWeight(event.target.value)}
              placeholder="Porsiyon / gramaj"
              disabled={saving}
            />
            <input
              value={newDescription}
              onChange={(event) => setNewDescription(event.target.value)}
              placeholder="Kısa açıklama"
              disabled={saving}
            />
            <input
              onChange={(event) => setNewImage(event.target.files?.[0] ?? null)}
              type="file"
              accept="image/*"
              disabled={saving}
            />
            <button type="submit" disabled={saving}>
              Ürün Ekle
            </button>
          </form>
        ) : null}
      </section>

      <nav className="admin-category-tabs" aria-label="Admin kategorileri">
        {categories.map((category) => (
          <button
            className={selectedCategory?.id === category.id ? "active" : ""}
            key={category.id}
            onClick={() => setSelectedCategoryId(category.id)}
            disabled={saving}
            type="button"
          >
            {category.name}
          </button>
        ))}
      </nav>

      <div className="admin-category-list">
        {selectedCategory ? (
          <section className="admin-category" key={selectedCategory.id}>
            <h2>{selectedCategory.name}</h2>
            <div className="admin-items">
              {(selectedCategory.items as EditableItem[]).map((item) => (
                <article className="admin-item" key={item.id}>
                  <div className="admin-item-title">
                    <img
                      src={
                        item.imageFile
                          ? URL.createObjectURL(item.imageFile)
                          : publicAssetUrl(item.imageUrl || "/menu-default.png") || ""
                      }
                      alt=""
                      loading="lazy"
                    />
                    <div>
                      <h3>{displayItemName(item.name)}</h3>
                      {item.kcal !== null ? (
                        <p>{formatKcal(item.kcal, item.kcalIsEstimated)}</p>
                      ) : null}
                      {item.allergens.length > 0 ? (
                        <p>{item.allergens.map(getAllergenLabel).join(", ")}</p>
                      ) : null}
                    </div>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleDelete(item.id)}
                      disabled={saving}
                    >
                      Sil
                    </button>
                  </div>
                  <label>
                    Fiyat
                    <input
                      value={priceDrafts[item.id] ?? ""}
                      onChange={(event) => {
                        setPriceDrafts((current) => ({
                          ...current,
                          [item.id]: event.target.value,
                        }));
                        setDirtyItemIds((current) => new Set(current).add(item.id));
                      }}
                      inputMode="numeric"
                      disabled={saving}
                    />
                  </label>
                  <div className="admin-field-grid">
                    <label>
                      Porsiyon / gramaj
                      <input
                        value={item.weight ?? ""}
                        onChange={(event) => updateItem(item.id, { weight: event.target.value })}
                        placeholder="1 adet / 110 gr"
                        disabled={saving}
                      />
                    </label>
                    <label>
                      Kcal
                      <input
                        value={item.kcal ?? ""}
                        onChange={(event) => {
                          const value = event.target.value.trim();
                          updateItem(item.id, {
                            kcal: value === "" ? null : Number(value),
                            kcalIsEstimated: true,
                          });
                        }}
                        placeholder="720"
                        inputMode="numeric"
                        disabled={saving}
                      />
                    </label>
                  </div>
                  <label>
                    Alerjen notu
                    <input
                      value={item.allergenNote ?? ""}
                      onChange={(event) =>
                        updateItem(item.id, {
                          allergenNote: event.target.value,
                          allergenIsVerified: false,
                        })
                      }
                      placeholder="İsteğe bağlı kısa not"
                      disabled={saving}
                    />
                  </label>
                  <fieldset className="allergen-editor" disabled={saving}>
                    <legend>Alerjenler</legend>
                    <div>
                      {allergenOptions.map(([key, label]) => (
                        <label key={key}>
                          <input
                            checked={item.allergens.includes(key)}
                            onChange={(event) => toggleItemAllergen(item, key, event.target.checked)}
                            type="checkbox"
                          />
                          <span>{label}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <label className="switch-row">
                    <input
                      checked={!item.isAvailable}
                      onChange={(event) =>
                        updateItem(item.id, { isAvailable: !event.target.checked })
                      }
                      type="checkbox"
                      disabled={saving}
                    />
                    Ürün bitti
                  </label>
                  <label>
                    Görsel
                    <input
                      onChange={(event) =>
                        updateItem(item.id, { imageFile: event.target.files?.[0] ?? null })
                      }
                      type="file"
                      accept="image/*"
                      disabled={saving}
                    />
                  </label>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <div className="save-bar">
        <button type="button" onClick={handleSave} disabled={saving || !hasChanges}>
          <span>{saveLabel}</span>
        </button>
      </div>
    </main>
  );
}
