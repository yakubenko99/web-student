const sequelize = require('./index');

module.exports = sequelize.import('advertising', (sequelize, DataTypes) => {
  const Advertising = sequelize.define(
    'advertising',
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      name: {
        type: DataTypes.STRING,
        notEmpty: true,
      },

      image: {
        type: DataTypes.STRING,
        notEmpty: true,
      },

      price: {
        type: DataTypes.INTEGER,
        notEmpty: true,
      }
    },
    {
      timestamps: false,
    }
  );

  // Advertising.sync({ force: true })

  Advertising.getAll = async () => {
    const result = await Advertising.findAll();
    return result.map(item => item.get());
  }

  Advertising.add = async (name, image, price) => await Advertising.create({ name: name, image: image, price: price });

  return Advertising;
})