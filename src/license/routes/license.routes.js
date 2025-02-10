import express from "express";
import licenseController from "../controllers/license.controller.js";

const router = express.Router();
router.post("/",licenseController.userCreate);
router.get("/",licenseController.getLicenseForUser);

export default router;