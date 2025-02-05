import express from "express";
import * as UserController from "../controllers/user.controller.js";

const router = express.Router();
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

export default router;
