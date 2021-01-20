const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "m1105_feed",
  "m1105_feed",
  "xakKLHGcKyj3N7q7jzCm",
  {
    host: "localhost",
    dialect: "mariadb",
    port: 3306,
    define: {
      freezeTableName: true,
    },
  }
);

module.exports = sequelize;
