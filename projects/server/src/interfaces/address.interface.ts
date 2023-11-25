export interface Address {
  id?: number;
  userId?: number;
  recepient: string;
  phone: string;
  label: string;
  cityId: number;
  address: string;
  notes?: string;
  isPrimary: boolean;
  isActive: boolean;
  deletedAt: Date | null;
}
