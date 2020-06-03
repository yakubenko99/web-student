const sequelize = require('./index');

module.exports = sequelize.import('orders', (sequelize, DataTypes) => {
  const Order = sequelize.define(
    'orders',
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      email: {
        type: DataTypes.STRING,
        notEmpty: true,
      },

      advertisingName: {
        type: DataTypes.STRING,
        notEmpty: true,
      },

      count: {
        type: DataTypes.INTEGER,
        notEmpty: true,
      },

      price: {
        type: DataTypes.INTEGER,
        notEmpty: true,
      },

      totalPrice: {
        type: DataTypes.INTEGER,
        notEmpty: true,
      },
    },
    {
      timestamps: false
    }
  );
  // Order.sync({ force: true });

  Order.getAll = async () => {
    const result = await Order.findAll();
    return result.map(item => item.get());
  };
  // User.getUserByEmail = async (email) => await User.findOne({ where: { email: email } });

  // User.getUserById = async (id) => await User.findOne({ where: { id: id } });

  Order.add = async (email, advertisingName, price, totalPrice, count) => await Order.create({ email, advertisingName, price, totalPrice, count });

  return Order;
})