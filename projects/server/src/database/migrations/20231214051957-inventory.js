'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, { DataTypes }) {
    await queryInterface.createTable(
      'inventories',
      {
        id: {
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER,
        },
        warehouseId: {
          allowNull: false,
          type: DataTypes.INTEGER,
          unique: 'warehouseId_productId_sizeId',
        },
        sizeId: {
          allowNull: false,
          type: DataTypes.INTEGER,
          unique: 'warehouseId_productId_sizeId',
        },
        productId: {
          allowNull: false,
          type: DataTypes.INTEGER,
          unique: 'warehouseId_productId_sizeId',
        },
        stock: {
          allowNull: false,
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        sold: {
          allowNull: false,
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
      },
      {
        uniqueKeys: {
          warehouseId_productId_sizeId: {
            fields: ['warehouse_id', 'product_id', 'size_id'],
          },
        },
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('inventories');
  },
};
