const express = require("express");
const router = express.Router();
const discountServiceController = require("../controllers/discountService.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
  checkRoles,
} = require("../middleware/authMiddleware");

router.get("/", discountServiceController.getAllDiscountServices);
router.get(
  "/:id",
  authenticateUser,
  discountServiceController.getDiscountServiceById
);
router.post(
  "/create",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  discountServiceController.createDiscountService
);
router.put(
  "/update/:id",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  discountServiceController.updateDiscountService
);
router.delete(
  "/delete/:id",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  discountServiceController.deleteDiscountService
);

module.exports = router;
