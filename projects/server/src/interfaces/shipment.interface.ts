export interface Shipment {
  id?: number;
  orderId?: number;
  status: string;
  fee: number;
  courier: string;
  etd: string;
}
