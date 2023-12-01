export type Status = 'ACTIVE' | 'DEACTIVATED' | 'DELETED';
export type Role = 'ADMIN' | 'WAREHOUSE ADMIN' | 'CUSTOMER';

export interface DokuResponse {
  service: {
    id: string;
  };
  order: {
    invoice_number: string;
    virtual_account_number: string;
  };
  transaction: {
    status: string;
    date: string;
  };
}
