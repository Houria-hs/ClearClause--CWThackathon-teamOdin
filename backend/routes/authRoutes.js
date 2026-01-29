const { register, login, getProfile } = require("../controllers/authController.js");
const verifyToken = require('../middleware/authMiddleware.js');
const express = require("express");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyToken, getProfile);


module.exports = router;