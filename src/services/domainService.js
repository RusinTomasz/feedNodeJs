const Domain = require("../models/domain");

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
}

module.exports = {
  DomainService: DomainService,
};
