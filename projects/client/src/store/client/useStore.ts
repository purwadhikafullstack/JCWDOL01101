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
import { FilterSizeSlice, createFilterSizeSlice } from "./filterSizeSlice";
import { ResizeableSlice, createResizeableSlice } from "./resizeableSlice";

export const useBoundStore = create<
  TotalPrice &
    QuantitySlice &
    ShippingFeeSlice &
    ImageForm &
    FilterSizeSlice &
    ResizeableSlice
>()((...a) => ({
  ...createTotalPrice(...a),
  ...createQuantitySlice(...a),
  ...createShippingSlice(...a),
  ...createImageFormSlice(...a),
  ...createFilterSizeSlice(...a),
  ...createResizeableSlice(...a),
}));
