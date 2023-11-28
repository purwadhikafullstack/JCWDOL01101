import Sequelize from 'sequelize';
import { NODE_ENV, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from '@config';
import { logger } from '@utils/logger';

import WarehouseModel from '@/models/warehouse.model';
import UserModel from '@/models/user.model';
import WarehouseAddressModel from '@/models/warehouseAddress.model';
import ProductModel from '@/models/product.model';
import CategoryModel from '@/models/category.model';
import InventoryModel from '@/models/inventory.model';
import CartModel from '@/models/cart.model';
import CartProductModel from '@/models/cartProduct.model';
import AddressModel from '@/models/address.model';
import ProvinceModel from '@/models/province.model';
import CityModel from '@/models/city.model';
import OrderModel from '@/models/order.model';
import OrderProdcutModel from '@/models/orderProduct.model';
import ShipmentModel from '@/models/shipment.model';
import ImageModel from '@/models/image.model';
import JurnalModel from '@/models/jurnal.model';

import associations from './associations';

const sequelize = new Sequelize.Sequelize(DB_DATABASE, DB_USER, DB_PASSWORD, {
  dialect: 'mysql',
  host: DB_HOST,
  port: Number(DB_PORT),
  timezone: '+09:00',
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_general_ci',
    underscored: true,
    freezeTableName: true,
  },
  pool: {
    min: 0,
    max: 5,
  },
  logQueryParameters: NODE_ENV === 'development',
  logging: (query, time) => {
    logger.info(time + 'ms' + ' ' + query);
  },
  benchmark: true,
});

sequelize.authenticate();

export const DB = {
  User: UserModel(sequelize),
  Cart: CartModel(sequelize),
  CartProduct: CartProductModel(sequelize),
  Product: ProductModel(sequelize),
  Order: OrderModel(sequelize),
  OrderProduct: OrderProdcutModel(sequelize),
  Image: ImageModel(sequelize),
  Shipment: ShipmentModel(sequelize),
  Address: AddressModel(sequelize),
  Province: ProvinceModel(sequelize),
  City: CityModel(sequelize),
  Categories: CategoryModel(sequelize),
  Categories: CategoryModel(sequelize),
  Inventories: InventoryModel(sequelize),
  Warehouses: WarehouseModel(sequelize),
  WarehouseAddresses: WarehouseAddressModel(sequelize),
  JurnalModel: JurnalModel(sequelize),
  sequelize,
  Sequelize,
};

associations();
