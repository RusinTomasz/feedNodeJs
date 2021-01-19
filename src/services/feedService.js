const Feed = require("../models/feed");
const fetch = require("node-fetch");
const xml2js = require("xml2js");
const Product = require("../models/product");
const striptags = require("striptags");

class FeedService {
  constructor() {}

  createFeed = async (url, domainId) => {
    const createdFeed = await Feed.create({
      url: url,
      domainId: domainId,
    })
      .then((createdFeed) => createdFeed)
      .catch((error) => {
        if (!error.statusCode) {
          error.statusCode = 500;
        }
        return error;
      });
    return createdFeed;
  };

  getFeeds = async () => {
    const feeds = await Feed.findAll({
      attributes: ["id", "url", "createdAt"],
    }).then((feed) => feed.map((feed) => feed.dataValues));

    return feeds;
  };

  fetchAllProducts = async () => {
    const feeds = await this.getFeeds();

    const responses = await Promise.all(
      feeds.map((feed) => this.getProductsFromFeed(feed.url, feed.id))
    ).catch((error) => {
      return error;
    });
    return responses;
  };

  getProductsFromFeed = async (url, feedId) => {
    let response;
    const feed = await fetch(url)
      .then((res) => {
        if (res.ok) {
          response = res;
          return this.deactivateCurrentActiveProducts(feedId);
        } else {
          throw "Not valid feed!";
        }
      })
      .then((ProductsAreDeactivated) => {
        if (ProductsAreDeactivated) {
          return response.text();
        } else {
          throw "Something goes wrong!";
        }
      })
      .then((body) => {
        return this.parseFeedToJson(body, feedId);
      })
      .catch((error) => {
        return error;
      });
    const obj = {};
    obj[url] = feed;
    return obj;
  };

  deactivateCurrentActiveProducts = async (feedId) => {
    const deactivateProducts = await Product.update(
      {
        active: false,
      },
      {
        where: {
          feedId: feedId,
        },
      }
    )
      .then(() => true)
      .catch((error) => {
        return error;
      });

    return deactivateProducts;
  };

  parseFeedToJson = async (feed, feedId) => {
    let feedProducts;
    const parser = new xml2js.Parser();
    await parser
      .parseStringPromise(feed)
      .then((result) => {
        feedProducts = result;
        let feedItems;
        if (result.feed && result.feed.entry) {
          feedItems = result.feed.entry;
        } else {
          feedItems = result.rss.channel[0].item;
        }
        return this.saveFeedToDb(feedItems, feedId);
      })
      .then(() => this.removeDeactivatedProducts(feedId))
      .catch((error) => {
        feedProducts = error;
        return error;
      });
    return feedProducts;
  };

  removeDeactivatedProducts = async (feedId) => {
    Product.destroy({
      where: {
        feedId: feedId,
        active: false,
      },
    }).catch((error) => {
      return error;
    });
  };

  saveFeedToDb = async (feedItems, feedId) => {
    const feed = feedItems.map((item) => {
      var regex = /[\d|,|.|e|E|\+]+/g;

      let title;
      let description;
      let link;

      if (item["title"]) {
        title = item["title"][0];
      } else if (item["g:title"]) {
        title = item["g:title"][0];
      } else {
        title = null;
      }

      if (item["description"]) {
        description = striptags(item["description"][0]);
      } else if (item["g:description"]) {
        description = striptags(item["g:description"][0]);
      } else {
        description = null;
      }

      if (item["link"]) {
        link = item["link"][0];
      } else if (item["g:link"]) {
        link = item["g:link"][0];
      } else {
        link = null;
      }

      const feedItem = {
        id: item["g:id"] ? item["g:id"][0] : null,
        title: title,
        description: description,
        productLink: link,
        imageLink:
          item["g:image_link"] && item["g:image_link"][0]
            ? item["g:image_link"][0]
            : null,
        availability:
          item["g:availability"] && item["g:availability"][0]
            ? item["g:availability"][0]
            : null,
        condition:
          item["g:condition"] && item["g:condition"][0]
            ? item["g:condition"][0]
            : null,
        identifierExists:
          item["g:identifier_exists"] && item["g:identifier_exists"][0]
            ? item["g:identifier_exists"][0]
            : null,
        googleProductCategory:
          item["g:google_product_category"] &&
          item["g:google_product_category"][0]
            ? item["g:google_product_category"][0]
            : null,
        price:
          item["g:price"] && item["g:price"][0]
            ? parseFloat(item["g:price"][0].match(regex)[0].replace(/,/g, "."))
            : null,
        salePrice:
          item["g:sale_price"] && item["g:sale_price"][0]
            ? parseFloat(
                item["g:sale_price"][0].match(regex)[0].replace(/,/g, ".")
              )
            : null,
      };

      const product = Product.create({
        title: feedItem.title,
        description: feedItem.description,
        productLink: feedItem.productLink,
        imageLink: feedItem.imageLink,
        availability: feedItem.availability,
        condition: feedItem.condition,
        identifierExists: feedItem.identifierExists,
        googleProductCategory: feedItem.googleProductCategory,
        price: feedItem.price,
        salePrice: feedItem.salePrice,
        feedId: feedId,
        active: true,
      }).catch((error) => {
        console.log(error);
      });

      return feedItem;
    });
    return feed;
  };
}

module.exports = {
  FeedService: FeedService,
};
