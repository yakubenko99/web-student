const sequelize = require('./index');

module.exports = sequelize.import('users', (sequelize, DataTypes) => {
  const User = sequelize.define(
    'users',
    {
      id: {
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },

      email: {
        type: DataTypes.STRING,
        notEmpty: true,
        unique: true
      },

      password: {
        type: DataTypes.STRING,
        notEmpty: true,
      },

      role: {
        type: DataTypes.STRING,
        notEmpty: true,
      }
    },
    {
      timestamps: false
    }
  );
  // User.sync({ force: true });
  User.getAll = async () => {
    const result = await User.findAll();
    return result.map(item => item.get());
  };


  User.getUserByEmail = async (email) => await User.findOne({ where: { email: email } });

  User.getUserById = async (id) => await User.findOne({ where: { id: id } });

  User.add = async (email, password) => await User.create({ email: email, password: password });

  return User;
})