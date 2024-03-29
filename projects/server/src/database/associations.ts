import { DB } from '.';

export default function () {
  DB.User.hasMany(DB.Address, { foreignKey: 'user_id', as: 'user' });
  DB.Address.belongsTo(DB.User, { foreignKey: 'user_id', as: 'user' });

  DB.City.hasMany(DB.Address, { foreignKey: 'city_id', as: 'city' });
  DB.Address.belongsTo(DB.City, { foreignKey: 'city_id', as: 'city' });

  DB.User.hasOne(DB.Cart, { foreignKey: 'user_id', as: 'userCart' });
  DB.Cart.belongsTo(DB.User, { foreignKey: 'user_id', as: 'userCart' });

  DB.Product.hasMany(DB.Image, { foreignKey: 'product_id', as: 'productImage' });
  DB.Image.belongsTo(DB.Product, { foreignKey: 'product_id', as: 'productImage' });

  DB.Cart.hasMany(DB.CartProduct, { foreignKey: 'cart_id', as: 'cartProducts' });
  DB.CartProduct.belongsTo(DB.Cart, { foreignKey: 'cart_id', as: 'cart' });
  DB.Product.hasMany(DB.CartProduct, { foreignKey: 'product_id', as: 'cartProducts' });
  DB.CartProduct.belongsTo(DB.Product, { foreignKey: 'product_id', as: 'product' });
  DB.Size.hasMany(DB.CartProduct, { foreignKey: 'size_id', as: 'cartProductSize' });
  DB.CartProduct.belongsTo(DB.Size, { foreignKey: 'size_id', as: 'size' });

  DB.Order.hasMany(DB.OrderDetails, { foreignKey: 'order_id', as: 'orderDetails' });
  DB.OrderDetails.belongsTo(DB.Order, { foreignKey: 'order_id', as: 'order' });
  DB.Product.hasMany(DB.OrderDetails, { foreignKey: 'product_id', as: 'orderDetails' });
  DB.OrderDetails.belongsTo(DB.Product, { foreignKey: 'product_id', as: 'product' });
  DB.Size.hasMany(DB.OrderDetails, { foreignKey: 'size_id', as: 'orderDetails' });
  DB.OrderDetails.belongsTo(DB.Size, { foreignKey: 'size_id', as: 'size' });

  DB.Order.hasOne(DB.PaymentDetails, { foreignKey: 'order_id', as: 'paymentDetails' });
  DB.PaymentDetails.belongsTo(DB.Order, { foreignKey: 'order_id', as: 'paymentDetails' });

  DB.Order.hasOne(DB.Shipment, { foreignKey: 'order_id', as: 'orderShipment' });
  DB.Shipment.belongsTo(DB.Order, { foreignKey: 'order_id', as: 'orderShipment' });

  DB.User.hasOne(DB.Order, { foreignKey: 'user_id', as: 'userOrder' });
  DB.Order.belongsTo(DB.User, { foreignKey: 'user_id', as: 'userOrder' });
  DB.Warehouses.hasOne(DB.Order, { foreignKey: 'warehouse_id', as: 'warehouseOrder' });
  DB.Order.belongsTo(DB.Warehouses, { foreignKey: 'warehouse_id', as: 'warehouseOrder' });

  DB.City.hasOne(DB.WarehouseAddresses, { foreignKey: 'cityId', as: 'cityWarehouse' });
  DB.WarehouseAddresses.belongsTo(DB.City, { foreignKey: 'cityId', as: 'cityWarehouse' });

  DB.Province.hasMany(DB.City, { foreignKey: 'provinceId', as: 'cities' });
  DB.City.belongsTo(DB.Province, { foreignKey: 'provinceId', as: 'cityProvince' });

  DB.User.hasOne(DB.Warehouses, { foreignKey: 'userId', as: 'warehouse' });
  DB.Warehouses.belongsTo(DB.User, { foreignKey: 'userId', as: 'warehouse' });

  DB.Categories.hasOne(DB.Product, { foreignKey: 'categoryId', as: 'productCategory' });
  DB.Product.belongsTo(DB.Categories, { foreignKey: 'categoryId', as: 'productCategory' });

  DB.WarehouseAddresses.hasOne(DB.Warehouses, { foreignKey: 'warehouseAddressId', as: 'warehouseAddress' });
  DB.Warehouses.belongsTo(DB.WarehouseAddresses, { foreignKey: 'warehouseAddressId', as: 'warehouseAddress' });

  DB.Inventories.hasOne(DB.Jurnal, { foreignKey: 'inventoryId', as: 'jurnal' });
  DB.Jurnal.belongsTo(DB.Inventories, { foreignKey: 'inventoryId', as: 'jurnal' });

  DB.Warehouses.hasMany(DB.Inventories, { foreignKey: 'warehouse_id', as: 'inventories' });
  DB.Product.hasMany(DB.Inventories, { foreignKey: 'product_id', as: 'inventory' });
  DB.Size.hasMany(DB.Inventories, { foreignKey: 'size_id', as: 'sizeInventory' });
  DB.Inventories.belongsTo(DB.Warehouses, { foreignKey: 'warehouse_id', as: 'warehouse' });
  DB.Inventories.belongsTo(DB.Product, { foreignKey: 'product_id', as: 'product' });
  DB.Inventories.belongsTo(DB.Size, { foreignKey: 'size_id', as: 'sizes' });

  DB.Product.hasMany(DB.Review, { foreignKey: 'productId', as: 'productReviews' });
  DB.Review.belongsTo(DB.Product, { foreignKey: 'productId', as: 'productReviews' });
  DB.User.hasMany(DB.Review, { foreignKey: 'userId', as: 'userReviews' });
  DB.Review.belongsTo(DB.User, { foreignKey: 'userId', as: 'userReviews' });

  DB.User.hasMany(DB.WishList, { foreignKey: 'userId', as: 'userWishlist' });
  DB.WishList.belongsTo(DB.User, { foreignKey: 'userId', as: 'userWishlist' });
  DB.Product.hasMany(DB.WishList, { foreignKey: 'productId', as: 'productWishlist' });
  DB.WishList.belongsTo(DB.Product, { foreignKey: 'productId', as: 'productWishlist' });

  DB.Mutation.belongsTo(DB.Warehouses, { foreignKey: 'senderWarehouse_id', as: 'senderWarehouse' });
  DB.Mutation.belongsTo(DB.Warehouses, { foreignKey: 'receiverWarehouse_id', as: 'receiverWarehouse' });
  DB.Warehouses.hasMany(DB.Mutation, { foreignKey: 'senderWarehouse_id', as: 'senderWarehouse' });
  DB.Warehouses.hasMany(DB.Mutation, { foreignKey: 'receiverWarehouse_id', as: 'receiverWarehouse' });
  DB.Product.hasMany(DB.Mutation, { foreignKey: 'product_id', as: 'productMutation' });
  DB.Mutation.belongsTo(DB.Product, { foreignKey: 'product_id', as: 'productMutation' });
  DB.Size.hasMany(DB.Mutation, { foreignKey: 'size_id', as: 'sizeMutation' });
  DB.Mutation.belongsTo(DB.Size, { foreignKey: 'size_id', as: 'sizeMutation' });

  DB.LastSeenProduct.belongsTo(DB.Product, { foreignKey: 'productId', as: 'lastSeenProduct' });
  DB.Product.hasOne(DB.LastSeenProduct, { foreignKey: 'productId', as: 'lastSeenProduct' });
  DB.LastSeenProduct.belongsTo(DB.User, { foreignKey: 'userId', as: 'userLastSeen' });
  DB.User.hasMany(DB.LastSeenProduct, { foreignKey: 'userId', as: 'userLastSeen' });
}
