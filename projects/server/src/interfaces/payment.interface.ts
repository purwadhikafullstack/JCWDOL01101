export interface Payment {
  id?: number | undefined;
  orderId?: number;
  method: string;
  virtualAccount: string;
  status: string;
  paymentDate: Date;
  expiredDate:Date;
}
