const createError = require("http-errors");
const { DomainService } = require("../services/domainService");

exports.createDomain = async (req, res, next) => {
  try {
    const { name, url } = req.body;

    const domainServiceInstance = new DomainService();
    const createdDomain = await domainServiceInstance.createDomain(name, url);
    if (createdDomain instanceof Error) {
      throw createError(422, createdDomain);
    } else {
      res.status(201).json({ createdDomain });
    }
  } catch (error) {
    next(error);
  }
};

exports.getDomainsNamesWithFeedsIds = async (req, res, next) => {
  try {
    const domainServiceInstance = new DomainService();
    const domains = await domainServiceInstance.getDomainsNamesWithFeedsIds();
    if (domains instanceof Error) {
      throw createError(422, domains);
    } else {
      res.status(201).json({ domains });
    }
  } catch (error) {
    next(error);
  }
};

// exports.editDomain = async (req, res, next) => {
//   try {
//     const domainServiceInstance = new DomainService();
//     const editedDomain = await domainServiceInstance.editDomain();
//     if (editedDomain instanceof Error) {
//       throw createError(422, editedDomain);
//     } else {
//       res.status(201).json({ editedDomain });
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// exports.deleteDomain = async (req, res, next) => {
//   try {
//     const domainServiceInstance = new DomainService();
//     const deletedDomain = await domainServiceInstance.deleteDomain();
//     if (deletedDomain instanceof Error) {
//       throw createError(422, deletedDomain);
//     } else {
//       res.status(201).json({ deletedDomain });
//     }
//   } catch (error) {
//     next(error);
//   }
// };
