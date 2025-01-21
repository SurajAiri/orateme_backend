const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user.controller");

// /admin/users
router
  .route("/")
  .post(UserController.createUser)
  .get(UserController.getAllUsers);

router
  .route("/:userId")
  .get(UserController.getUserById)
  .patch(UserController.updateUserById)
  .delete(UserController.deleteUserById);

module.exports = router;
