const { DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Feed = sequelize.define("feeds", {
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Feed;
