'use client';

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useMemo,
} from 'react';
import type { CartLine, ResolvedCartLine, VariantKey } from '@/types';
import { menuItems } from '@/lib/menu-data';
import { resolveLine } from '@/lib/menu-helpers';

// ─── State & Actions ──────────────────────────────────────────────────────────

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD'; itemId: string; variantKey: VariantKey }
  | { type: 'INC'; itemId: string; variantKey: VariantKey }
  | { type: 'DEC'; itemId: string; variantKey: VariantKey }
  | { type: 'REMOVE'; itemId: string; variantKey: VariantKey }
  | { type: 'CLEAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'HYDRATE'; lines: CartLine[] };

function lineKey(itemId: string, variantKey: VariantKey): string {
  return `${itemId}::${variantKey}`;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, lines: action.lines };

    case 'ADD': {
      const key = lineKey(action.itemId, action.variantKey);
      const exists = state.lines.find(
        (l) => lineKey(l.itemId, l.variantKey) === key
      );
      if (exists) {
        return {
          ...state,
          lines: state.lines.map((l) =>
            lineKey(l.itemId, l.variantKey) === key
              ? { ...l, qty: l.qty + 1 }
              : l
          ),
        };
      }
      return {
        ...state,
        lines: [
          ...state.lines,
          { itemId: action.itemId, variantKey: action.variantKey, qty: 1 },
        ],
      };
    }

    case 'INC': {
      const key = lineKey(action.itemId, action.variantKey);
      return {
        ...state,
        lines: state.lines.map((l) =>
          lineKey(l.itemId, l.variantKey) === key
            ? { ...l, qty: l.qty + 1 }
            : l
        ),
      };
    }

    case 'DEC': {
      const key = lineKey(action.itemId, action.variantKey);
      const updated = state.lines
        .map((l) =>
          lineKey(l.itemId, l.variantKey) === key
            ? { ...l, qty: l.qty - 1 }
            : l
        )
        .filter((l) => l.qty > 0);
      return { ...state, lines: updated };
    }

    case 'REMOVE': {
      const key = lineKey(action.itemId, action.variantKey);
      return {
        ...state,
        lines: state.lines.filter(
          (l) => lineKey(l.itemId, l.variantKey) !== key
        ),
      };
    }

    case 'CLEAR':
      return { ...state, lines: [] };

    case 'OPEN':
      return { ...state, isOpen: true };

    case 'CLOSE':
      return { ...state, isOpen: false };

    default:
      return state;
  }
}

const STORAGE_KEY = 'txs-cart';

// ─── Context shape ────────────────────────────────────────────────────────────

interface CartContextValue {
  lines: CartLine[];
  resolvedLines: ResolvedCartLine[];
  itemCount: number;
  subtotal: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  add: (itemId: string, variantKey: VariantKey) => void;
  increment: (itemId: string, variantKey: VariantKey) => void;
  decrement: (itemId: string, variantKey: VariantKey) => void;
  remove: (itemId: string, variantKey: VariantKey) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    lines: [],
    isOpen: false,
  });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        if (Array.isArray(parsed)) {
          dispatch({ type: 'HYDRATE', lines: parsed });
        }
      }
    } catch {
      // ignore malformed storage
    }
  }, []);

  // Debounced persist to localStorage
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
      } catch {
        // ignore storage errors
      }
    }, 200);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [state.lines]);

  // Derived values
  const resolvedLines = useMemo<ResolvedCartLine[]>(() => {
    return state.lines.flatMap((line) => {
      try {
        return [resolveLine(line, menuItems)];
      } catch {
        return [];
      }
    });
  }, [state.lines]);

  const itemCount = useMemo(
    () => state.lines.reduce((sum, l) => sum + l.qty, 0),
    [state.lines]
  );

  const subtotal = useMemo(
    () => resolvedLines.reduce((sum, l) => sum + l.lineTotal, 0),
    [resolvedLines]
  );

  const value: CartContextValue = {
    lines: state.lines,
    resolvedLines,
    itemCount,
    subtotal,
    isOpen: state.isOpen,
    open: () => dispatch({ type: 'OPEN' }),
    close: () => dispatch({ type: 'CLOSE' }),
    add: (itemId, variantKey) => dispatch({ type: 'ADD', itemId, variantKey }),
    increment: (itemId, variantKey) =>
      dispatch({ type: 'INC', itemId, variantKey }),
    decrement: (itemId, variantKey) =>
      dispatch({ type: 'DEC', itemId, variantKey }),
    remove: (itemId, variantKey) =>
      dispatch({ type: 'REMOVE', itemId, variantKey }),
    clear: () => dispatch({ type: 'CLEAR' }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
