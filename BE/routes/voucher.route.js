const express = require("express");
const router = express.Router();
const voucherController = require("../controllers/voucher.controller");
const {uploadVoucher} = require("../utils/cloudinary");
const {
    authenticateUser,
    authenticateAdmin,
    authenticateStaff,
    checkRoles,
} = require("../middleware/authMiddleware");

router.get("/", voucherController.getAllVouchers);
router.get("/:id", voucherController.getVoucherById);
router.get("/code/:voucher_code", voucherController.getVoucherByCode);
router.post(
    "/create",
    authenticateUser,
    checkRoles(["admin", "staff"]),
    uploadVoucher.single("image"),
    voucherController.createVoucher
);
router.put(
    "/update/:id",
    authenticateUser,
    checkRoles(["admin", "staff"]),
    uploadVoucher.single("image"),
    voucherController.updateVoucher
);
router.delete(
    "/delete/:id",
    authenticateUser,
    checkRoles(["admin", "staff"]),
    voucherController.deleteVoucher
);

module.exports = router;
