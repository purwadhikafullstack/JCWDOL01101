import { StateCreator } from "zustand";

export interface TotalPrice {
  total: number;
  addTotal: (by: number) => void;
}

export interface QuantitySlice {
  quantity: number;
  addQuantity: (by: number) => void;
}

type Service = {
  service: string;
  description: string;
  cost: {
    value: number;
    etd: string;
    note: string;
  }[];
};

export interface Fee {
  [productId: string]: Service;
}

export interface ShippingFeeSlice {
  fee: Fee;
  isLoading: boolean;
  totalShipping: number;
  addShippingFee: (cartProductId: number, fee: Service) => void;
  getTotalShippingFee: () => void;
  clear: () => void;
  setLoading: (state: boolean) => void;
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
  isLoading: false,
  totalShipping: 0,
  getTotalShippingFee: () =>
    set((state) => ({
      totalShipping: Object.values(state.fee).reduce(
        (prev, fee) => prev + Number(fee.cost[0].value),
        0
      ),
    })),
  addShippingFee: (cartProductId: number, fee: Service) =>
    set((state) => {
      return { fee: { ...state.fee, [cartProductId]: fee } };
    }),
  setLoading: (load: boolean) => set(() => ({ isLoading: load })),
  clear: () => set(() => ({ fee: {}, totalShipping: 0 })),
});
