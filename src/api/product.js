const express = require("express");
const productController = require("../controllers/product");
const { paginatedResults } = require("../middleware/paginatedResults");
const Product = require("../models/product");

const router = express.Router();

router.get(
  "/products",
  paginatedResults(Product),
  productController.getProducts
);

module.exports = router;
