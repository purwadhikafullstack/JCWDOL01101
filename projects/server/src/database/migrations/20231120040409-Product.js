'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, { DataTypes }) {
    await queryInterface.createTable('products', {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      categoryId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING(256),
      },
      price: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      stock: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      sold: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      status: {
        type: DataTypes.ENUM,
        values: ['ACTIVE', 'DEACTIVATED', 'DELETED'],
        defaultValue: 'ACTIVE',
      },
      description: {
        allowNull: false,
        type: DataTypes.STRING(256),
      },
      image: {
        allowNull: false,
        type: DataTypes.STRING(256),
      },
      weight: {
        allowNull: false,
        type: DataTypes.DECIMAL,
      },
      slug: {
        allowNull: false,
        type: DataTypes.STRING(255),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
  },
};
