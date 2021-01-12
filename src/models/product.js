const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Product = sequelize.define("products", {
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  productLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imageLink: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  availability: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  condition: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  identifierExists: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  googleProductCategory: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  salePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Product;
