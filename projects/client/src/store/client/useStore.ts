import { create } from "zustand";
import {
  createTotalPrice,
  createQuantitySlice,
  createShippingSlice,
  TotalPrice,
  QuantitySlice,
  ShippingFeeSlice,
} from "./slice";

export const useBoundStore = create<
  TotalPrice & QuantitySlice & ShippingFeeSlice
>()((...a) => ({
  ...createTotalPrice(...a),
  ...createQuantitySlice(...a),
  ...createShippingSlice(...a),
}));
