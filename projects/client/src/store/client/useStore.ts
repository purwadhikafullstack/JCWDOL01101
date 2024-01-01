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
import { PaymentSlice, createPaymentSlice } from "./paymentSlice";

export const useBoundStore = create<
  TotalPrice &
    QuantitySlice &
    ShippingFeeSlice &
    ImageForm &
    LocationSlice &
    FilterSizeSlice &
    PaymentSlice
>()((...a) => ({
  ...createTotalPrice(...a),
  ...createQuantitySlice(...a),
  ...createShippingSlice(...a),
  ...createImageFormSlice(...a),
  ...createLocationSlice(...a),
  ...createFilterSizeSlice(...a),
  ...createPaymentSlice(...a),
}));
