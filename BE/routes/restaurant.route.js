const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurant.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
} = require("../middleware/authMiddleware");

router.post("/create", restaurantController.createRestaurant);
router.get("/", restaurantController.getRestaurant);
router.get("/:id", restaurantController.getRestaurantById);
router.put("/:id", restaurantController.updateRestaurant);
router.delete("/:id", restaurantController.deleteRestaurant);
router.get("/location/:location_id", restaurantController.getRestaurantByLocation);

module.exports = router;
