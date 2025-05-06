const express = require("express");
const router = express.Router();
const BookingController = require("../controllers/booking.controller");
const {
    authenticateUser,
    authenticateAdmin,
    authenticateStaff,
    checkRoles,
} = require("../middleware/authMiddleware");

router.get("/", BookingController.getAllBookings);

router.get(
    "/payment-remind",
    BookingController.paymentBookingRemind
);
router.get(
    "/upcoming-tour",
    BookingController.remindUpcomingTour
);


router.get(
    "/re-payment/:id",
    BookingController.rePayment
);
router.get(
    "/search",
    BookingController.searchBooking
);
router.get(
    "/:id",
    // authenticateUser,
    BookingController.getBookingById
);
router.post(
    "/code",
    BookingController.getBookingByBookingCode
);
// router.post(
//   "/create",
//   authenticateUser,
//   authenticateAdmin,
//   BookingController.createBooking
// );
router.post(
    "/create",
    // authenticateUser,
    BookingController.createBooking
);
router.put("/update/:id",
    // authenticateUser, 
    // authenticateStaff, 
    BookingController.updateBooking);
router.delete(
    "/cancel/:id",
    authenticateUser,
    checkRoles(["admin", "staff"]),
    BookingController.deleteBooking
);
router.get(
    "/latest",
    authenticateUser,
    BookingController.getLatestBooking
);
router.get(
    "/user/:id",
    // authenticateUser,
    BookingController.getBookingByUserId
);
router.get(
    "/travel-tour/:id",
    BookingController.getBookingByTravelTourId
);
module.exports = router;
