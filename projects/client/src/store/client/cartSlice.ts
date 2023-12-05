import { Cart, cartProducts } from "@/context/UserContext";
import { StateCreator } from "zustand";

interface CartItem extends cartProducts {
  selected: boolean;
}
export interface CartSlice {
  carts: CartItem[];
  initializeCarts: (carts: CartItem[]) => void;
  setSelectedCart: (productId: number, value: boolean) => void;
  toggleSelectedCarts: () => void;
}

export const createCartSlice: StateCreator<CartSlice> = (set) => ({
  carts: [],
  initializeCarts: (carts: CartItem[]) => set(() => ({ carts: carts })),
  setSelectedCart: (productId: number, value: boolean) =>
    set((state) => {
      const newCarts = state.carts.map((cart) =>
        cart.productId === productId ? { ...cart, selected: value } : cart
      );

      return { carts: newCarts };
    }),
  toggleSelectedCarts: () =>
    set((state) => {
      const allSelected = state.carts.every((cart) => cart.selected);

      const newCarts = state.carts.map((cart) => ({
        ...cart,
        selected: !allSelected,
      }));
      return { carts: newCarts };
    }),
});
