'use strict';
const { Model } = require('sequelize');
const { hash }  = require('../utils/crypto')

const hashProperties = async (user) => {
  // if passport was changed, hash it. if not, get it
  const results = await Promise.all([
    user.changed("password")
      ? hash(user.password)
      : Promise.resolve(user.password)
  ])

  const hashedPassword = results[0];
  user.password        = hashedPassword;

  return user;
}

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'user'
  });

  User.beforeCreate(hashProperties);
  User.beforeUpdate(hashProperties);

  return User;
};
