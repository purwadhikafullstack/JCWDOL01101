import { DB } from '.';

export default function () {
  DB.User.hasMany(DB.Address, { foreignKey: 'user_id', as: 'userAddress' });
  DB.Address.belongsTo(DB.User, { foreignKey: 'user_id', as: 'user' });

  DB.City.hasMany(DB.Address, { foreignKey: 'city_id', as: 'address' });
  DB.Address.belongsTo(DB.City, { foreignKey: 'city_id', as: 'city' });

  DB.User.hasOne(DB.Cart, { foreignKey: 'user_id', as: 'userCart' });
  DB.Cart.belongsTo(DB.User, { foreignKey: 'user_id', as: 'userCart' });

  DB.Cart.belongsToMany(DB.Product, { through: DB.CartProduct, as: 'products', foreignKey: 'productId', otherKey: 'cartId' });
  DB.Product.belongsToMany(DB.Cart, { through: DB.CartProduct, as: 'carts', foreignKey: 'cartId', otherKey: 'productId' });
  DB.Cart.hasMany(DB.CartProduct, { foreignKey: 'cart_id', as: 'cartProducts' });
  DB.CartProduct.belongsTo(DB.Cart, { foreignKey: 'cart_id', as: 'cart' });
  DB.Product.hasMany(DB.CartProduct, { foreignKey: 'product_id', as: 'cartProducts' });
  DB.CartProduct.belongsTo(DB.Product, { foreignKey: 'product_id', as: 'product' });

  DB.Order.belongsToMany(DB.Product, { through: DB.OrderProduct, as: 'products', foreignKey: 'productId', otherKey: 'orderId' });
  DB.Product.belongsToMany(DB.Order, { through: DB.OrderProduct, as: 'orders', foreignKey: 'orderId', otherKey: 'productId' });
  DB.Order.hasMany(DB.OrderProduct, { foreignKey: 'order_id', as: 'orderProducts' });
  DB.OrderProduct.belongsTo(DB.Order, { foreignKey: 'order_id', as: 'order' });
  DB.Product.hasMany(DB.OrderProduct, { foreignKey: 'product_id', as: 'orderProducts' });
  DB.OrderProduct.belongsTo(DB.Order, { foreignKey: 'product_id', as: 'product' });

  DB.Order.hasOne(DB.Shipment, { foreignKey: 'order_id', as: 'orderShipment' });
  DB.Shipment.belongsTo(DB.Order, { foreignKey: 'order_id', as: 'orderShipment' });

  DB.User.hasOne(DB.Order, { foreignKey: 'user_id', as: 'userOrder' });
  DB.Order.belongsTo(DB.User, { foreignKey: 'user_id', as: 'userOrder' });

  DB.Cities.hasOne(DB.WarehouseAddresses, { foreignKey: 'cityId', as: 'cityData' });
  DB.WarehouseAddresses.belongsTo(DB.Cities, { foreignKey: 'cityId', as: 'cityData' });
  DB.Provinces.hasMany(DB.Cities, { foreignKey: 'provinceId', as: 'provinceData' });
  DB.Cities.belongsTo(DB.Provinces, { foreignKey: 'provinceId', as: 'provinceData' });

  DB.User.hasOne(DB.Warehouses, { foreignKey: 'userId', as: 'userData' });
  DB.Warehouses.belongsTo(DB.User, { foreignKey: 'userId', as: 'userData' });

  DB.Categories.hasOne(DB.Product, { foreignKey: 'categoryId' });
  DB.Product.belongsTo(DB.Categories, { foreignKey: 'categoryId' });

  DB.WarehouseAddresses.hasOne(DB.Warehouses, { foreignKey: 'warehouseAddressId', as: 'warehouseAddress' });
  DB.Warehouses.belongsTo(DB.WarehouseAddresses, { foreignKey: 'warehouseAddressId', as: 'warehouseAddress' });
}
