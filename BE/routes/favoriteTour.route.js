const express = require("express");
const router = express.Router();
const FavoriteTourController = require("../controllers/favoriteTour.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
} = require("../middleware/authMiddleware");

router.post("/add", authenticateUser, FavoriteTourController.addFavoriteTour);
router.get(
  "/user/:user_id",
  authenticateUser,
  FavoriteTourController.getFavoriteToursByUser
);
router.delete(
  "/remove",
  authenticateUser,
  FavoriteTourController.removeFavoriteTour
);

module.exports = router;
