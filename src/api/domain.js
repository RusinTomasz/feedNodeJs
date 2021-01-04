const express = require("express");
const domainController = require("../controllers/domain");
const { authRole } = require("../middleware/role-auth.js");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// router.get("/domain", domainController.getDomain);

router.post(
  "/domain/create",
  //   isAuth,
  //   authRole(process.env.ADMINPERMISSIONS),
  domainController.createDomain
);
// router.put("/domain/edit/:feedId", domainController.editDomain);
// router.post("/domain/delete/:feedId", domainController.deleteDomain);

module.exports = router;
