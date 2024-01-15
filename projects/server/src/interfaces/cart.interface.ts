import { Status } from '.';

export interface Cart {
  id?: number;
  userId: number;
  status: Status;
}
