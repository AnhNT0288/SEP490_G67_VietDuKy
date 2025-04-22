const db = require("../models");
const VehicleBooking = db.VehicleBooking;
const Vehicle = db.Vehicle;
const Booking = db.Booking;

// Lấy thông tin các phương tiện đã được đặt cho một booking
exports.getVehicleBookingsByBookingId = async (req, res) => {
  try {
    const bookingId = req.params.booking_id;

    const vehicleBookings = await VehicleBooking.findAll({
      where: { booking_id: bookingId },
      include: [{ model: Vehicle }],
    });

    if (vehicleBookings.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy phương tiện nào đã được đặt!" });
    }

    res.status(200).json({
      message: "Lấy thông tin phương tiện đã đặt thành công",
      data: vehicleBookings,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy thông tin phương tiện đã đặt",
      error: error.message,
    });
  }
};

// Đặt phương tiện
exports.addVehicleToBooking = async (req, res) => {
  try {
    const { booking_id, vehicle_id } = req.body;

    const newVehicleBooking = await VehicleBooking.create({
      booking_id,
      vehicle_id,
    });

    res.status(201).json({
      message: "Đặt phương tiện thành công!",
      data: newVehicleBooking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi đặt phương tiện ",
      error: error.message,
    });
  }
};

// Hủy đặt phương tiện theo Id
exports.cancelVehicleBookingById = async (req, res) => {
  try {
    const id = req.params.id;

    const vehicleBooking = await VehicleBooking.findByPk(id);

    if (!vehicleBooking) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đặt chỗ phương tiện!" });
    }

    await vehicleBooking.destroy();

    res.status(200).json({ message: "Hủy đặt phương tiện thành công!" });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi hủy đặt phương tiện",
      error: error.message,
    });
  }
};
