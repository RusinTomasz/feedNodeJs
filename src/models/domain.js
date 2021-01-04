const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Domain = sequelize.define("domains", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Domain;
