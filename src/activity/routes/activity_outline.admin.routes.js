const express = require("express");
const router = express.Router();
const aoController = require("../controllers/activity_outline.controller");

router
  .route("/")
  .get(aoController.getAll)
  .post(aoController.create);

router.route("/:id")
  .get(aoController.getById)
  .patch(aoController.updateById)
  .delete(aoController.deleteById);

//   router.route("/")

module.exports = router;
