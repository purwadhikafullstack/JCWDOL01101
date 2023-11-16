export interface User {
  id?: number;
  name: string;
  role: 'user' | 'warehouse' | 'admin';
  status: 'active' | 'disabled';
}
