import express from "express";
import licenseController from "../controllers/license.controller";

router = express.Router();
router.post("/",licenseController.createByUser);
router.get("/",licenseController.getLicenseForUser);

export default router;