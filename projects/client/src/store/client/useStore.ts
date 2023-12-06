import { create } from "zustand";
import {
  createTotalPrice,
  createQuantitySlice,
  createShippingSlice,
  TotalPrice,
  QuantitySlice,
  ShippingFeeSlice,
} from "./slice";
import { ImageForm, createImageFormSlice } from "./imageSlice";

export const useBoundStore = create<
  TotalPrice & QuantitySlice & ShippingFeeSlice & ImageForm
>()((...a) => ({
  ...createTotalPrice(...a),
  ...createQuantitySlice(...a),
  ...createShippingSlice(...a),
  ...createImageFormSlice(...a),
}));
