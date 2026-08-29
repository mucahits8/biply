"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import type { BusinessProfile } from "@/lib/sazende/business-info";
import { formatPrice } from "@/lib/sazende/format";
import { supabaseFetch } from "@/lib/sazende/supabase";
import type { BusinessMenu, MenuCategory, MenuItem } from "@/types/menu";

type PosView = "tables" | "table" | "cash" | "history" | "reports";
type PaymentMethod = "cash" | "card" | "mixed";
type DataMode = "remote" | "local";

type PosTable = {
  id: string;
  businessId: string;
  name: string;
  area: string;
  sortOrder: number;
  isActive: boolean;
};

type PosOrderItem = {
  id: string;
  orderId: string;
  menuItemId: string | null;
  name: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

type PosPayment = {
  id: string;
  orderId: string;
  method: "cash" | "card";
  amount: number;
  paidAt: string;
};

type PosOrder = {
  id: string;
  businessId: string;
  tableId: string | null;
  orderNo: number;
  source: "table" | "counter";
  status: "open" | "paid" | "cancelled" | "refunded";
  note: string | null;
  totalAmount: number;
  paymentSummary: string | null;
  openedAt: string;
  closedAt: string | null;
  items: PosOrderItem[];
  payments: PosPayment[];
};

type PosSettings = {
  reportPinHash: string;
  reportLockMinutes: number;
};

type PaymentState = {
  orderId: string;
  method: PaymentMethod;
  cash: string;
  card: string;
};

type ManualItemInput = {
  name: string;
  amountInput: string;
};

type LocalSnapshot = {
  tables: PosTable[];
  openOrders: PosOrder[];
  historyOrders: PosOrder[];
  nextOrderNo: number;
};

const FAVORITE_NAMES = [
  "Simit",
  "Poğaça",
  "Açma",
  "Küçük Çay",
  "Fincan Çay",
  "Türk Kahvesi",
  "Su",
  "Karışık Tost",
  "Sütlaç",
  "Soğuk Baklava",
  "Magnolia",
  "Hamburger",
];

const DEFAULT_PIN_HASH_BY_SLUG: Record<string, string> = {
  hamarat: "db117cadaeb576c942833bb254fc33154d23dc2db268fd2541401dbe2fb6be96",
};

const LOCAL_POS_PREFIX = "biply_pos_state";

const HAMARAT_TABLE_LAYOUT = [
  { name: "Masa 1", area: "İÇERİ", sortOrder: 10 },
  { name: "Masa 2", area: "İÇERİ", sortOrder: 20 },
  { name: "Masa 3", area: "İÇERİ", sortOrder: 30 },
  { name: "Masa 4", area: "İÇERİ", sortOrder: 40 },
  { name: "Masa 5", area: "İÇERİ", sortOrder: 50 },
  { name: "Masa 6", area: "İÇERİ", sortOrder: 60 },
  { name: "Masa 7", area: "DIŞARI", sortOrder: 110 },
  { name: "Masa 8", area: "DIŞARI", sortOrder: 120 },
  { name: "Masa 9", area: "DIŞARI", sortOrder: 130 },
  { name: "Masa 10", area: "DIŞARI", sortOrder: 140 },
  { name: "Masa 11", area: "DIŞARI", sortOrder: 150 },
];

type TableRow = {
  id: string;
  business_id: string;
  name: string;
  area: string;
  sort_order: number;
  is_active: boolean;
};

type OrderRow = {
  id: string;
  business_id: string;
  table_id: string | null;
  order_no: number;
  source: "table" | "counter";
  status: "open" | "paid" | "cancelled" | "refunded";
  note: string | null;
  total_amount: number | string;
  payment_summary: string | null;
  opened_at: string;
  closed_at: string | null;
};

type OrderItemRow = {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  name_snapshot: string;
  unit_price: number | string;
  quantity: number;
  line_total: number | string;
};

type PaymentRow = {
  id: string;
  order_id: string;
  method: "cash" | "card";
  amount: number | string;
  paid_at: string;
};

type SettingsRow = {
  report_pin_hash: string;
  report_lock_minutes: number;
};

function mapTable(row: TableRow): PosTable {
  return {
    id: row.id,
    businessId: row.business_id,
    name: row.name,
    area: normalizeArea(row.area),
    sortOrder: row.sort_order,
    isActive: row.is_active,
  };
}

function mapOrder(row: OrderRow, items: PosOrderItem[], payments: PosPayment[]): PosOrder {
  return {
    id: row.id,
    businessId: row.business_id,
    tableId: row.table_id,
    orderNo: row.order_no,
    source: row.source,
    status: row.status,
    note: row.note,
    totalAmount: Number(row.total_amount),
    paymentSummary: row.payment_summary,
    openedAt: row.opened_at,
    closedAt: row.closed_at,
    items,
    payments,
  };
}

function mapOrderItem(row: OrderItemRow): PosOrderItem {
  return {
    id: row.id,
    orderId: row.order_id,
    menuItemId: row.menu_item_id,
    name: row.name_snapshot,
    unitPrice: Number(row.unit_price),
    quantity: row.quantity,
    lineTotal: Number(row.line_total),
  };
}

function mapPayment(row: PaymentRow): PosPayment {
  return {
    id: row.id,
    orderId: row.order_id,
    method: row.method,
    amount: Number(row.amount),
    paidAt: row.paid_at,
  };
}

function dateKey(value: Date | string) {
  const date = typeof value === "string" ? new Date(value) : value;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function todayKey() {
  return dateKey(new Date());
}

function dateFromKey(key: string) {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function reportDateLabel(key: string) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(dateFromKey(key));
}

function reportDateShortLabel(key: string) {
  const [year, month, day] = key.split("-");
  return `${day}-${month}-${year}`;
}

function minutesOpen(openedAt: string, now: Date) {
  return Math.max(0, Math.floor((now.getTime() - new Date(openedAt).getTime()) / 60000));
}

function productKey(item: MenuItem) {
  return item.name.toLocaleLowerCase("tr-TR").trim();
}

function itemInitials(name: string) {
  const parts = name.split(" ").filter(Boolean);
  const first = parts[0]?.slice(0, 1) ?? "";
  const second = parts.length > 1 ? parts[1]?.slice(0, 1) ?? "" : "";
  return `${first}${second}`.toLocaleUpperCase("tr-TR");
}

function imageBackgroundStyle(imageUrl: string): CSSProperties {
  const safeUrl = imageUrl.replace(/["\\\n\r]/g, "");
  return {
    backgroundImage: `url("${safeUrl}")`,
  };
}

function paymentLabel(summary: string | null, payments: PosPayment[]) {
  if (summary === "cash") {
    return "Nakit";
  }

  if (summary === "card") {
    return "Kart";
  }

  if (summary === "mixed") {
    return "Karma";
  }

  if (payments.length > 1) {
    return "Karma";
  }

  return payments[0]?.method === "cash" ? "Nakit" : payments[0]?.method === "card" ? "Kart" : "-";
}

function tableTitle(order: PosOrder, tables: PosTable[]) {
  if (order.source === "counter") {
    return "Kasa";
  }

  return order.tableId ? tables.find((table) => table.id === order.tableId)?.name ?? "Masa" : "Masa";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function paymentSummaryLabel(method: PaymentMethod) {
  return method === "cash" ? "cash" : method === "card" ? "card" : "mixed";
}

async function sha256Hex(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function sumItems(items: PosOrderItem[]) {
  return items.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
}

function parseMoneyInput(input: string) {
  const cleaned = input.trim().replace(/[₺\s]/g, "");
  const hasComma = cleaned.includes(",");
  const dotParts = cleaned.split(".");
  const looksLikeTurkishThousands =
    !hasComma && dotParts.length > 1 && dotParts.slice(1).every((part) => part.length === 3);
  const normalized = hasComma
    ? cleaned.replaceAll(".", "").replace(",", ".")
    : looksLikeTurkishThousands
      ? cleaned.replaceAll(".", "")
      : cleaned;
  const amount = Number(normalized);

  if (!Number.isFinite(amount)) {
    return Number.NaN;
  }

  return Math.round(amount * 100) / 100;
}

function readableDate(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(date);
}

function readableTime(date: Date) {
  return new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function timeOnly(value: string | null) {
  if (!value) {
    return "-";
  }

  return readableTime(new Date(value));
}

function matchesSearch(value: string, search: string) {
  return value.toLocaleLowerCase("tr-TR").includes(search.toLocaleLowerCase("tr-TR").trim());
}

function normalizeArea(area: string) {
  if (area === "İç Salon" || area.toLocaleLowerCase("tr-TR") === "içeri") {
    return "İÇERİ";
  }

  if (area === "Dış Alan" || area.toLocaleLowerCase("tr-TR") === "dışarı") {
    return "DIŞARI";
  }

  return area.toLocaleUpperCase("tr-TR");
}

function areaSort(area: string) {
  if (area === "İÇERİ") {
    return 1;
  }

  if (area === "DIŞARI") {
    return 2;
  }

  return 3;
}

function getFallbackTables(businessId: string, slug: string): PosTable[] {
  if (slug !== "hamarat") {
    return [];
  }

  return HAMARAT_TABLE_LAYOUT.map((table, index) => ({
    id: `hamarat-fallback-table-${index + 1}`,
    businessId,
    name: table.name,
    area: table.area,
    sortOrder: table.sortOrder,
    isActive: true,
  }));
}

function localStorageKey(slug: string) {
  return `${LOCAL_POS_PREFIX}_${slug}`;
}

function createLocalId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function getNextOrderNo(openOrders: PosOrder[], historyOrders: PosOrder[]) {
  const highest = [...openOrders, ...historyOrders].reduce(
    (max, order) => Math.max(max, order.orderNo),
    1000,
  );
  return highest + 1;
}

function loadLocalSnapshot(businessId: string, slug: string): LocalSnapshot {
  if (typeof window === "undefined") {
    return {
      tables: getFallbackTables(businessId, slug),
      openOrders: [],
      historyOrders: [],
      nextOrderNo: 1001,
    };
  }

  try {
    const stored = localStorage.getItem(localStorageKey(slug));
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<LocalSnapshot>;
      const tables = parsed.tables?.length ? parsed.tables.map((table) => ({
        ...table,
        area: normalizeArea(table.area),
      })) : getFallbackTables(businessId, slug);
      const openOrders = parsed.openOrders ?? [];
      const historyOrders = parsed.historyOrders ?? [];
      return {
        tables,
        openOrders,
        historyOrders,
        nextOrderNo:
          parsed.nextOrderNo && parsed.nextOrderNo > 0
            ? parsed.nextOrderNo
            : getNextOrderNo(openOrders, historyOrders),
      };
    }
  } catch {
    localStorage.removeItem(localStorageKey(slug));
  }

  return {
    tables: getFallbackTables(businessId, slug),
    openOrders: [],
    historyOrders: [],
    nextOrderNo: 1001,
  };
}

function saveLocalSnapshot(slug: string, snapshot: LocalSnapshot) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(localStorageKey(slug), JSON.stringify(snapshot));
}

async function loadOrderItems(orderIds: string[]) {
  if (orderIds.length === 0) {
    return [] as PosOrderItem[];
  }

  const params = new URLSearchParams({
    select: "id,order_id,menu_item_id,name_snapshot,unit_price,quantity,line_total",
    order_id: `in.(${orderIds.join(",")})`,
    order: "created_at.asc",
  });
  const rows = await supabaseFetch<OrderItemRow[]>("pos_order_items", params);
  return rows.map(mapOrderItem);
}

async function loadPayments(orderIds: string[]) {
  if (orderIds.length === 0) {
    return [] as PosPayment[];
  }

  const params = new URLSearchParams({
    select: "id,order_id,method,amount,paid_at",
    order_id: `in.(${orderIds.join(",")})`,
    order: "paid_at.asc",
  });
  const rows = await supabaseFetch<PaymentRow[]>("pos_payments", params);
  return rows.map(mapPayment);
}

export function PosClient({ menu, profile }: { menu: BusinessMenu; profile: BusinessProfile }) {
  const [dataMode, setDataMode] = useState<DataMode>("remote");
  const [activeView, setActiveView] = useState<PosView>("tables");
  const [tables, setTables] = useState<PosTable[]>(() =>
    getFallbackTables(menu.business.id, menu.business.slug),
  );
  const [openOrders, setOpenOrders] = useState<PosOrder[]>([]);
  const [historyOrders, setHistoryOrders] = useState<PosOrder[]>([]);
  const [nextLocalOrderNo, setNextLocalOrderNo] = useState(1001);
  const [settings, setSettings] = useState<PosSettings>({
    reportPinHash: DEFAULT_PIN_HASH_BY_SLUG[menu.business.slug] ?? "",
    reportLockMinutes: 3,
  });
  const [selectedTableId, setSelectedTableId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("favorites");
  const [selectedHistoryId, setSelectedHistoryId] = useState<string>("");
  const [search, setSearch] = useState("");
  const [historySearch, setHistorySearch] = useState("");
  const [selectedReportDate, setSelectedReportDate] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState<Date | null>(null);
  const [payment, setPayment] = useState<PaymentState | null>(null);
  const [pin, setPin] = useState("");
  const [reportsUnlocked, setReportsUnlocked] = useState(false);
  const [targetTableId, setTargetTableId] = useState("");

  const allItems = useMemo(
    () => menu.categories.flatMap((category) => category.items).filter((item) => item.price !== null),
    [menu.categories],
  );

  const favoriteItems = useMemo(() => {
    const byName = new Map(allItems.map((item) => [productKey(item), item]));
    return FAVORITE_NAMES.map((name) => byName.get(productKey({ name } as MenuItem))).filter(
      Boolean,
    ) as MenuItem[];
  }, [allItems]);

  const selectedCategory = menu.categories.find((category) => category.id === selectedCategoryId);
  const visibleItems = useMemo(() => {
    const baseItems =
      selectedCategoryId === "favorites" ? favoriteItems : selectedCategory?.items ?? [];
    const pricedItems = baseItems.filter((item) => item.price !== null);

    if (!search.trim()) {
      return pricedItems;
    }

    return pricedItems.filter((item) => matchesSearch(item.name, search));
  }, [favoriteItems, search, selectedCategory?.items, selectedCategoryId]);

  const selectedTable = tables.find((table) => table.id === selectedTableId) ?? null;
  const selectedTableOrder =
    selectedTableId ? openOrders.find((order) => order.tableId === selectedTableId) ?? null : null;
  const counterOrder = openOrders.find((order) => order.source === "counter") ?? null;
  const selectedHistoryOrder =
    historyOrders.find((order) => order.id === selectedHistoryId) ?? historyOrders[0] ?? null;

  const currentDayKey = now ? dateKey(now) : todayKey();
  const activeReportDate = selectedReportDate || currentDayKey;
  const paidReportOrders = historyOrders.filter(
    (order) => order.status === "paid" && order.closedAt && dateKey(order.closedAt) === activeReportDate,
  );
  const cancelledReportOrders = historyOrders.filter(
    (order) => order.status === "cancelled" && order.closedAt && dateKey(order.closedAt) === activeReportDate,
  );
  const reportTotal = paidReportOrders.reduce((total, order) => total + order.totalAmount, 0);
  const cashTotal = paidReportOrders.reduce(
    (total, order) =>
      total + order.payments.filter((entry) => entry.method === "cash").reduce((sum, entry) => sum + entry.amount, 0),
    0,
  );
  const cardTotal = paidReportOrders.reduce(
    (total, order) =>
      total + order.payments.filter((entry) => entry.method === "card").reduce((sum, entry) => sum + entry.amount, 0),
    0,
  );
  const reportDayOptions = useMemo(() => {
    const days = new Map<string, { key: string; total: number; count: number }>();
    days.set(currentDayKey, { key: currentDayKey, total: 0, count: 0 });

    historyOrders.forEach((order) => {
      if (!order.closedAt) {
        return;
      }

      const key = dateKey(order.closedAt);
      const current = days.get(key) ?? { key, total: 0, count: 0 };
      if (order.status === "paid") {
        current.total += order.totalAmount;
        current.count += 1;
      }
      days.set(key, current);
    });

    return Array.from(days.values()).sort((a, b) => b.key.localeCompare(a.key));
  }, [currentDayKey, historyOrders]);
  const bestSellers = useMemo(() => {
    const map = new Map<string, { name: string; quantity: number; total: number }>();
    paidReportOrders.forEach((order) => {
      order.items.forEach((item) => {
        const current = map.get(item.name) ?? { name: item.name, quantity: 0, total: 0 };
        current.quantity += item.quantity;
        current.total += item.lineTotal;
        map.set(item.name, current);
      });
    });

    return Array.from(map.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 6);
  }, [paidReportOrders]);

  const filteredHistory = useMemo(() => {
    if (!historySearch.trim()) {
      return historyOrders;
    }

    return historyOrders.filter((order) => {
      const tableName = order.tableId
        ? tables.find((table) => table.id === order.tableId)?.name ?? "Masa"
        : "Kasa";
      return matchesSearch(`#${order.orderNo} ${tableName} ${paymentLabel(order.paymentSummary, order.payments)}`, historySearch);
    });
  }, [historyOrders, historySearch, tables]);

  function applyLocalSnapshot(snapshot: LocalSnapshot) {
    setTables(snapshot.tables);
    setOpenOrders(snapshot.openOrders);
    setHistoryOrders(snapshot.historyOrders);
    setNextLocalOrderNo(snapshot.nextOrderNo);
    setSelectedHistoryId((current) => current || snapshot.historyOrders[0]?.id || "");
  }

  function persistLocalSnapshot(snapshot: LocalSnapshot) {
    applyLocalSnapshot(snapshot);
    saveLocalSnapshot(menu.business.slug, snapshot);
  }

  function upsertLocalOrder(order: PosOrder) {
    const exists = openOrders.some((entry) => entry.id === order.id);
    const nextOpenOrders = exists
      ? openOrders.map((entry) => (entry.id === order.id ? order : entry))
      : [order, ...openOrders];

    persistLocalSnapshot({
      tables,
      openOrders: nextOpenOrders,
      historyOrders,
      nextOrderNo: Math.max(nextLocalOrderNo, getNextOrderNo(nextOpenOrders, historyOrders)),
    });
  }

  async function refreshPosState() {
    if (dataMode === "local") {
      applyLocalSnapshot(loadLocalSnapshot(menu.business.id, menu.business.slug));
      return;
    }

    const [tableRows, openOrderRows, historyRows, settingsRows] = await Promise.all([
      supabaseFetch<TableRow[]>(
        "pos_tables",
        new URLSearchParams({
          select: "id,business_id,name,area,sort_order,is_active",
          business_id: `eq.${menu.business.id}`,
          is_active: "eq.true",
          order: "sort_order.asc,name.asc",
        }),
      ),
      supabaseFetch<OrderRow[]>(
        "pos_orders",
        new URLSearchParams({
          select:
            "id,business_id,table_id,order_no,source,status,note,total_amount,payment_summary,opened_at,closed_at",
          business_id: `eq.${menu.business.id}`,
          status: "eq.open",
          order: "opened_at.desc",
        }),
      ),
      supabaseFetch<OrderRow[]>(
        "pos_orders",
        new URLSearchParams({
          select:
            "id,business_id,table_id,order_no,source,status,note,total_amount,payment_summary,opened_at,closed_at",
          business_id: `eq.${menu.business.id}`,
          closed_at: "not.is.null",
          order: "closed_at.desc",
          limit: "300",
        }),
      ),
      supabaseFetch<SettingsRow[]>(
        "pos_settings",
        new URLSearchParams({
          select: "report_pin_hash,report_lock_minutes",
          business_id: `eq.${menu.business.id}`,
          limit: "1",
        }),
      ),
    ]);

    const orders = [...openOrderRows, ...historyRows];
    const orderIds = orders.map((order) => order.id);
    const [items, payments] = await Promise.all([loadOrderItems(orderIds), loadPayments(orderIds)]);

    setTables(tableRows.map(mapTable));
    setOpenOrders(
      openOrderRows.map((order) =>
        mapOrder(
          order,
          items.filter((item) => item.orderId === order.id),
          payments.filter((entry) => entry.orderId === order.id),
        ),
      ),
    );
    const mappedHistory = historyRows.map((order) =>
      mapOrder(
        order,
        items.filter((item) => item.orderId === order.id),
        payments.filter((entry) => entry.orderId === order.id),
      ),
    );
    setHistoryOrders(mappedHistory);
    setSelectedHistoryId((current) => current || mappedHistory[0]?.id || "");

    if (settingsRows[0]) {
      setSettings({
        reportPinHash: settingsRows[0].report_pin_hash,
        reportLockMinutes: settingsRows[0].report_lock_minutes,
      });
    }
    setDataMode("remote");
    if (typeof window !== "undefined") {
      localStorage.removeItem(`${LOCAL_POS_PREFIX}_${menu.business.slug}_mode`);
    }
  }

  /* eslint-disable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */
  useEffect(() => {
    refreshPosState().catch(() => {
      setDataMode("local");
      applyLocalSnapshot(loadLocalSnapshot(menu.business.id, menu.business.slug));
      setMessage("");
    });
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps, react-hooks/set-state-in-effect */

  useEffect(() => {
    const updateClock = () => setNow(new Date());
    const initial = window.setTimeout(updateClock, 0);
    const timer = window.setInterval(updateClock, 60000);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (activeView !== "reports" || !reportsUnlocked) {
      return;
    }

    const timeout = window.setTimeout(
      () => {
        setReportsUnlocked(false);
        setPin("");
      },
      Math.max(1, settings.reportLockMinutes) * 60000,
    );
    return () => window.clearTimeout(timeout);
  }, [activeView, reportsUnlocked, settings.reportLockMinutes]);

  function switchView(view: PosView) {
    setMessage("");
    setPayment(null);
    if (view !== "reports") {
      setReportsUnlocked(false);
      setPin("");
    }
    setActiveView(view);
  }

  async function createOrder(tableId: string | null, source: "table" | "counter") {
    if (dataMode === "local") {
      const order: PosOrder = {
        id: createLocalId("local-order"),
        businessId: menu.business.id,
        tableId,
        orderNo: nextLocalOrderNo,
        source,
        status: "open",
        note: null,
        totalAmount: 0,
        paymentSummary: null,
        openedAt: new Date().toISOString(),
        closedAt: null,
        items: [],
        payments: [],
      };
      persistLocalSnapshot({
        tables,
        openOrders: [order, ...openOrders],
        historyOrders,
        nextOrderNo: nextLocalOrderNo + 1,
      });
      return order;
    }

    const [order] = await supabaseFetch<OrderRow[]>("pos_orders", undefined, undefined, {
      method: "POST",
      body: JSON.stringify({
        business_id: menu.business.id,
        table_id: tableId,
        source,
        status: "open",
        total_amount: 0,
      }),
    });

    return mapOrder(order, [], []);
  }

  async function patchOrderTotal(orderId: string, total: number) {
    if (dataMode === "local") {
      return;
    }

    await supabaseFetch(
      "pos_orders",
      new URLSearchParams({ id: `eq.${orderId}` }),
      undefined,
      {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          total_amount: total,
          updated_at: new Date().toISOString(),
        }),
      },
    );
  }

  async function ensureWorkingOrder() {
    if (activeView === "cash") {
      return counterOrder ?? (await createOrder(null, "counter"));
    }

    if (!selectedTable) {
      throw new Error("Önce masa seç.");
    }

    return selectedTableOrder ?? (await createOrder(selectedTable.id, "table"));
  }

  async function addItem(item: MenuItem) {
    if (busy || item.price === null || !item.isAvailable) {
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const order = await ensureWorkingOrder();
      const currentItem = order.items.find((entry) => entry.menuItemId === item.id);
      const nextItems = currentItem
        ? order.items.map((entry) =>
            entry.id === currentItem.id ? { ...entry, quantity: entry.quantity + 1 } : entry,
          )
        : [
            ...order.items,
            {
              id: "",
              orderId: order.id,
              menuItemId: item.id,
              name: item.name,
              unitPrice: item.price,
              quantity: 1,
              lineTotal: item.price,
            },
          ];

      if (dataMode === "local") {
        upsertLocalOrder({
          ...order,
          items: nextItems.map((entry) => ({
            ...entry,
            id: entry.id || createLocalId("local-item"),
            lineTotal: entry.unitPrice * entry.quantity,
          })),
          totalAmount: sumItems(nextItems),
        });
        return;
      }

      if (currentItem) {
        await supabaseFetch(
          "pos_order_items",
          new URLSearchParams({ id: `eq.${currentItem.id}` }),
          undefined,
          {
            method: "PATCH",
            headers: { Prefer: "return=minimal" },
            body: JSON.stringify({
              quantity: currentItem.quantity + 1,
              updated_at: new Date().toISOString(),
            }),
          },
        );
      } else {
        await supabaseFetch("pos_order_items", undefined, undefined, {
          method: "POST",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({
            order_id: order.id,
            menu_item_id: item.id,
            name_snapshot: item.name,
            unit_price: item.price,
            quantity: 1,
          }),
        });
      }

      await patchOrderTotal(order.id, sumItems(nextItems));
      await refreshPosState();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Ürün eklenemedi.");
    } finally {
      setBusy(false);
    }
  }

  async function addManualItem({ name, amountInput }: ManualItemInput) {
    if (busy) {
      return false;
    }

    const amount = parseMoneyInput(amountInput);
    if (!Number.isFinite(amount) || amount <= 0) {
      setMessage("Elle girilen tutar 0'dan büyük olmalı.");
      return false;
    }

    setBusy(true);
    setMessage("");
    try {
      const order = await ensureWorkingOrder();
      const manualItem: PosOrderItem = {
        id: "",
        orderId: order.id,
        menuItemId: null,
        name: name || "Elle Girilen Tutar",
        unitPrice: amount,
        quantity: 1,
        lineTotal: amount,
      };
      const nextItems = [...order.items, manualItem];

      if (dataMode === "local") {
        upsertLocalOrder({
          ...order,
          items: nextItems.map((entry) => ({
            ...entry,
            id: entry.id || createLocalId("local-item"),
            lineTotal: entry.unitPrice * entry.quantity,
          })),
          totalAmount: sumItems(nextItems),
        });
        return true;
      }

      await supabaseFetch("pos_order_items", undefined, undefined, {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          order_id: order.id,
          menu_item_id: null,
          name_snapshot: manualItem.name,
          unit_price: amount,
          quantity: 1,
        }),
      });

      await patchOrderTotal(order.id, sumItems(nextItems));
      await refreshPosState();
      return true;
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Elle tutar eklenemedi.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function changeQuantity(order: PosOrder, item: PosOrderItem, change: -1 | 1) {
    if (busy) {
      return;
    }

    if (item.quantity === 1 && change === -1) {
      const confirmed = window.confirm(`${item.name} adisyondan kaldırılsın mı?`);
      if (!confirmed) {
        return;
      }
    }

    setBusy(true);
    setMessage("");
    try {
      const nextQuantity = item.quantity + change;
      const nextItems =
        nextQuantity <= 0
          ? order.items.filter((entry) => entry.id !== item.id)
          : order.items.map((entry) =>
              entry.id === item.id ? { ...entry, quantity: nextQuantity } : entry,
            );

      if (dataMode === "local") {
        upsertLocalOrder({
          ...order,
          items: nextItems.map((entry) => ({
            ...entry,
            lineTotal: entry.unitPrice * entry.quantity,
          })),
          totalAmount: sumItems(nextItems),
        });
        return;
      }

      if (nextQuantity <= 0) {
        await supabaseFetch(
          "pos_order_items",
          new URLSearchParams({ id: `eq.${item.id}` }),
          undefined,
          {
            method: "DELETE",
            headers: { Prefer: "return=minimal" },
          },
        );
      } else {
        await supabaseFetch(
          "pos_order_items",
          new URLSearchParams({ id: `eq.${item.id}` }),
          undefined,
          {
            method: "PATCH",
            headers: { Prefer: "return=minimal" },
            body: JSON.stringify({
              quantity: nextQuantity,
              updated_at: new Date().toISOString(),
            }),
          },
        );
      }

      await patchOrderTotal(order.id, sumItems(nextItems));
      await refreshPosState();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Adet güncellenemedi.");
    } finally {
      setBusy(false);
    }
  }

  function openPayment(order: PosOrder, method: PaymentMethod = "cash") {
    const total = String(order.totalAmount);
    setPayment({
      orderId: order.id,
      method,
      cash: method === "cash" ? total : method === "mixed" ? "" : "0",
      card: method === "card" ? total : method === "mixed" ? "" : "0",
    });
  }

  async function completePayment() {
    if (!payment || busy) {
      return;
    }

    const order =
      openOrders.find((entry) => entry.id === payment.orderId) ??
      historyOrders.find((entry) => entry.id === payment.orderId);
    if (!order || order.totalAmount <= 0) {
      setMessage("Ödeme alınacak adisyon bulunamadı.");
      return;
    }

    const cash = payment.method === "card" ? 0 : Number(payment.cash || 0);
    const card = payment.method === "cash" ? 0 : Number(payment.card || 0);
    const paidTotal = cash + card;

    if (Number.isNaN(paidTotal) || Math.abs(paidTotal - order.totalAmount) > 0.01) {
      setMessage("Nakit ve kart toplamı adisyon tutarıyla aynı olmalı.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      if (dataMode === "local") {
        const closedAt = new Date().toISOString();
        const payments: PosPayment[] = [
          cash > 0
            ? {
                id: createLocalId("local-payment"),
                orderId: order.id,
                method: "cash",
                amount: cash,
                paidAt: closedAt,
              }
            : null,
          card > 0
            ? {
                id: createLocalId("local-payment"),
                orderId: order.id,
                method: "card",
                amount: card,
                paidAt: closedAt,
              }
            : null,
        ].filter(Boolean) as PosPayment[];
        const paidOrder: PosOrder = {
          ...order,
          status: "paid",
          paymentSummary: paymentSummaryLabel(payment.method),
          closedAt,
          payments,
        };

        persistLocalSnapshot({
          tables,
          openOrders: openOrders.filter((entry) => entry.id !== order.id),
          historyOrders: [paidOrder, ...historyOrders],
          nextOrderNo: nextLocalOrderNo,
        });
        setPayment(null);
        setSelectedTableId("");
        setActiveView(order.source === "counter" ? "cash" : "tables");
        return;
      }

      const paymentRows = [
        cash > 0 ? { order_id: order.id, method: "cash", amount: cash } : null,
        card > 0 ? { order_id: order.id, method: "card", amount: card } : null,
      ].filter(Boolean);

      if (paymentRows.length > 0) {
        await supabaseFetch("pos_payments", undefined, undefined, {
          method: "POST",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify(paymentRows),
        });
      }

      await supabaseFetch(
        "pos_orders",
        new URLSearchParams({ id: `eq.${order.id}` }),
        undefined,
        {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({
            status: "paid",
            payment_summary: paymentSummaryLabel(payment.method),
            closed_at: new Date().toISOString(),
            total_amount: order.totalAmount,
            updated_at: new Date().toISOString(),
          }),
        },
      );

      setPayment(null);
      setSelectedTableId("");
      setActiveView(order.source === "counter" ? "cash" : "tables");
      await refreshPosState();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Ödeme tamamlanamadı.");
    } finally {
      setBusy(false);
    }
  }

  async function cancelOrder(order: PosOrder) {
    if (busy) {
      return;
    }

    const confirmed = window.confirm(`#${order.orderNo} adisyonu iptal edilsin mi?`);
    if (!confirmed) {
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      if (dataMode === "local") {
        const cancelledOrder: PosOrder = {
          ...order,
          status: "cancelled",
          totalAmount: 0,
          closedAt: new Date().toISOString(),
        };
        persistLocalSnapshot({
          tables,
          openOrders: openOrders.filter((entry) => entry.id !== order.id),
          historyOrders: [cancelledOrder, ...historyOrders],
          nextOrderNo: nextLocalOrderNo,
        });
        setSelectedTableId("");
        setActiveView("tables");
        return;
      }

      await supabaseFetch(
        "pos_orders",
        new URLSearchParams({ id: `eq.${order.id}` }),
        undefined,
        {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({
            status: "cancelled",
            total_amount: 0,
            closed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
        },
      );
      setSelectedTableId("");
      setActiveView("tables");
      await refreshPosState();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Adisyon iptal edilemedi.");
    } finally {
      setBusy(false);
    }
  }

  async function moveOrder(order: PosOrder) {
    if (!targetTableId || busy) {
      return;
    }

    const targetHasOpenOrder = openOrders.some(
      (entry) => entry.tableId === targetTableId && entry.id !== order.id,
    );
    if (targetHasOpenOrder) {
      setMessage("Seçtiğin masada açık adisyon var. Bunun için masa birleştir kullan.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      if (dataMode === "local") {
        const movedOrder = {
          ...order,
          tableId: targetTableId,
        };
        persistLocalSnapshot({
          tables,
          openOrders: openOrders.map((entry) => (entry.id === order.id ? movedOrder : entry)),
          historyOrders,
          nextOrderNo: nextLocalOrderNo,
        });
        setSelectedTableId(targetTableId);
        setTargetTableId("");
        return;
      }

      await supabaseFetch(
        "pos_orders",
        new URLSearchParams({ id: `eq.${order.id}` }),
        undefined,
        {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({
            table_id: targetTableId,
            updated_at: new Date().toISOString(),
          }),
        },
      );
      setSelectedTableId(targetTableId);
      setTargetTableId("");
      await refreshPosState();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Masa taşınamadı.");
    } finally {
      setBusy(false);
    }
  }

  async function mergeOrder(order: PosOrder) {
    if (!targetTableId || busy) {
      return;
    }

    const targetOrder = openOrders.find((entry) => entry.tableId === targetTableId);
    if (!targetOrder) {
      await moveOrder(order);
      return;
    }

    if (targetOrder.id === order.id) {
      return;
    }

    const confirmed = window.confirm(`#${order.orderNo} seçilen masadaki adisyona birleştirilsin mi?`);
    if (!confirmed) {
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      if (dataMode === "local") {
        const nextTargetItems = [...targetOrder.items];
        order.items.forEach((item) => {
          const existing = nextTargetItems.find((entry) => entry.menuItemId === item.menuItemId);
          if (existing) {
            existing.quantity += item.quantity;
            existing.lineTotal = existing.quantity * existing.unitPrice;
          } else {
            nextTargetItems.push({
              ...item,
              id: createLocalId("local-item"),
              orderId: targetOrder.id,
            });
          }
        });

        const mergedTargetOrder: PosOrder = {
          ...targetOrder,
          items: nextTargetItems,
          totalAmount: sumItems(nextTargetItems),
        };
        const cancelledOrder: PosOrder = {
          ...order,
          status: "cancelled",
          note: `${targetOrder.orderNo} no'lu adisyona birleştirildi.`,
          totalAmount: 0,
          closedAt: new Date().toISOString(),
        };
        persistLocalSnapshot({
          tables,
          openOrders: openOrders
            .filter((entry) => entry.id !== order.id)
            .map((entry) => (entry.id === targetOrder.id ? mergedTargetOrder : entry)),
          historyOrders: [cancelledOrder, ...historyOrders],
          nextOrderNo: nextLocalOrderNo,
        });
        setSelectedTableId(targetTableId);
        setTargetTableId("");
        return;
      }

      const nextTargetItems = [...targetOrder.items];

      for (const item of order.items) {
        const existing = nextTargetItems.find((entry) => entry.menuItemId === item.menuItemId);
        if (existing) {
          existing.quantity += item.quantity;
          existing.lineTotal = existing.quantity * existing.unitPrice;
          await supabaseFetch(
            "pos_order_items",
            new URLSearchParams({ id: `eq.${existing.id}` }),
            undefined,
            {
              method: "PATCH",
              headers: { Prefer: "return=minimal" },
              body: JSON.stringify({
                quantity: existing.quantity,
                updated_at: new Date().toISOString(),
              }),
            },
          );
        } else {
          nextTargetItems.push(item);
          await supabaseFetch("pos_order_items", undefined, undefined, {
            method: "POST",
            headers: { Prefer: "return=minimal" },
            body: JSON.stringify({
              order_id: targetOrder.id,
              menu_item_id: item.menuItemId,
              name_snapshot: item.name,
              unit_price: item.unitPrice,
              quantity: item.quantity,
            }),
          });
        }
      }

      await patchOrderTotal(targetOrder.id, sumItems(nextTargetItems));
      await supabaseFetch(
        "pos_orders",
        new URLSearchParams({ id: `eq.${order.id}` }),
        undefined,
        {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({
            status: "cancelled",
            note: `${targetOrder.orderNo} no'lu adisyona birleştirildi.`,
            total_amount: 0,
            closed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }),
        },
      );

      setSelectedTableId(targetTableId);
      setTargetTableId("");
      await refreshPosState();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Masalar birleştirilemedi.");
    } finally {
      setBusy(false);
    }
  }

  async function updateNote(order: PosOrder) {
    const note = window.prompt("Adisyon notu", order.note ?? "");
    if (note === null) {
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      if (dataMode === "local") {
        upsertLocalOrder({
          ...order,
          note: note.trim() || null,
        });
        return;
      }

      await supabaseFetch(
        "pos_orders",
        new URLSearchParams({ id: `eq.${order.id}` }),
        undefined,
        {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({
            note: note.trim() || null,
            updated_at: new Date().toISOString(),
          }),
        },
      );
      await refreshPosState();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Not kaydedilemedi.");
    } finally {
      setBusy(false);
    }
  }

  async function unlockReports() {
    if (!pin.trim()) {
      return;
    }

    const expected = settings.reportPinHash || DEFAULT_PIN_HASH_BY_SLUG[menu.business.slug];
    const actual = await sha256Hex(`${menu.business.slug}:${pin}`);
    if (actual === expected) {
      setReportsUnlocked(true);
      setPin("");
      setMessage("");
    } else {
      setMessage("PIN hatalı.");
      setPin("");
    }
  }

  function downloadDailyReport() {
    const dateLabel = reportDateLabel(activeReportDate);
    const rows = paidReportOrders
      .map((order) => {
        const items = order.items
          .map((item) => `${item.quantity} x ${item.name} (${formatPrice(item.lineTotal)})`)
          .join(", ");
        return `
          <tr>
            <td>${escapeHtml(timeOnly(order.closedAt))}</td>
            <td>${escapeHtml(tableTitle(order, tables))}</td>
            <td>#${order.orderNo}</td>
            <td>${escapeHtml(paymentLabel(order.paymentSummary, order.payments))}</td>
            <td>${escapeHtml(items)}</td>
            <td class="amount">${escapeHtml(formatPrice(order.totalAmount))}</td>
          </tr>
        `;
      })
      .join("");
    const sellerRows = bestSellers
      .map(
        (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${escapeHtml(item.name)}</td>
            <td>${item.quantity} adet</td>
            <td class="amount">${escapeHtml(formatPrice(item.total))}</td>
          </tr>
        `,
      )
      .join("");
    const html = `<!doctype html>
      <html lang="tr">
        <head>
          <meta charset="utf-8" />
          <title>${escapeHtml(profile.displayName)} Günlük Rapor - ${escapeHtml(reportDateShortLabel(activeReportDate))}</title>
          <style>
            body { color: #2f241c; font-family: Arial, sans-serif; margin: 28px; }
            h1 { font-size: 28px; margin: 0 0 6px; }
            h2 { border-top: 1px solid #eadfd4; font-size: 18px; margin: 26px 0 12px; padding-top: 16px; }
            .muted { color: #74695f; }
            .stats { display: grid; gap: 10px; grid-template-columns: repeat(4, 1fr); margin: 24px 0; }
            .stat { border: 1px solid #eadfd4; border-radius: 10px; padding: 14px; }
            .stat span { color: #74695f; display: block; font-size: 12px; margin-bottom: 6px; }
            .stat strong { color: #c95700; font-size: 22px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border-bottom: 1px solid #eadfd4; font-size: 13px; padding: 10px 8px; text-align: left; vertical-align: top; }
            th { color: #74695f; font-size: 12px; }
            .amount { color: #c95700; font-weight: 800; text-align: right; white-space: nowrap; }
            @media print { body { margin: 16px; } .stats { grid-template-columns: repeat(4, 1fr); } }
          </style>
        </head>
        <body>
          <h1>${escapeHtml(profile.displayName)} Günlük Rapor</h1>
          <div class="muted">${escapeHtml(dateLabel)} · ${escapeHtml(reportDateShortLabel(activeReportDate))}</div>
          <div class="stats">
            <div class="stat"><span>Toplam Ciro</span><strong>${escapeHtml(formatPrice(reportTotal))}</strong></div>
            <div class="stat"><span>Nakit</span><strong>${escapeHtml(formatPrice(cashTotal))}</strong></div>
            <div class="stat"><span>Kart</span><strong>${escapeHtml(formatPrice(cardTotal))}</strong></div>
            <div class="stat"><span>Adisyon</span><strong>${paidReportOrders.length}</strong></div>
          </div>
          <h2>En Çok Satan Ürünler</h2>
          <table>
            <thead><tr><th>#</th><th>Ürün</th><th>Adet</th><th class="amount">Ciro</th></tr></thead>
            <tbody>${sellerRows || `<tr><td colspan="4">Bu gün için satış yok.</td></tr>`}</tbody>
          </table>
          <h2>İşlemler</h2>
          <table>
            <thead><tr><th>Saat</th><th>Masa/Kasa</th><th>Adisyon</th><th>Ödeme</th><th>Ürünler</th><th class="amount">Tutar</th></tr></thead>
            <tbody>${rows || `<tr><td colspan="6">Bu gün için işlem yok.</td></tr>`}</tbody>
          </table>
        </body>
      </html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${menu.business.slug}-gunluk-rapor-${activeReportDate}.html`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  const currentPaymentOrder = payment
    ? openOrders.find((order) => order.id === payment.orderId) ?? null
    : null;
  const paymentCash = payment ? Number(payment.cash || 0) : 0;
  const paymentCard = payment ? Number(payment.card || 0) : 0;
  const paymentRemaining = currentPaymentOrder
    ? currentPaymentOrder.totalAmount - paymentCash - paymentCard
    : 0;

  return (
    <main className={`pos-shell ${busy ? "is-busy" : ""}`}>
      <header className="pos-topbar">
        <div className="pos-brand">
          <strong>{profile.displayName}</strong>
          <span>Adisyon</span>
        </div>
        <div className="pos-clock">
          {now ? `${readableDate(now)} · ${readableTime(now)}` : "Saat hazırlanıyor"}
        </div>
        <div className="pos-top-tools">
          <div className="pos-search">
            <span aria-hidden="true">⌕</span>
            <input
              value={activeView === "history" ? historySearch : search}
              onChange={(event) =>
                activeView === "history" ? setHistorySearch(event.target.value) : setSearch(event.target.value)
              }
              placeholder="Ürün, masa veya adisyon ara"
              aria-label="Ara"
            />
          </div>
        </div>
      </header>

      <div className="pos-body">
        <nav className="pos-nav" aria-label="POS menüsü">
          <button
            className={activeView === "tables" || activeView === "table" ? "active" : ""}
            onClick={() => switchView("tables")}
            type="button"
          >
            <span>▦</span>
            Masalar
          </button>
          <button
            className={`pos-nav-cash ${activeView === "cash" ? "active" : ""}`}
            onClick={() => switchView("cash")}
            type="button"
          >
            <span>$</span>
            Kasa
          </button>
          <button
            className={activeView === "history" ? "active" : ""}
            onClick={() => switchView("history")}
            type="button"
          >
            <span>↺</span>
            Geçmiş
          </button>
          <button
            className={activeView === "reports" ? "active" : ""}
            onClick={() => switchView("reports")}
            type="button"
          >
            <span>▥</span>
            Raporlar
          </button>
        </nav>

        <section className="pos-content">
          {message ? <p className="pos-message">{message}</p> : null}

          {activeView === "tables" ? (
            <TablesView
              now={now ?? new Date(0)}
              onOpenCash={() => switchView("cash")}
              onSelectTable={(table) => {
                setSelectedTableId(table.id);
                setTargetTableId("");
                switchView("table");
              }}
              openOrders={openOrders}
              search={search}
              tables={tables}
            />
          ) : null}

          {activeView === "table" ? (
            <OrderView
              activeOrder={selectedTableOrder}
              activeTitle={selectedTable?.name ?? "Masa"}
              categories={menu.categories}
              favoriteItems={favoriteItems}
              onBack={() => switchView("tables")}
              onAddItem={addItem}
              onAddManualItem={addManualItem}
              onCancelOrder={cancelOrder}
              onChangeQuantity={changeQuantity}
              onMerge={mergeOrder}
              onMove={moveOrder}
              onOpenPayment={openPayment}
              onUpdateNote={updateNote}
              products={visibleItems}
              selectedCategoryId={selectedCategoryId}
              setSelectedCategoryId={setSelectedCategoryId}
              setTargetTableId={setTargetTableId}
              tableOptions={tables.filter((table) => table.id !== selectedTableId)}
              targetTableId={targetTableId}
            />
          ) : null}

          {activeView === "cash" ? (
            <OrderView
              activeOrder={counterOrder}
              activeTitle="Kasa"
              categories={menu.categories}
              favoriteItems={favoriteItems}
              isCounter
              onBack={() => undefined}
              onAddItem={addItem}
              onAddManualItem={addManualItem}
              onCancelOrder={cancelOrder}
              onChangeQuantity={changeQuantity}
              onMerge={mergeOrder}
              onMove={moveOrder}
              onOpenPayment={openPayment}
              onUpdateNote={updateNote}
              products={visibleItems}
              selectedCategoryId={selectedCategoryId}
              setSelectedCategoryId={setSelectedCategoryId}
              setTargetTableId={setTargetTableId}
              tableOptions={[]}
              targetTableId=""
            />
          ) : null}

          {activeView === "history" ? (
            <HistoryView
              historyOrders={filteredHistory}
              selectedOrder={selectedHistoryOrder}
              selectedOrderId={selectedHistoryId}
              setSelectedOrderId={setSelectedHistoryId}
              tables={tables}
            />
          ) : null}

          {activeView === "reports" ? (
            reportsUnlocked ? (
              <ReportsView
                bestSellers={bestSellers}
                cardTotal={cardTotal}
                cashTotal={cashTotal}
                cancelledOrders={cancelledReportOrders}
                onDownload={downloadDailyReport}
                onLock={() => {
                  setReportsUnlocked(false);
                  setPin("");
                }}
                paidOrders={paidReportOrders}
                reportDate={activeReportDate}
                reportDays={reportDayOptions}
                reportTotal={reportTotal}
                setReportDate={setSelectedReportDate}
                tables={tables}
              />
            ) : (
              <PinView
                onSubmit={unlockReports}
                pin={pin}
                setPin={setPin}
              />
            )
          ) : null}
        </section>
      </div>

      {payment && currentPaymentOrder ? (
        <PaymentModal
          cash={payment.cash}
          card={payment.card}
          method={payment.method}
          onClose={() => setPayment(null)}
          onComplete={completePayment}
          order={currentPaymentOrder}
          remaining={paymentRemaining}
          setCash={(cash) => setPayment((current) => (current ? { ...current, cash } : current))}
          setCard={(card) => setPayment((current) => (current ? { ...current, card } : current))}
          setMethod={(method) =>
            setPayment((current) => {
              if (!current) {
                return current;
              }
              const total = String(currentPaymentOrder.totalAmount);
              return {
                ...current,
                method,
                cash: method === "cash" ? total : method === "mixed" ? "" : "0",
                card: method === "card" ? total : method === "mixed" ? "" : "0",
              };
            })
          }
        />
      ) : null}
    </main>
  );
}

function TablesView({
  now,
  onOpenCash,
  onSelectTable,
  openOrders,
  search,
  tables,
}: {
  now: Date;
  onOpenCash: () => void;
  onSelectTable: (table: PosTable) => void;
  openOrders: PosOrder[];
  search: string;
  tables: PosTable[];
}) {
  const visibleTables = search.trim()
    ? tables.filter((table) => matchesSearch(table.name, search))
    : tables;
  const tableGroups = Array.from(
    visibleTables
      .reduce((groups, table) => {
        const area = normalizeArea(table.area);
        const current = groups.get(area) ?? [];
        current.push(table);
        groups.set(area, current);
        return groups;
      }, new Map<string, PosTable[]>())
      .entries(),
  ).sort(([areaA], [areaB]) => areaSort(areaA) - areaSort(areaB) || areaA.localeCompare(areaB, "tr-TR"));
  const busyTableCount = tables.filter((table) =>
    openOrders.some((order) => order.tableId === table.id),
  ).length;
  const indoorCount = tables.filter((table) => normalizeArea(table.area) === "İÇERİ").length;
  const outdoorCount = tables.filter((table) => normalizeArea(table.area) === "DIŞARI").length;

  return (
    <>
      <div className="pos-screen-head">
        <div>
          <p>Salon</p>
          <h1>Masalar</h1>
        </div>
        <button className="pos-primary pos-cash-cta" onClick={onOpenCash} type="button">
          Kasa Satışı
        </button>
      </div>

      <div className="pos-mini-stats">
        <div>
          <span>Açık Adisyon</span>
          <strong>{openOrders.filter((order) => order.source === "table").length}</strong>
        </div>
        <div>
          <span>Boş Masa</span>
          <strong>{Math.max(0, tables.length - busyTableCount)}</strong>
        </div>
        <div>
          <span>Yerleşim</span>
          <strong>{indoorCount} iç · {outdoorCount} dış</strong>
        </div>
      </div>

      <div className="pos-table-layout">
        {tableGroups.length > 0 ? tableGroups.map(([area, groupTables], index) => (
          <Fragment key={area}>
            {index > 0 ? <div className="pos-table-divider" aria-hidden="true" /> : null}
            <section className={`pos-table-zone ${area === "İÇERİ" ? "indoor" : "outdoor"}`}>
              <div className="pos-zone-head">
                <div className="pos-zone-label">{area === "DIŞARI" ? "☼" : "▦"} {area}</div>
                <span>
                  {groupTables.filter((table) => openOrders.some((order) => order.tableId === table.id)).length} açık ·{" "}
                  {groupTables.length} masa
                </span>
              </div>
              <div className="pos-table-grid">
                {groupTables.map((table) => {
                  const order = openOrders.find((entry) => entry.tableId === table.id);
                  const openMinutes = order ? minutesOpen(order.openedAt, now) : 0;
                  const state = order ? (openMinutes >= 60 ? "late" : "busy") : "empty";

                  return (
                    <button
                      className={`pos-table-card ${state}`}
                      key={table.id}
                      onClick={() => onSelectTable(table)}
                      type="button"
                    >
                      <span className="pos-table-icon">▦</span>
                      <strong>{table.name}</strong>
                      {order ? (
                        <span className="pos-table-meta">
                          {formatPrice(order.totalAmount)} · {openMinutes} dk
                        </span>
                      ) : (
                        <span className="pos-empty-pill">BOŞ</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          </Fragment>
        )) : (
          <div className="pos-empty-state">
            Masa bulunamadı.
          </div>
        )}
      </div>
    </>
  );
}

function OrderView({
  activeOrder,
  activeTitle,
  categories,
  favoriteItems,
  isCounter = false,
  onAddItem,
  onAddManualItem,
  onBack,
  onCancelOrder,
  onChangeQuantity,
  onMerge,
  onMove,
  onOpenPayment,
  onUpdateNote,
  products,
  selectedCategoryId,
  setSelectedCategoryId,
  setTargetTableId,
  tableOptions,
  targetTableId,
}: {
  activeOrder: PosOrder | null;
  activeTitle: string;
  categories: MenuCategory[];
  favoriteItems: MenuItem[];
  isCounter?: boolean;
  onAddItem: (item: MenuItem) => void;
  onAddManualItem: (input: ManualItemInput) => Promise<boolean>;
  onBack: () => void;
  onCancelOrder: (order: PosOrder) => void;
  onChangeQuantity: (order: PosOrder, item: PosOrderItem, change: -1 | 1) => void;
  onMerge: (order: PosOrder) => void;
  onMove: (order: PosOrder) => void;
  onOpenPayment: (order: PosOrder, method?: PaymentMethod) => void;
  onUpdateNote: (order: PosOrder) => void;
  products: MenuItem[];
  selectedCategoryId: string;
  setSelectedCategoryId: (id: string) => void;
  setTargetTableId: (id: string) => void;
  tableOptions: PosTable[];
  targetTableId: string;
}) {
  const [manualName, setManualName] = useState("");
  const [manualAmount, setManualAmount] = useState("");
  const itemImages = useMemo(
    () =>
      new Map(
        categories
          .flatMap((category) => category.items)
          .filter((item) => item.imageUrl)
          .map((item) => [item.id, item.imageUrl as string]),
      ),
    [categories],
  );

  async function submitManualItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const wasAdded = await onAddManualItem({
      name: manualName.trim(),
      amountInput: manualAmount,
    });

    if (wasAdded) {
      setManualName("");
      setManualAmount("");
    }
  }

  return (
    <>
      <div className="pos-screen-head compact">
        <div>
          {isCounter ? (
            <p>Masasız hızlı satış</p>
          ) : (
            <button className="pos-back-link" onClick={onBack} type="button">
              ‹ Masalar
            </button>
          )}
          <h1>{activeTitle}</h1>
        </div>
        <div className="pos-head-actions">
          {activeOrder ? <span>{activeOrder.items.length} ürün</span> : <span>Yeni adisyon</span>}
          {activeOrder ? <span>#{activeOrder.orderNo}</span> : null}
        </div>
      </div>

      {!isCounter ? (
        <div className="pos-action-strip">
          <select
            disabled={!activeOrder}
            value={targetTableId}
            onChange={(event) => setTargetTableId(event.target.value)}
            aria-label="Hedef masa"
          >
            <option value="">Hedef masa seç</option>
            {tableOptions.map((table) => (
              <option value={table.id} key={table.id}>
                {table.name}
              </option>
            ))}
          </select>
          <button disabled={!activeOrder} onClick={() => activeOrder && onMove(activeOrder)} type="button">
            Masa Taşı
          </button>
          <button disabled={!activeOrder} onClick={() => activeOrder && onMerge(activeOrder)} type="button">
            Masa Birleştir
          </button>
          <button disabled={!activeOrder} onClick={() => activeOrder && onUpdateNote(activeOrder)} type="button">
            Not
          </button>
          <button
            className="danger"
            disabled={!activeOrder}
            onClick={() => activeOrder && onCancelOrder(activeOrder)}
            type="button"
          >
            İptal
          </button>
        </div>
      ) : null}

      <div className="pos-order-grid">
        <aside className="pos-category-rail" aria-label="Ürün kategorileri">
          <button
            className={selectedCategoryId === "favorites" ? "active" : ""}
            onClick={() => setSelectedCategoryId("favorites")}
            type="button"
          >
            ★ Favoriler
            <small>{favoriteItems.length} ürün</small>
          </button>
          {categories.map((category) => (
            <button
              className={selectedCategoryId === category.id ? "active" : ""}
              key={category.id}
              onClick={() => setSelectedCategoryId(category.id)}
              type="button"
            >
              {category.name}
              <small>{category.items.filter((item) => item.price !== null).length} ürün</small>
            </button>
          ))}
        </aside>

        <div className="pos-products-grid">
          {products.map((item) => (
            <button
              className="pos-product-card"
              disabled={!item.isAvailable || item.price === null}
              key={item.id}
              onClick={() => onAddItem(item)}
              type="button"
            >
              <span
                aria-hidden="true"
                className={`pos-product-visual ${item.imageUrl ? "has-image" : ""}`}
                style={item.imageUrl ? imageBackgroundStyle(item.imageUrl) : undefined}
              >
                {item.imageUrl ? "" : itemInitials(item.name)}
              </span>
              <strong>{item.name}</strong>
              <em>{formatPrice(item.price)}</em>
              {!item.isAvailable ? <small>Bitti</small> : null}
            </button>
          ))}
        </div>

        <aside className="pos-basket">
          <div className="pos-basket-head">
            <h2>{activeTitle}</h2>
            {activeOrder ? <span>#{activeOrder.orderNo}</span> : <span>Boş</span>}
          </div>

          {activeOrder && activeOrder.items.length > 0 ? (
            <div className="pos-basket-lines">
              {activeOrder.items.map((item) => {
                const imageUrl = item.menuItemId ? itemImages.get(item.menuItemId) : null;

                return (
                  <div className="pos-basket-line" key={item.id}>
                    <i
                      aria-hidden="true"
                      className={`pos-basket-visual ${imageUrl ? "has-image" : ""}`}
                      style={imageUrl ? imageBackgroundStyle(imageUrl) : undefined}
                    >
                      {imageUrl ? "" : itemInitials(item.name)}
                    </i>
                    <div className="pos-basket-line-detail">
                      <strong>{item.name}</strong>
                      <span>{formatPrice(item.unitPrice)}</span>
                    </div>
                    <div className="pos-qty">
                      <button onClick={() => onChangeQuantity(activeOrder, item, -1)} type="button">
                        −
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => onChangeQuantity(activeOrder, item, 1)} type="button">
                        +
                      </button>
                    </div>
                    <em>{formatPrice(item.unitPrice * item.quantity)}</em>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="pos-empty-basket">
              Ürüne dokununca adisyona eklenir.
            </div>
          )}

          {activeOrder?.note ? <p className="pos-note">Not: {activeOrder.note}</p> : null}

          <form className="pos-manual-entry" onSubmit={submitManualItem}>
            <div className="pos-manual-head">
              <strong>Elle Tutar Ekle</strong>
              <span>Menü dışı veya hızlı giriş</span>
            </div>
            <div className="pos-manual-fields">
              <input
                aria-label="Elle girilen tutar açıklaması"
                maxLength={42}
                onChange={(event) => setManualName(event.target.value)}
                placeholder="Açıklama"
                value={manualName}
              />
              <label className="pos-manual-amount">
                <span>₺</span>
                <input
                  aria-label="Elle girilen tutar"
                  inputMode="decimal"
                  onChange={(event) => setManualAmount(event.target.value)}
                  placeholder="50"
                  value={manualAmount}
                />
              </label>
              <button disabled={!manualAmount.trim()} type="submit">
                Elle Gir
              </button>
            </div>
          </form>

          <div className="pos-total">
            <span>Toplam</span>
            <strong>{formatPrice(activeOrder?.totalAmount ?? 0)}</strong>
          </div>

          {isCounter ? (
            <div className="pos-pay-shortcuts">
              <button
                disabled={!activeOrder || activeOrder.totalAmount <= 0}
                onClick={() => activeOrder && onOpenPayment(activeOrder, "cash")}
                type="button"
              >
                Nakit
              </button>
              <button
                disabled={!activeOrder || activeOrder.totalAmount <= 0}
                onClick={() => activeOrder && onOpenPayment(activeOrder, "card")}
                type="button"
              >
                Kart
              </button>
              <button
                className="wide"
                disabled={!activeOrder || activeOrder.totalAmount <= 0}
                onClick={() => activeOrder && onOpenPayment(activeOrder, "mixed")}
                type="button"
              >
                Karma
              </button>
            </div>
          ) : (
            <button
              className="pos-pay-button"
              disabled={!activeOrder || activeOrder.totalAmount <= 0}
              onClick={() => activeOrder && onOpenPayment(activeOrder, "cash")}
              type="button"
            >
              Hesap Al
            </button>
          )}
        </aside>
      </div>
    </>
  );
}

function PaymentModal({
  cash,
  card,
  method,
  onClose,
  onComplete,
  order,
  remaining,
  setCash,
  setCard,
  setMethod,
}: {
  cash: string;
  card: string;
  method: PaymentMethod;
  onClose: () => void;
  onComplete: () => void;
  order: PosOrder;
  remaining: number;
  setCash: (value: string) => void;
  setCard: (value: string) => void;
  setMethod: (method: PaymentMethod) => void;
}) {
  return (
    <div className="pos-modal-backdrop" role="presentation">
      <section className="pos-payment-modal" role="dialog" aria-modal="true" aria-labelledby="payment-title">
        <div className="pos-modal-head">
          <h2 id="payment-title">Ödeme Al</h2>
          <button onClick={onClose} type="button" aria-label="Ödeme ekranını kapat">
            ×
          </button>
        </div>
        <div className="pos-payment-total">
          <span>{order.source === "counter" ? "Kasa" : "Masa"} #{order.orderNo}</span>
          <strong>{formatPrice(order.totalAmount)}</strong>
        </div>
        <div className="pos-methods">
          <button className={method === "cash" ? "active" : ""} onClick={() => setMethod("cash")} type="button">
            Nakit
          </button>
          <button className={method === "card" ? "active" : ""} onClick={() => setMethod("card")} type="button">
            Kart
          </button>
          <button className={method === "mixed" ? "active" : ""} onClick={() => setMethod("mixed")} type="button">
            Karma
          </button>
        </div>
        <div className="pos-split-fields">
          <label>
            Nakit
            <input
              disabled={method === "card"}
              inputMode="decimal"
              onChange={(event) => setCash(event.target.value)}
              value={cash}
            />
          </label>
          <label>
            Kart
            <input
              disabled={method === "cash"}
              inputMode="decimal"
              onChange={(event) => setCard(event.target.value)}
              value={card}
            />
          </label>
        </div>
        <div className={`pos-remaining ${Math.abs(remaining) < 0.01 ? "ok" : ""}`}>
          <span>Kalan</span>
          <strong>{formatPrice(remaining)}</strong>
        </div>
        <button className="pos-complete-payment" onClick={onComplete} type="button">
          Ödemeyi Tamamla
        </button>
        <button className="pos-cancel-payment" onClick={onClose} type="button">
          İptal
        </button>
      </section>
    </div>
  );
}

function HistoryView({
  historyOrders,
  selectedOrder,
  selectedOrderId,
  setSelectedOrderId,
  tables,
}: {
  historyOrders: PosOrder[];
  selectedOrder: PosOrder | null;
  selectedOrderId: string;
  setSelectedOrderId: (id: string) => void;
  tables: PosTable[];
}) {
  const groupedOrders = useMemo(() => {
    const groups = new Map<string, PosOrder[]>();

    historyOrders.forEach((order) => {
      const key = dateKey(order.closedAt ?? order.openedAt);
      groups.set(key, [...(groups.get(key) ?? []), order]);
    });

    return Array.from(groups.entries())
      .map(([key, orders]) => ({
        key,
        orders,
        paidTotal: orders
          .filter((order) => order.status === "paid")
          .reduce((total, order) => total + order.totalAmount, 0),
      }))
      .sort((a, b) => b.key.localeCompare(a.key));
  }, [historyOrders]);

  return (
    <>
      <div className="pos-screen-head">
        <div>
          <p>Gün gün ayrılmış kayıtlar</p>
          <h1>Geçmiş Adisyonlar</h1>
        </div>
      </div>
      <div className="pos-history-grid">
        <div className="pos-history-list">
          <div className="pos-history-row header">
            <span>Adisyon</span>
            <span>Masa / Kasa</span>
            <span>Durum</span>
            <span>Tutar</span>
            <span>Saat</span>
          </div>
          {groupedOrders.map((group) => (
            <section className="pos-history-day" key={group.key}>
              <div className="pos-history-day-head">
                <strong>{reportDateLabel(group.key)}</strong>
                <span>
                  {group.orders.length} adisyon · {formatPrice(group.paidTotal)}
                </span>
              </div>
              {group.orders.map((order) => {
                const tableName = order.tableId
                  ? tables.find((table) => table.id === order.tableId)?.name ?? "Masa"
                  : "Kasa";
                return (
                  <button
                    className={`pos-history-row ${selectedOrderId === order.id ? "selected" : ""}`}
                    key={order.id}
                    onClick={() => setSelectedOrderId(order.id)}
                    type="button"
                  >
                    <span>#{order.orderNo}</span>
                    <span>{tableName}</span>
                    <span className={order.status === "paid" ? "paid" : "cancelled"}>
                      {order.status === "paid" ? "Ödendi" : "İptal"}
                    </span>
                    <strong>{formatPrice(order.totalAmount)}</strong>
                    <span>{timeOnly(order.closedAt)}</span>
                  </button>
                );
              })}
            </section>
          ))}
          {historyOrders.length === 0 ? (
            <div className="pos-empty-state compact">Adisyon kaydı yok.</div>
          ) : null}
        </div>
        <aside className="pos-history-detail">
          {selectedOrder ? (
            <>
              <div className="pos-detail-title">
                <h2>Adisyon #{selectedOrder.orderNo}</h2>
                <span className={selectedOrder.status === "paid" ? "paid" : "cancelled"}>
                  {selectedOrder.status === "paid" ? "ÖDENDİ" : "İPTAL"}
                </span>
              </div>
              <div className="pos-detail-times">
                <p>
                  Açılış <strong>{timeOnly(selectedOrder.openedAt)}</strong>
                </p>
                <p>
                  Kapanış <strong>{timeOnly(selectedOrder.closedAt)}</strong>
                </p>
              </div>
              <div className="pos-detail-lines">
                {selectedOrder.items.map((item) => (
                  <div key={item.id}>
                    <span>
                      {item.quantity} × {item.name}
                    </span>
                    <strong>{formatPrice(item.lineTotal)}</strong>
                  </div>
                ))}
              </div>
              <div className="pos-detail-total">
                <span>Toplam</span>
                <strong>{formatPrice(selectedOrder.totalAmount)}</strong>
              </div>
              <div className="pos-detail-payment">
                <span>Ödeme</span>
                <strong>{paymentLabel(selectedOrder.paymentSummary, selectedOrder.payments)}</strong>
              </div>
              {selectedOrder.note ? <p className="pos-note">Not: {selectedOrder.note}</p> : null}
            </>
          ) : (
            <p className="pos-empty-basket">Kapanmış adisyon seçilmedi.</p>
          )}
        </aside>
      </div>
    </>
  );
}

function PinView({
  onSubmit,
  pin,
  setPin,
}: {
  onSubmit: () => void;
  pin: string;
  setPin: (value: string) => void;
}) {
  function press(value: string) {
    if (pin.length < 6) {
      setPin(`${pin}${value}`);
    }
  }

  return (
    <div className="pos-pin-wrap">
      <section className="pos-pin-card">
        <h1>Raporlara Erişim</h1>
        <p>Bu alan işletme sahibine özeldir.</p>
        <div className="pos-pin-dots" aria-label={`${pin.length} hane girildi`}>
          {Array.from({ length: 6 }).map((_, index) => (
            <span className={index < pin.length ? "filled" : ""} key={index} />
          ))}
        </div>
        <div className="pos-keypad">
          {"123456789".split("").map((key) => (
            <button key={key} onClick={() => press(key)} type="button">
              {key}
            </button>
          ))}
          <button onClick={() => setPin(pin.slice(0, -1))} type="button">
            Sil
          </button>
          <button onClick={() => press("0")} type="button">
            0
          </button>
          <button onClick={() => setPin("")} type="button">
            Temizle
          </button>
        </div>
        <button className="pos-complete-payment" onClick={onSubmit} type="button">
          Giriş
        </button>
      </section>
    </div>
  );
}

function ReportsView({
  bestSellers,
  cardTotal,
  cashTotal,
  cancelledOrders,
  onDownload,
  onLock,
  paidOrders,
  reportDate,
  reportDays,
  reportTotal,
  setReportDate,
  tables,
}: {
  bestSellers: Array<{ name: string; quantity: number; total: number }>;
  cardTotal: number;
  cashTotal: number;
  cancelledOrders: PosOrder[];
  onDownload: () => void;
  onLock: () => void;
  paidOrders: PosOrder[];
  reportDate: string;
  reportDays: Array<{ key: string; total: number; count: number }>;
  reportTotal: number;
  setReportDate: (date: string) => void;
  tables: PosTable[];
}) {
  const averageOrder = paidOrders.length > 0 ? reportTotal / paidOrders.length : 0;
  const itemCount = paidOrders.reduce(
    (total, order) => total + order.items.reduce((sum, item) => sum + item.quantity, 0),
    0,
  );
  const firstOrder = paidOrders.at(-1);
  const lastOrder = paidOrders[0];

  return (
    <>
      <div className="pos-screen-head">
        <div>
          <p>{reportDateShortLabel(reportDate)}</p>
          <h1>Gün Sonu Raporu</h1>
        </div>
        <div className="pos-report-actions">
          <button className="pos-primary" onClick={onDownload} type="button">
            Günlük Rapor Al
          </button>
          <button className="pos-secondary" onClick={onLock} type="button">
            Raporları Kilitle
          </button>
        </div>
      </div>

      <div className="pos-report-page">
        <aside className="pos-report-days" aria-label="Günlük raporlar">
          <h2>Günlük Raporlar</h2>
          {reportDays.map((day) => (
            <button
              className={day.key === reportDate ? "active" : ""}
              key={day.key}
              onClick={() => setReportDate(day.key)}
              type="button"
            >
              <span>{reportDateLabel(day.key)}</span>
              <strong>{reportDateShortLabel(day.key)}</strong>
              <em>
                {day.count} adisyon · {formatPrice(day.total)}
              </em>
            </button>
          ))}
        </aside>

        <div className="pos-report-main">
          <div className="pos-report-banner">
            <div>
              <span>Seçili gün</span>
              <strong>{reportDateLabel(reportDate)}</strong>
            </div>
            <em>{reportDateShortLabel(reportDate)}</em>
          </div>

          <div className="pos-report-stats">
            <div>
              <span>Toplam Ciro</span>
              <strong>{formatPrice(reportTotal)}</strong>
            </div>
            <div>
              <span>Nakit</span>
              <strong>{formatPrice(cashTotal)}</strong>
            </div>
            <div>
              <span>Kart</span>
              <strong>{formatPrice(cardTotal)}</strong>
            </div>
            <div>
              <span>Adisyon</span>
              <strong>{paidOrders.length}</strong>
            </div>
          </div>

          <div className="pos-report-summary">
            <div>
              <span>Satılan Ürün</span>
              <strong>{itemCount}</strong>
            </div>
            <div>
              <span>Ortalama Adisyon</span>
              <strong>{formatPrice(averageOrder)}</strong>
            </div>
            <div>
              <span>İptal</span>
              <strong>{cancelledOrders.length}</strong>
            </div>
            <div>
              <span>İlk / Son</span>
              <strong>
                {firstOrder ? timeOnly(firstOrder.closedAt) : "--:--"} · {lastOrder ? timeOnly(lastOrder.closedAt) : "--:--"}
              </strong>
            </div>
          </div>

          <div className="pos-report-grid">
            <section>
              <h2>En Çok Satan Ürünler</h2>
              {bestSellers.length > 0 ? (
                bestSellers.map((item, index) => (
                  <div className="pos-rank-row" key={item.name}>
                    <span>{index + 1}</span>
                    <strong>{item.name}</strong>
                    <em>{item.quantity} adet</em>
                    <b>{formatPrice(item.total)}</b>
                  </div>
                ))
              ) : (
                <p className="pos-empty-basket">Bu gün için satış yok.</p>
              )}
            </section>
            <section>
              <h2>Son İşlemler</h2>
              {paidOrders.length > 0 ? (
                paidOrders.slice(0, 8).map((order) => (
                  <div className="pos-recent-row" key={order.id}>
                    <span>{timeOnly(order.closedAt)}</span>
                    <strong>{tableTitle(order, tables)} · #{order.orderNo}</strong>
                    <em>{paymentLabel(order.paymentSummary, order.payments)}</em>
                    <b>{formatPrice(order.totalAmount)}</b>
                  </div>
                ))
              ) : (
                <p className="pos-empty-basket">Bu gün için işlem yok.</p>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
