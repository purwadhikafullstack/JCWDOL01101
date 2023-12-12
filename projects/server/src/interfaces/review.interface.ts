import { Status } from '.';

export interface Review {
  id?: number;
  productId?: number;
  userId?: number;
  rating: number;
  nickname: string;
  title: string;
  status: Status;
  comment: string;
}
