import { Address } from './address.interface';
import { Cart } from './cart.interface';
import { CartProduct } from './cartProduct.interface';
import { Category } from './category.interface';
import { City } from './city.interface';
import { Image } from './image.interface';
import { Inventory } from './inventory.interface';
import { Jurnal } from './jurnal.interface';
import { Order } from './order.interface';
import { OrderDetails } from './orderDetails.interface';
import { Product } from './product.interface';
import { Province } from './province.interface';
import { Review } from './review.interface';
import { Routes } from './routes.interface';
import { Shipment } from './shipment.interface';
import { Size } from './size.interface';
import { User } from './user.interface';
import { Warehouse } from './warehouse.interface';
import { WarehouseAddress } from './warehouseAddress.interface';
import { Wishlist } from './wishlist.interface';

type Status = 'ACTIVE' | 'DEACTIVATED' | 'DELETED';
type Role = 'ADMIN' | 'WAREHOUSE ADMIN' | 'CUSTOMER';

interface DokuResponse {
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

interface GetFilterProduct {
  s: string;
  size: string;
  page: number;
  status: string;
  filter: string;
  order: string;
  limit: number;
  externalId: string;
  warehouse: number;
  category: string;
}

export type {
  Status,
  Role,
  DokuResponse,
  Address,
  Cart,
  CartProduct,
  Category,
  City,
  Image,
  Inventory,
  Jurnal,
  Order,
  OrderDetails,
  Product,
  Province,
  Review,
  Routes,
  Shipment,
  Size,
  User,
  Warehouse,
  WarehouseAddress,
  Wishlist,
  GetFilterProduct,
};
