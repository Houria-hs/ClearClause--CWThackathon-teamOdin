const { register, login, getProfile, completeOnboarding } = require("../controllers/authController.js");
const verifyToken = require('../middleware/authMiddleware.js');
const express = require("express");
const router = express.Router();
const { verifyEmail } = require("../controllers/authController");
const testVerifyUser = require("../controllers/authController").testVerifyUser;



router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getProfile);
router.get("/verify-email", verifyEmail);
router.put('/complete-onboarding', verifyToken, completeOnboarding);
router.post("/test/verify", testVerifyUser);

module.exports = router;