"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartItem = {
  /**
   * Line identity. A product sold in several sizes yields one line per size,
   * so this is `slug` for plain items and `slug::variantKey` for sized ones.
   */
  id: string;
  slug: string;
  name: string;
  price?: number; // PKR per unit — optional; custom/bulk items are quoted, not priced
  qty: number;
  image?: string;
  /** Size option key, for variant-priced products (e.g. "small"). */
  variant?: string;
  /** Human label for the chosen size, e.g. `9" × 12"`. */
  variantLabel?: string;
  /** Least quantity this line may drop to before it is removed. */
  minQty?: number;
  /** What the quantity counts ("sheets"), for display. */
  unitNoun?: string;
};

/** Build the line key for a product + optional size. */
export function lineId(slug: string, variant?: string) {
  return variant ? `${slug}::${variant}` : slug;
}

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  /** True when every line carries a unit price, i.e. the cart can be checked out. */
  isPriced: boolean;
  add: (item: Omit<CartItem, "qty" | "id">, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "boxit_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // Hydrate cart from storage on mount — the canonical client-only pattern.
      // Carts saved before lines carried an `id` are backfilled from the slug so
      // returning shoppers don't hit a cart whose buttons key on undefined.
      if (raw) {
        const stored = (JSON.parse(raw) as CartItem[]).map((i) => ({
          ...i,
          id: i.id ?? lineId(i.slug, i.variant),
        }));
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setItems(stored);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, hydrated]);

  const add = useCallback<CartContextValue["add"]>((item, qty = 1) => {
    const id = lineId(item.slug, item.variant);
    setItems((prev) => {
      // Same product in a different size is a separate line, so match on `id`.
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) => (i.id === id ? { ...i, qty: i.qty + qty } : i));
      }
      return [...prev, { ...item, id, qty }];
    });
    setOpen(true);
  }, []);

  const setQty = useCallback<CartContextValue["setQty"]>((id, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.id !== id)
        : prev.map((i) =>
            // Never let a line sit below its MOQ — the order API would reject it.
            i.id === id ? { ...i, qty: Math.max(qty, i.minQty ?? 1) } : i,
          ),
    );
  }, []);

  const remove = useCallback<CartContextValue["remove"]>((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { count, subtotal, isPriced } = useMemo(() => {
    return items.reduce(
      (acc, i) => {
        acc.count += i.qty;
        acc.subtotal += i.qty * (i.price ?? 0);
        if (i.price == null) acc.isPriced = false;
        return acc;
      },
      { count: 0, subtotal: 0, isPriced: items.length > 0 },
    );
  }, [items]);

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    isPriced,
    add,
    setQty,
    remove,
    clear,
    isOpen,
    setOpen,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export { formatPKR } from "@/lib/format";
