const express = require("express");
const passport = require("passport");
const authController = require("../controllers/auth.controller.js");

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

// Bước 1: Gọi Facebook Login
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

// Bước 2: Callback sau khi Facebook xác thực
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    session: false, // nếu bạn dùng JWT
    failureRedirect: "/", // redirect nếu login fail
  }),
  (req, res) => {
    // Tạo JWT để gửi về frontend
    const user = req.user;
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Redirect về frontend, gắn token vào query hoặc lưu trong localStorage
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  }
);
router.post("/forgot-password", authController.sendResetCode);
router.post("/reset-password", authController.resetPassword);
router.post("/resend-reset-code", authController.resendResetCode);
module.exports = router;
