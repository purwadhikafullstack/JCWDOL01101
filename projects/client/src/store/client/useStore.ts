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
import { LocationSlice, createLocationSlice } from "./geolocationSlice";
import { FilterSizeSlice, createFilterSizeSlice } from "./filterSizeSlice";

export const useBoundStore = create<
  TotalPrice &
    QuantitySlice &
    ShippingFeeSlice &
    ImageForm &
    LocationSlice &
    FilterSizeSlice
>()((...a) => ({
  ...createTotalPrice(...a),
  ...createQuantitySlice(...a),
  ...createShippingSlice(...a),
  ...createImageFormSlice(...a),
  ...createLocationSlice(...a),
  ...createFilterSizeSlice(...a),
}));
