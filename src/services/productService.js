const { Op } = require("sequelize");

class ProductService {
  constructor() {}

  getPaginatedSearchResults = async (model, queryParams) => {
    const searchWhereObject = await this.prepareSearchWhereObject(queryParams);
    const { page, size } = queryParams;
    let limit;
    if (size) {
      limit = +size;
    } else {
      limit = 16;
    }
    let offset = 0;
    let endIndex = limit * page;
    if (page > 0) {
      offset = 0 + (page - 1) * limit;
    }

    const results = await model
      .findAndCountAll({
        offset: offset,
        limit: limit,
        attributes: [
          "id",
          "title",
          "description",
          "productLink",
          "imageLink",
          "price",
        ],
        where: searchWhereObject,
      })
      .then((result) => result)
      .catch((error) => {
        if (!error.statusCode) {
          error.statusCode = 500;
        }
        return error;
      });

    if (endIndex < +results.count) {
      results.nextPage = {
        page: +page + 1,
        limit: limit,
      };
    }

    if (page > 1) {
      results.prevPage = {
        page: +page - 1,
        limit: limit,
      };
    }

    return results;
  };

  prepareSearchWhereObject = async (queryParams) => {
    const { title, shops, priceFrom, priceTo } = queryParams;

    let whereStatement = {};

    if (title) whereStatement.title = { [Op.like]: `%${title}%` };

    if (priceTo && priceFrom) {
      whereStatement.price = { [Op.between]: [priceFrom, priceTo] };
    }

    if (shops) {
      const shopsArray = JSON.parse(shops);

      whereStatement.feedId = { [Op.in]: shopsArray };
    }

    return whereStatement;
  };
}

module.exports = {
  ProductService: ProductService,
};
