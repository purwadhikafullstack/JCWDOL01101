export interface Address {
  id?: number;
  userId?: number;
  recepient: string;
  phone: string;
  label: string;
  cityId: string;
  address: string;
  notes?: string;
  lat: number;
  lng: number;
  isMain: boolean;
  isActive: boolean;
  deletedAt: Date | null;
}
