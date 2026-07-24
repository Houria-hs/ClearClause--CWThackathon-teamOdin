const { register, login, getProfile, completeOnboarding, verifyEmail, getTestVerificationLink, getTestUserState } = require("../controllers/authController.js");
const verifyToken = require('../middleware/authMiddleware.js');
const express = require("express");
const router = express.Router();



router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getProfile);
router.get("/verify-email", verifyEmail);
router.put('/complete-onboarding', verifyToken, completeOnboarding);
router.post("/test/verification-link", getTestVerificationLink);
router.post("/test/user-state", getTestUserState);
router.get("/test/runtime", (_req, res) => {
  if (process.env.NODE_ENV !== "test") return res.status(404).json({ message: "Not found" });
  return res.json({ testMode: true });
});

module.exports = router;
