'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, { DataTypes }) {
    await queryInterface.changeColumn('products', 'description', {
      type: DataTypes.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, { DataTypes }) {
    await queryInterface.changeColumn('products', 'description', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },
};
