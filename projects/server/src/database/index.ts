import Sequelize from 'sequelize';
import { NODE_ENV, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from '@config';
import { logger } from '@utils/logger';
import WarehouseModel from '@/models/warehouse.model';
import UserModel from '@/models/user.model';
import ProvinceModel from '@/models/province.model';
import WarehouseAddressModel from '@/models/warehouseAddress.model';
import CityModel from '@/models/city.model';
import ProductModel from '@/models/product.model';
import CategoryModel from '@/models/category.model';
import InventoryModel  from '@/models/inventory.model';
import CartModel from '@/models/cart.model';
import CartProductModel from '@/models/cartProduct.model';
import AddressModel from '@/models/address.model';
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
  Warehouses:WarehouseModel(sequelize),
  WarehouseAddresses:WarehouseAddressModel(sequelize),
  Provinces:ProvinceModel(sequelize),
  Cities:CityModel(sequelize),
  Product: ProductModel(sequelize),
  Address: AddressModel(sequelize),
  Provice: ProvinceModel(sequelize),
  City: CityModel(sequelize),
  Categories:CategoryModel(sequelize),
  Inventories: InventoryModel(sequelize),
  sequelize,
  Sequelize,
};



associations();


DB.Cities.hasOne(DB.WarehouseAddresses,{foreignKey: "cityId", as: 'cityData' })
DB.WarehouseAddresses.belongsTo(DB.Cities,{foreignKey: "cityId", as: 'cityData' })
DB.Provinces.hasMany(DB.Cities,{foreignKey: "provinceId", as:'provinceData'})
DB.Cities.belongsTo(DB.Provinces,{foreignKey: "provinceId", as:'provinceData'})

DB.User.hasOne(DB.Warehouses,{foreignKey: "userId", as:'userData'})
DB.Warehouses.belongsTo(DB.User,{foreignKey: "userId", as:'userData'})

DB.Categories.hasOne(DB.Product,{foreignKey:"categoryId"})
DB.Product.belongsTo(DB.Categories,{foreignKey:"categoryId"})

DB.WarehouseAddresses.hasOne(DB.Warehouses,{foreignKey: "warehouseAddressId", as: 'warehouseAddress' })
DB.Warehouses.belongsTo(DB.WarehouseAddresses,{foreignKey: "warehouseAddressId",as: 'warehouseAddress' })