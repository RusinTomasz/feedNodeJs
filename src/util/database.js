const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("feed", "root", "", {
  host: "localhost",
  dialect: "mariadb",
  define: {
    freezeTableName: true,
  },
});

module.exports = sequelize;
