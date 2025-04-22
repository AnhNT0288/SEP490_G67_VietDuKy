const express = require("express");
const router = express.Router();
const paymentCardController = require("../controllers/paymentCard.controller");
const {
  authenticateUser,
  authenticateAdmin,
  authenticateStaff,
} = require("../middleware/authMiddleware");

router.get("/", paymentCardController.getAllPaymentCards);
router.get("/:id", paymentCardController.getPaymentCardById);
router.post(
  "/create",
  authenticateUser,
  paymentCardController.createPaymentCard
);
router.put(
  "/update/:id",
  authenticateUser,
  paymentCardController.updatePaymentCard
);
router.delete(
  "/delete/:id",
  authenticateUser,
  paymentCardController.deletePaymentCard
);

module.exports = router;
