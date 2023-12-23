import { StateCreator } from "zustand";

export interface Payment {
  status: string;
  invoice?: string;
}

export interface PaymentSlice {
  payment: Payment | null;
  setPayment: (payment: Payment) => void;
}

export const createPaymentSlice: StateCreator<PaymentSlice> = (set) => ({
  payment: null,
  setPayment: (payment) => set(() => ({ payment })),
});
