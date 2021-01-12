const createError = require("http-errors");
const Product = require("../models/product");
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

exports.getPaginatedSearchResults = async (req, res, next) => {
  const { shops } = req.query;
  const queryParams = req.query;

  try {
    const productServiceInstance = new ProductService();
    const pagnatedSearchResults = await productServiceInstance.getPaginatedSearchResults(
      Product,
      queryParams
    );

    if (pagnatedSearchResults instanceof Error) {
      throw createError(422, pagnatedSearchResults);
    } else {
      res.status(201).json({ pagnatedSearchResults });
    }
  } catch (error) {
    next(error);
  }
};
