const express = require("express");
const router = express.Router();
const programDiscountController = require("../controllers/programDiscount.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
  checkRoles,
} = require("../middleware/authMiddleware");

router.get("/", programDiscountController.getAllProgramDiscounts);
router.get("/:id", programDiscountController.getProgramDiscountById);
router.post(
  "/create",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  programDiscountController.createProgramDiscount
);
router.put(
  "/update/:id",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  programDiscountController.updateProgramDiscount
);
router.delete(
  "/delete/:id",
  authenticateUser,
  checkRoles(["admin", "staff"]),
  programDiscountController.deleteProgramDiscount
);

module.exports = router;
