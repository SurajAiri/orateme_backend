import express from "express";
import licenseOutlineController from "../controllers/licenseOutline.controller";

router = express.Router();
router.get("/active",licenseOutlineController.getActivePackages);

router.use("/")
    .get(licenseOutlineController.getAll)
    .post(licenseOutlineController.create);

router.use("/:id")
    .get(licenseOutlineController.getById)
    .patch(licenseOutlineController.updateById)
    .delete(licenseOutlineController.deleteById);


export default router;