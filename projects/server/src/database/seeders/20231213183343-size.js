'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      const sizes = [
        {
          id: 1,
          label: 'XS',
          value: 1,
        },
        {
          id: 2,
          label: 'S',
          value: 2,
        },
        {
          id: 3,
          label: 'M',
          value: 3,
        },
        {
          id: 4,
          label: 'L',
          value: 4,
        },
        {
          id: 5,
          label: 'XL',
          value: 5,
        },
        {
          id: 6,
          label: 'XXL',
          value: 6,
        },
        {
          id: 7,
          label: '3XL',
          value: 7,
        },
      ];

      await queryInterface.bulkInsert('size', sizes, {});
    } catch (err) {
      throw err;
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('size', null, {});
  },
};
