const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");

router.post("/check", paymentController.checkPayment);
router.get("/", paymentController.getAllPayment);
router.get("/:id", paymentController.getPayment);
router.get("/booking/:id", paymentController.getPaymentByBookingId);
router.get("/customer/:id", paymentController.getPaymentByCustomerId);

module.exports = router;
