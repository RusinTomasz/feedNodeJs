const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("feed", "root", "", {
  host: "localhost",
  dialect: "mariadb",
  port: 3306,
  define: {
    freezeTableName: true,
  },
});

// const sequelize = new Sequelize(
//   "adsvps_feed",
//   "adsvps_feed",
//   "63zmBoGCBReKzKJjHe",
//   {
//     host: "localhost",
//     dialect: "mariadb",
//     port: 3306,
//     define: {
//       freezeTableName: true,
//     },
//   }
// );

module.exports = sequelize;
