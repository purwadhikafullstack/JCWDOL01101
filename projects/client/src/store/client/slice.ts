import { StateCreator } from "zustand";

export interface TotalPrice {
  total: number;
  addTotal: (by: number) => void;
}

export interface QuantitySlice {
  quantity: number;
  addQuantity: (by: number) => void;
}

interface Fee {
  [productId: string]: number;
}

export interface ShippingFeeSlice {
  fee: Fee;
  totalShipping: number;
  addShippingFee: (productId: number, fee: number) => void;
  getTotalShippingFee: () => void;
  clear: () => void;
}

export const createTotalPrice: StateCreator<
  TotalPrice & QuantitySlice & ShippingFeeSlice,
  [],
  [],
  TotalPrice
> = (set) => ({
  total: 0,
  addTotal: (by: number) => set((state) => ({ total: state.total + by })),
});

export const createQuantitySlice: StateCreator<
  TotalPrice & QuantitySlice & ShippingFeeSlice,
  [],
  [],
  QuantitySlice
> = (set) => ({
  quantity: 0,
  addQuantity: (by: number) => set((state) => ({ quantity: by })),
});

export const createShippingSlice: StateCreator<
  TotalPrice & QuantitySlice & ShippingFeeSlice,
  [],
  [],
  ShippingFeeSlice
> = (set) => ({
  fee: {},
  totalShipping: 0,
  getTotalShippingFee: () =>
    set((state) => ({
      totalShipping: Object.values(state.fee).reduce(
        (prev, fee) => prev + fee,
        0
      ),
    })),
  addShippingFee: (productId: number, fee: number) =>
    set((state) => ({ fee: { ...state.fee, [productId]: fee } })),
  clear: () => set((state) => ({ fee: {}, totalShipping: 0 })),
});
