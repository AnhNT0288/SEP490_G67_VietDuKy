const {Booking} = require("../models");

exports.generateUniqueBookingTour = async ({tourCode}) => {
    let bookingCode = "";
    let isUnique = false;

    while (!isUnique) {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        bookingCode = `${tourCode}-${timestamp}-${random}`.toUpperCase();

        const existing = await Booking.findOne({
            where: {booking_code: bookingCode},
        });

        if (!existing) {
            isUnique = true;
        }
    }

    return bookingCode;
};