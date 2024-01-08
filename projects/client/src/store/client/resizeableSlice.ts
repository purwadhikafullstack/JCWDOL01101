import { StateCreator } from "zustand";

export interface ResizeableSlice {
  isResizing: boolean;
  setIsResizing: (isResizing: boolean) => void;
}

export const createResizeableSlice: StateCreator<ResizeableSlice> = (set) => ({
  isResizing: false,
  setIsResizing: (isResizing) => set({ isResizing }),
});
