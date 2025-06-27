import express from "express";
import * as AuthController from "../controllers/auth.controller.js";

const router = express.Router();
router.post("/register", AuthController.registerWithUsername);
router.post("/login", AuthController.loginWithUsername);
router.post("/google", AuthController.googleAuth);

export default router;
