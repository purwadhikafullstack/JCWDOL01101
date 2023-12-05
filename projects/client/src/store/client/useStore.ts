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
import { CartSlice, createCartSlice } from "./cartSlice";

export const useBoundStore = create<
  TotalPrice & QuantitySlice & ShippingFeeSlice & ImageForm & CartSlice
>()((...a) => ({
  ...createTotalPrice(...a),
  ...createQuantitySlice(...a),
  ...createShippingSlice(...a),
  ...createImageFormSlice(...a),
  ...createCartSlice(...a),
}));
