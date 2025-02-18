import express from "express";
import * as UserController from "../controllers/user.controller.js";

const router = express.Router();
router
  .route("/")
  .get(UserController.getUserSelf)
  .patch(UserController.updateUserSelf)
  .delete(UserController.deleteUserSelf);

router.patch("/change_password", UserController.changePassword);

export default router;
