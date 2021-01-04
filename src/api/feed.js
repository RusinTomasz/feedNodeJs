const express = require("express");
const feedController = require("../controllers/feed");
const { authRole } = require("../middleware/role-auth.js");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/feed", feedController.getProducts);

router.post(
  "/feed/create",
  //   isAuth,
  //   authRole(process.env.ADMINPERMISSIONS),
  feedController.createFeed
);

// router.put("/feed/edit/:feedId", feedController.editFeed);
// router.post("/feed/delete/:feedId", feedController.deleteFeed);

module.exports = router;
