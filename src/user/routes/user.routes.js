const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

router
  .route("/")
  .get(UserController.getUserSelf)
  .patch(UserController.updateUserSelf)
  .delete(UserController.deleteUserSelf);

module.exports = router;
