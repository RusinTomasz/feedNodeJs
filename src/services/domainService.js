const Domain = require("../models/domain");
const Feed = require("../models/feed");

class DomainService {
  constructor() {}

  createDomain = async (name, url) => {
    const createdDomain = await Domain.create({
      name: name,
      url: url,
    })
      .then((createdDomain) => createdDomain)
      .catch((error) => {
        if (!error.statusCode) {
          error.statusCode = 500;
        }
        return error;
      });
    return createdDomain;
  };

  getDomainsNamesWithFeedsIds = async () => {
    const domains = await Domain.findAll({
      attributes: ["id", "name"],
      include: [
        {
          model: Feed,
          attributes: ["id"],
        },
      ],
    })
      .then((domains) => domains)
      .catch((error) => {
        if (!error.statusCode) {
          error.statusCode = 500;
        }
        return error;
      });
    return domains;
  };
}

module.exports = {
  DomainService: DomainService,
};
