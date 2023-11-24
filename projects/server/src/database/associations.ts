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
}
