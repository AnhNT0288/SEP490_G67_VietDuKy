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

module.exports = router;