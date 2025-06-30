const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const resetPasswordController = require("../controllers/resetPasswordController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/forgot-password", resetPasswordController.forgotPassword);
router.post("/reset-password", resetPasswordController.resetPassword);

module.exports = router;
