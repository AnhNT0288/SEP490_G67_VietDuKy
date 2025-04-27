const db = require("../models");
const RestaurantBooking = db.RestaurantBooking;
const Restaurant = db.Restaurant;
const Booking = db.Booking;

// Lấy thông tin các nhà hàng đã được đặt cho một booking
exports.getRestaurantBookingsByBookingId = async (req, res) => {
  try {
    const bookingId = req.params.booking_id;

    const restaurantBookings = await RestaurantBooking.findAll({
      where: { booking_id: bookingId },
      include: [{ model: Restaurant }],
    });

    if (restaurantBookings.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đặt bàn nhà hàng nào!" });
    }

    res.status(200).json({
      message: "Lấy thông tin đặt bàn nhà hàng thành công",
      data: restaurantBookings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy thông tin đặt bàn nhà hàng",
      error: error.message,
    });
  }
};

// Thêm dịch vụ nhà hàng cho booking
exports.addRestaurantToBooking = async (req, res) => {
  try {
    const { booking_id, restaurant_id, meal, date } = req.body;
    const restaurant = await Restaurant.findByPk(restaurant_id);
    if (!restaurant) {
      return res.status(404).json({ message: "Nhà hàng không tồn tại" });
    }
    const booking = await Booking.findByPk(booking_id);
    if (!booking) {
      return res.status(404).json({ message: "Booking không tồn tại" });
    }
    const checkRestaurantBooking = await RestaurantBooking.findOne({
      where: { booking_id, restaurant_id, meal, date },
    });
    if (checkRestaurantBooking) {
      return res.status(400).json({ message: "Nhà hàng đã được đặt" });
    }

    const newRestaurantBooking = await RestaurantBooking.create({
      booking_id,
      restaurant_id,
      meal,
      date,
    });

    res.status(201).json({
      message: "Thêm nhà hàng vào booking thành công!",
      data: newRestaurantBooking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi thêm nhà hàng vào booking",
      error: error.message,
    });
  }
};

// Hủy đặt bàn Restaurant
exports.cancelRestaurantBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const restaurantBooking = await RestaurantBooking.findByPk(id);

    if (!restaurantBooking) {
      return res.status(404).json({
        message: "Không tìm thấy đặt bàn nhà hàng!",
      });
    }

    await restaurantBooking.destroy();

    res.json({
      message: "Hủy đặt bàn nhà hàng thành công!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi hủy đặt bàn nhà hàng!",
      error: error.message,
    });
  }
};
exports.getRestaurantBookingById = async (req, res) => {
  try {
    const id = req.params.id;
    const restaurantBooking = await RestaurantBooking.findByPk(id, {
      include: [{ model: Restaurant }, { model: Booking }],
    });
    if (!restaurantBooking) {
      return res.status(404).json({ message: "Không tìm thấy đặt bàn nhà hàng!" });
    }
    res.status(200).json({ message: "Lấy thông tin đặt bàn nhà hàng thành công", data: restaurantBooking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
exports.getRestaurantBookingByRestaurantId = async (req, res) => {
  try {
    const id = req.params.id;
    const restaurantBooking = await RestaurantBooking.findAll({
      where: { restaurant_id: id },
      include: [{ model: Booking }],
    });
    if (restaurantBooking.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy đặt bàn nhà hàng!" });
    }
    res.status(200).json({ message: "Lấy thông tin đặt bàn nhà hàng thành công", data: restaurantBooking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
