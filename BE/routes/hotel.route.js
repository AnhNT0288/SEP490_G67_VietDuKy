const express = require("express");
const router = express.Router();
const hotelController = require("../controllers/hotel.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
} = require("../middleware/authMiddleware");

router.post("/create", hotelController.createHotel);
router.get("/", hotelController.getHotels);
router.get("/:id", hotelController.getHotelById);
router.put("/:id", hotelController.updateHotel);
router.delete("/:id", hotelController.deleteHotel);
router.get("/location/:location_id", hotelController.getHotelByLocation);

module.exports = router;