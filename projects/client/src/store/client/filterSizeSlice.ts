import { StateCreator } from "zustand";

export interface FilterSize {
  id: number;
  label: string;
}

export interface FilterSizeSlice {
  size: FilterSize[];
  setSize: (size: FilterSize[]) => void;
}
export const createFilterSizeSlice: StateCreator<FilterSizeSlice> = (set) => ({
  size: [],
  setSize: (size: FilterSize[]) => set(() => ({ size })),
});
