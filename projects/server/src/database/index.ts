import Sequelize from 'sequelize';
import { NODE_ENV, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE } from '@config';
import { logger } from '@utils/logger';
import UserModel from '@/models/user.model';
import ProductModel from '@/models/product.model';
import CartModel from '@/models/cart.model';
import CartProductModel from '@/models/cartProduct.model';
import AddressModel from '@/models/address.model';
import ProvinceModel from '@/models/province.model';
import CityModel from '@/models/city.model';
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
  Address: AddressModel(sequelize),
  Province: ProvinceModel(sequelize),
  City: CityModel(sequelize),
  sequelize,
  Sequelize,
};

associations();
