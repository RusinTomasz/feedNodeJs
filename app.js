const express = require("express");
const cors = require("cors");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const logger = require("./src/config/logger");
const sequlize = require("./src/util/database");
require("dotenv").config();

const authRoutes = require("./src/api/auth");
const feedRoutes = require("./src/api/feed");
const domainRoutes = require("./src/api/domain");
const productRoutes = require("./src/api/product");

const app = express();

/////////database tables
const Product = require("./src/models/product");
const Domain = require("./src/models/domain");
const Feed = require("./src/models/feed");

Domain.hasMany(Feed);
Feed.belongsTo(Domain);

Feed.hasMany(Product);
Product.belongsTo(Feed);

// app.use(bodyParser.urlencoded());

sequlize
  .sync()
  // .sync({ force: true })
  .then((results) => {
    // console.log(results);
  })
  .catch((err) => console.log(err));

app.use(bodyParser.json()); // aplication/json
app.use(cors());
app.options("*", cors());

app.use((req, res, next) => {
  // logger.info(req.body);
  // let oldSend = res.send;
  // res.send = function (data) {
  //   logger.info(JSON.parse(data));
  //   oldSend.apply(res, arguments);
  // };
  next();
});

app.use("/auth", authRoutes);
app.use("/", feedRoutes);
app.use("/", domainRoutes);
app.use("/", productRoutes);

//404 handler and pass to error handler
app.use((req, res, next) => {
  next(createError(404, "Not found"));
});

//Error handler
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send({
    error: {
      status: error.status || 500,
      message: error.message,
    },
  });
});

app.listen(8080, () => {
  logger.log("info", "server up and running on PORT : 8080");
});
