import { StateCreator } from "zustand";

export interface Location {
  lat: number;
  lng: number;
}

export interface LocationSlice {
  location: Location | null;
  setLocation: (location: Location) => void;
}

export const createLocationSlice: StateCreator<LocationSlice> = (set) => ({
  location: null,
  setLocation: (location: Location) => set(() => ({ location })),
});
