const createError = require("http-errors");
const { FeedService } = require("../services/feedService");

exports.getProducts = async (req, res, next) => {
  try {
    const feedServiceInstance = new FeedService();
    const feed = await feedServiceInstance.fetchAllProducts();

    if (feed instanceof Error) {
      throw createError(422, feed);
    } else {
      res.status(201).json({ feed });
    }
  } catch (error) {
    next(error);
  }
};

exports.createFeed = async (req, res, next) => {
  try {
    const { url, domainId } = req.body;

    const feedServiceInstance = new FeedService();
    const createdFeed = await feedServiceInstance.createFeed(url, domainId);
    if (createdFeed instanceof Error) {
      throw createError(422, createdFeed);
    } else {
      res.status(201).json({ createdFeed });
    }
  } catch (error) {
    next(error);
  }
};

// exports.editFeed = async (req, res, next) => {
//   try {
//     const feedServiceInstance = new FeedService();
//     const editedFeed = await feedServiceInstance.editFeed();
//     if (editedFeed instanceof Error) {
//       throw createError(422, editedFeed);
//     } else {
//       res.status(201).json({ editedFeed });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// exports.deleteFeed = async (req, res, next) => {
//   try {
//     const feedServiceInstance = new FeedService();
//     const deletedFeed = await feedServiceInstance.deleteFeed();
//     if (deletedFeed instanceof Error) {
//       throw createError(422, deletedFeed);
//     } else {
//       res.status(201).json({ deletedFeed });
//     }
//   } catch (error) {
//     next(error);
//   }
// };
