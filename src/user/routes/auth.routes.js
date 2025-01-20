const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");

router.post("/register", AuthController.registerWithUsername);
router.post("/login", AuthController.loginWithUsername);

module.exports = router;
