const db = require("../models");
const HotelBooking = db.HotelBooking;
const Hotel = db.Hotel;
const Booking = db.Booking;

// Lấy thông tin các khách sạn đã được đặt cho một booking
exports.getHotelBookingsByBookingId = async (req, res) => {
  try {
    const bookingId = req.params.booking_id;

    const hotelBookings = await HotelBooking.findAll({
      where: { booking_id: bookingId },
      include: [{ model: Hotel }],
    });

    if (hotelBookings.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin đặt phòng khách sạn nào!" });
    }

    res.status(200).json({
      message: "Lấy thông tin đặt phòng khách sạn thành công",
      data: hotelBookings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy thông tin đặt phòng khách sạn",
      error: error.message,
    });
  }
};

// Đặt phòng Hotel
exports.addHotelToBooking = async (req, res) => {
  try {
    const { booking_id, hotel_id } = req.body;

    const newHotelBooking = await HotelBooking.create({
      booking_id,
      hotel_id,
    });

    res.status(201).json({
      message: "Đặt phòng khách sạn thành công!",
      data: newHotelBooking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi đặt phòng khách sạn!",
      error: error.message,
    });
  }
};

// Hủy đặt phòng khách sạn theo id
exports.cancelBookingHotelById = async (req, res) => {
  try {
    const id = req.params.id;
    const hotelBooking = await HotelBooking.findByPk(id);

    if (!hotelBooking) {
      return res.status(404).json({
        message: "Không tìm thấy đặt phòng khách sạn!",
      });
    }

    await hotelBooking.destroy();
    res.json({
      message: "Hủy đặt phòng khách sạn thành công!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi hủy đặt phòng khách sạn!",
      error: error.message,
    });
  }
};
