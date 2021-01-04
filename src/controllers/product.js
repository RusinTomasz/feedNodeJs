const createError = require("http-errors");
const { ProductService } = require("../services/productService");

exports.getProducts = async (req, res, next) => {
  try {
    const products = res.paginatedResults;

    if (products instanceof Error) {
      throw createError(422, products);
    } else {
      res.status(201).json({ products });
    }
  } catch (error) {
    next(error);
  }
};
