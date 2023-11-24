export interface Address {
  id?: number;
  userId?: number;
  recepient: string;
  phone: string;
  label: string;
  city: string;
  address: string;
  notes?: string;
  isMain: boolean;
  isActive: boolean;
  deletedAt: Date | null;
}
