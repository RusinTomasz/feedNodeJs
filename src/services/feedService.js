const Feed = require("../models/feed");
const fetch = require("node-fetch");
const xml2js = require("xml2js");
const Product = require("../models/product");
const striptags = require("striptags");
const { response } = require("express");

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
      .then((body) => this.parseFeedToJson(body, feedId))
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
        return this.saveFeedToDb(result.rss.channel[0].item, feedId);
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
      const feedItem = {
        id: item["g:id"] ? item["g:id"][0] : "",
        title: item["g:title"] ? item["g:title"][0] : "",
        description: item["g:description"]
          ? striptags(item["g:description"][0])
          : "",
        imageLink: item["g:image_link"] ? item["g:image_link"][0] : "",
        availability: item["g:availability"] ? item["g:availability"][0] : "",
        condition: item["g:condition"] ? item["g:condition"][0] : "",
        identifierExists: item["g:identifier_exists"]
          ? item["g:identifier_exists"][0]
          : "",
        googleProductCategory: item["g:google_product_category"]
          ? item["g:google_product_category"][0]
          : "",
        price: item["g:price"] ? item["g:price"][0] : "",
        salePrice: item["g:sale_price"] ? item["g:sale_price"][0] : "",
      };

      const product = Product.create({
        title: feedItem.title,
        description: feedItem.description,
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
