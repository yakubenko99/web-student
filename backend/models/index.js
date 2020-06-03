const Sequelize = require('sequelize');

const sequelize = new Sequelize('agency', 'postgres', 'password', {
  host: 'localhost',
  dialect: 'postgres'
});

module.exports = sequelize;