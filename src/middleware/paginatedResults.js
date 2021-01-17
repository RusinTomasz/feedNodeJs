paginatedResults = (model) => {
  return async (req, res, next) => {
    try {
      const { page, size } = req.query;
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

      res.paginatedResults = results;
      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = {
  paginatedResults: paginatedResults,
};
