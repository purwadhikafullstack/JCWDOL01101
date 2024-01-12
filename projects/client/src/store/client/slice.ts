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
  name: string;
  service: string;
  description: string;
  cost: {
    value: number;
    etd: string;
    note: string;
  }[];
};

export interface ShippingFeeSlice {
  service: Service;
  isLoading: boolean;
  totalShipping: number;
  addShippingFee: (service: Service) => void;
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
  service: {
    name: "",
    service: "",
    description: "",
    cost: [],
  },
  isLoading: false,
  totalShipping: 0,
  getTotalShippingFee: () =>
    set((state) => ({
      totalShipping: state.service.cost[0].value,
    })),
  addShippingFee: (service: Service) =>
    set((state) => ({
      service,
    })),
  setLoading: (load: boolean) => set(() => ({ isLoading: load })),
  clear: () => set(() => ({ fee: {}, totalShipping: 0 })),
});
