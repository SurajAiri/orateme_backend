import express from "express";
import licenseController from "../controllers/license.controller.js";

const router = express.Router();
router.post("/",licenseController.userCreate);
router.get("/",licenseController.getLicenseForUser);

router.get("/limit",licenseController.userLicenseActivityLimitInfo);

export default router;