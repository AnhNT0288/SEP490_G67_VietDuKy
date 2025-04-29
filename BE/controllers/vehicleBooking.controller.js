const db = require("../models");
const VehicleBooking = db.VehicleBooking;
const Vehicle = db.Vehicle;
const Booking = db.Booking;
const Passenger = db.Passenger;
const TravelTour = db.TravelTour;
const Op = db.Sequelize.Op;

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
exports.getVehicleBookingByVehicleId = async (req, res) => {
  try {
    const { vehicle_id } = req.params;
    const vehicleBooking = await VehicleBooking.findAll({
      where: { vehicle_id },
      include: [{ model: Booking }],
    });
    res.status(200).json({ message: "Phương tiện đã được lấy thành công", data: vehicleBooking });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy thông tin phương tiện đã đặt",
      error: error.message,
    });
  }
}
exports.getVehicleBookingByTravelTour = async (req, res) => {
  try {
    const { travel_tour_id } = req.params;
    const travelTour = await TravelTour.findByPk(travel_tour_id);
    if (!travelTour) {
      return res.status(404).json({ message: "Không tìm thấy tour" });
    }
    const bookings = await Booking.findAll({ where: { travel_tour_id: travelTour.id } });
    const bookingIds = bookings.map(booking => booking.id);
    const vehicleBooking = await VehicleBooking.findAll(
      { where: { 
        booking_id: { [Op.in]: bookingIds } 
      },
        include: [
          { model: Vehicle },
          { model: Booking,
            include: [
              { model: Passenger,
                as: "passengers"
              },
            ],
          },
        ],
      }
    );
    res.status(200).json({ message: "Lấy thông tin gán phương tiện thành công", data: vehicleBooking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

