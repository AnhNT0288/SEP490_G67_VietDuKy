const express = require("express");
const passport = require("passport");
const authController = require("../controllers/auth.controller.js");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", authController.getProfile);

// Google login routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  authController.googleLogin
);

// Facebook login routes
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: "/",
  }),
  authController.facebookLogin
);

router.post("/forgot-password", authController.sendResetCode);
router.post("/reset-password", authController.resetPassword);
router.post("/resend-reset-code", authController.resendResetCode);
module.exports = router;
