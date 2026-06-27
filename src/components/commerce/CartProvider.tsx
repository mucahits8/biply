"use client";

import { createContext, useContext, useMemo, useReducer } from "react";

type CartItemKind = "package" | "product" | "upsell";

export type CartItem = {
  id: string;
  kind: CartItemKind;
  name: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isCartOpen: boolean;
};

type AddItemInput = Omit<CartItem, "quantity"> & { quantity?: number };

type CartContextValue = {
  items: CartItem[];
  total: number;
  count: number;
  selectedPackage?: CartItem;
  isCartOpen: boolean;
  addItem: (item: AddItemInput) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
};

type CartAction =
  | { type: "add"; item: AddItemInput }
  | { type: "remove"; id: string }
  | { type: "quantity"; id: string; quantity: number }
  | { type: "clear" }
  | { type: "open" }
  | { type: "close" };

const CartContext = createContext<CartContextValue | null>(null);

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "add": {
      const incomingQuantity = action.item.quantity ?? 1;
      const withoutPackage =
        action.item.kind === "package" ? state.items.filter((item) => item.kind !== "package") : state.items;
      const existing = withoutPackage.find((item) => item.id === action.item.id);
      const items = existing
        ? withoutPackage.map((item) =>
            item.id === action.item.id ? { ...item, quantity: item.quantity + incomingQuantity } : item,
          )
        : [...withoutPackage, { ...action.item, quantity: incomingQuantity }];

      return { ...state, items, isCartOpen: true };
    }
    case "remove":
      return { ...state, items: state.items.filter((item) => item.id !== action.id) };
    case "quantity":
      return {
        ...state,
        items: state.items
          .map((item) => (item.id === action.id ? { ...item, quantity: action.quantity } : item))
          .filter((item) => item.quantity > 0),
      };
    case "clear":
      return { ...state, items: [] };
    case "open":
      return { ...state, isCartOpen: true };
    case "close":
      return { ...state, isCartOpen: false };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], isCartOpen: false });
  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const selectedPackage = state.items.find((item) => item.kind === "package");

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      total,
      count,
      selectedPackage,
      isCartOpen: state.isCartOpen,
      addItem: (item) => dispatch({ type: "add", item }),
      removeItem: (id) => dispatch({ type: "remove", id }),
      updateQuantity: (id, quantity) => dispatch({ type: "quantity", id, quantity }),
      clearCart: () => dispatch({ type: "clear" }),
      openCart: () => dispatch({ type: "open" }),
      closeCart: () => dispatch({ type: "close" }),
    }),
    [count, selectedPackage, state.isCartOpen, state.items, total],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
}
