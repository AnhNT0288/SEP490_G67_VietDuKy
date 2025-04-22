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
router.post(
  "/add-travel-tour",
  // authenticateUser,
  // checkRoles(["admin", "staff"]),
  discountServiceController.addTravelTourToDiscountService
);
router.post(
  "/approve-discount-service",
    // authenticateUser,
    // checkRoles(["admin", "staff"]),
  discountServiceController.approveDiscountService
);
router.get(
  "/get-not-approve-discount-service",
  // authenticateUser,
  // checkRoles(["admin", "staff"]),
  discountServiceController.getNotApproveDiscountService
);
router.get(
  "/get-approve-discount-service",
  // authenticateUser,
  // checkRoles(["admin", "staff"]),
  discountServiceController.getApproveDiscountService
);

router.get(
  "/:id",
  authenticateUser,
  discountServiceController.getDiscountServiceById
);

module.exports = router;
