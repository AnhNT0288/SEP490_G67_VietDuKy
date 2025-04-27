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
        .json({ message: "Không tìm thấy thông tin gán phòng khách sạn nào!" });
    }

    res.status(200).json({
      message: "Lấy thông tin gán phòng khách sạn thành công",
      data: hotelBookings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy thông tin gán phòng khách sạn",
      error: error.message,
    });
  }
};

// Đặt phòng Hotel
exports.addHotelToBooking = async (req, res) => {
  try {
    const { booking_id, hotel_id } = req.body;

    // Kiểm tra xem booking có tồn tại không
    const booking = await Booking.findByPk(booking_id);
    if (!booking) {
      return res.status(404).json({
        message: "Không tìm thấy booking!",
      });
    }

    // Kiểm tra xem khách sạn có tồn tại không
    const hotel = await Hotel.findByPk(hotel_id);
    if (!hotel) {
      return res.status(404).json({
        message: "Không tìm thấy khách sạn!",
      });
    }

    const newHotelBooking = await HotelBooking.create({
      booking_id,
      hotel_id,
    });

    res.status(201).json({
      message: "Gán phòng khách sạn thành công!",
      data: newHotelBooking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi gán phòng khách sạn!",
      error: error.message,
    });
  }
};

// Hủy gán phòng khách sạn theo id
exports.cancelBookingHotelById = async (req, res) => {
  try {
    const id = req.params.id;
    const hotelBooking = await HotelBooking.findByPk(id);

    if (!hotelBooking) {
      return res.status(404).json({
        message: "Không tìm thấy gán phòng khách sạn!",
      });
    }

    await hotelBooking.destroy();
    res.json({
      message: "Hủy gán phòng khách sạn thành công!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi hủy gán phòng khách sạn!",
      error: error.message,
    });
  }
};
