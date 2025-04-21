const db = require("../models");
const Passenger = db.Passenger;
const Booking = db.Booking;
const TravelGuide = db.TravelGuide;

// Tạo hành khách mới
exports.createPassenger = async (req, res) => {
  try {
    const {
      name,
      birth_date,
      gender,
      phone_number,
      passport_number,
      booking_id,
    } = req.body;

    if (
      !name ||
      !birth_date ||
      !gender ||
      !phone_number ||
      !passport_number ||
      !booking_id
    ) {
      return res
        .status(400)
        .json({ message: "Thiếu thông tin bắt buộc để tạo hành khách" });
    }

    const existingBooking = await db.Booking.findByPk(booking_id);
    if (!existingBooking) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đặt chỗ tương ứng với booking_id" });
    }

    const passenger = await Passenger.create({
      name,
      birth_date,
      gender,
      phone_number,
      passport_number,
      booking_id,
    });

    res.status(201).json({
      message: "Tạo hành khách mới thành công",
      data: passenger,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tạo hành khách mới",
      error: error.message,
    });
  }
};

// Lấy hành khách theo booking_id
exports.getPassengerByBookingId = async (req, res) => {
  try {
    const { booking_id } = req.params;

    if (!booking_id) {
      return res
        .status(400)
        .json({ message: "Thiếu booking_id trong yêu cầu" });
    }

    const existingBooking = await Booking.findByPk(booking_id);
    if (!existingBooking) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy đặt chỗ tương ứng với booking_id" });
    }

    const passengers = await Passenger.findAll({ where: { booking_id } });
    if (!passengers || passengers.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy hành khách nào liên quan đến booking_id",
      });
    }

    res.status(200).json({
      message: "Lấy danh sách hành khách theo booking_id thành công",
      data: passengers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách hành khách theo booking_id",
      error: error.message,
    });
  }
};

// Xóa hành khách
exports.deletePassenger = async (req, res) => {
  try {
    const { id } = req.params;

    const passenger = await Passenger.findByPk(id);
    if (!passenger) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy hành khách với id được cung cấp" });
    }

    await passenger.destroy();
    res.status(200).json({ message: "Hành khách đã được xóa thành công" });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa hành khách",
      error: error.message,
    });
  }
};

// Cập nhật thông tin hành khách
exports.updatePassenger = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, birth_date, gender, phone_number, passport_number } =
      req.body;

    const passenger = await Passenger.findByPk(id);
    if (!passenger) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy hành khách với id được cung cấp" });
    }

    if (name != undefined) passenger.name = name;
    if (birth_date != undefined) passenger.birth_date = birth_date;
    if (gender != undefined) passenger.gender = gender;
    if (phone_number != undefined) passenger.phone_number = phone_number;
    if (passport_number != undefined)
      passenger.passport_number = passport_number;

    await passenger.save();

    res.status(200).json({
      message: "Cập nhật thông tin hành khách thành công",
      data: passenger,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật thông tin hành khách",
      error: error.message,
    });
  }
};

exports.getPassengersByTravelGuideId = async (req, res) => {
  try {
    const { travel_guide_id } = req.params;

    if (!travel_guide_id) {
      return res.status(400).json({ message: "Thiếu travel_guide_id" });
    }

    const passengers = await Passenger.findAll({
      where: { travel_guide_id },
    });

    if (!passengers || passengers.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy hành khách nào!" });
    }

    res.status(200).json({
      message: "Lấy danh sách hành khách thành công!",
      data: passengers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách hành khách!",
      error: error.message,
    });
  }
};

exports.getPassengersByTravelTourId = async (req, res) => {
  try {
    const { travel_tour_id } = req.params;

    if (!travel_tour_id) {
      return res.status(400).json({ message: "Thiếu travel_tour_id" });
    }

    // Tìm tất cả các booking liên quan đến travel_tour_id
    const bookings = await Booking.findAll({
      where: { travel_tour_id },
      attributes: ["id"], // Chỉ lấy booking_id
    });

    if (!bookings || bookings.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy booking nào!" });
    }

    // Lấy danh sách booking_id
    const bookingIds = bookings.map((booking) => booking.id);

    // Tìm tất cả hành khách liên quan đến các booking_id
    const passengers = await Passenger.findAll({
      where: {
        booking_id: bookingIds,
      },
    });

    if (!passengers || passengers.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy hành khách nào!" });
    }

    res.status(200).json({
      message: "Lấy danh sách hành khách thành công!",
      data: passengers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách hành khách!",
      error: error.message,
    });
  }
};

//thủ công
exports.assignPassengersToTravelGuide = async (req, res) => {
  try {
    const { travel_guide_id } = req.params;
    const { passenger_ids, group } = req.body;

    if (
      !passenger_ids ||
      !Array.isArray(passenger_ids) ||
      passenger_ids.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Danh sách passenger_ids không hợp lệ!" });
    }

    // Kiểm tra TravelGuide có tồn tại không
    const travelGuide = await db.TravelGuide.findByPk(travel_guide_id);
    if (!travelGuide) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy hướng dẫn viên!" });
    }

    // Kiểm tra và lấy danh sách Passenger
    const passengers = await Passenger.findAll({
      where: { id: passenger_ids },
    });

    if (!passengers || passengers.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy hành khách nào trong danh sách passenger_ids!",
      });
    }

    // Kiểm tra nếu bất kỳ hành khách nào đã được assign cho một TravelGuide khác
    const alreadyAssignedPassengers = passengers.filter(
      (passenger) =>
        passenger.travel_guide_id &&
        passenger.travel_guide_id !== travel_guide_id
    );

    if (alreadyAssignedPassengers.length > 0) {
      return res.status(400).json({
        message: "Một số hành khách đã được phân công cho hướng dẫn viên khác!",
        data: alreadyAssignedPassengers.map((p) => ({
          id: p.id,
          name: p.name,
          assigned_travel_guide_id: p.travel_guide_id,
        })),
      });
    }

    // Gộp tất cả hành khách vào một nhóm và gán travel_guide_id
    await Promise.all(
      passengers.map((passenger) => {
        passenger.travel_guide_id = travel_guide_id;
        passenger.group = group;
        return passenger.save();
      })
    );

    res.status(200).json({
      message: "Phân công hành khách cho hướng dẫn viên thành công!",
      data: passengers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi phân công hành khách!",
      error: error.message,
    });
  }
};
