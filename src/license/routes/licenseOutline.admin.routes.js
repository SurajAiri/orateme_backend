import express from "express";
import licenseOutlineController from "../controllers/licenseOutline.controller.js";

const router = express.Router();
router.get("/active",licenseOutlineController.getActivePackages);


router.route("/")
    .get(licenseOutlineController.getAll)
    .post(licenseOutlineController.create);

router.route("/:id")
    .get(licenseOutlineController.getById)
    .patch(licenseOutlineController.updateById)
    .delete(licenseOutlineController.deleteById);


export default router;