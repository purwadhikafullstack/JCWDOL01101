'use strict';
const axios = require('axios');
require('dotenv').config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    try {
      const res = await axios.get('https://api.rajaongkir.com/starter/city', {
        headers: {
          key: process.env.RAJAONGKIR_API_KEY,
        },
      });
      const data = res.data.rajaongkir.results;

      const provinceResponse = await axios.get('https://api.rajaongkir.com/starter/province', {
        headers: {
          key: process.env.RAJAONGKIR_API_KEY,
        },
      });
      const province = provinceResponse.data.rajaongkir.results;

      await queryInterface.bulkInsert('province', province, {});
      await queryInterface.bulkInsert('cities', data, {});
    } catch (err) {
      throw err;
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('cities', null, {});
  },
};
