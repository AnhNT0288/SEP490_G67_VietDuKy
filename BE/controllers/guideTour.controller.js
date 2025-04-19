const db = require("../models");
const GuideTour = db.GuideTour;
const TravelGuide = db.TravelGuide;
const TravelTour = db.TravelTour;
const Tour = db.Tour;
const Location = db.Location;
const User = db.User;
const Booking = db.Booking;
const { Op } = require("sequelize");

// Lấy tất cả các tour mà một hướng dẫn viên tham gia bằng id
exports.getGuideTours = async (req, res) => {
  try {
    const travel_guide_id = req.params.id;

    const travelGuide = await TravelGuide.findByPk(travel_guide_id);
    if (!travelGuide) {
      return res
        .status(200)
        .json({ message: "Không tìm thấy hướng dẫn viên!" });
    }

    const guideTours = await GuideTour.findAll({
      where: { travel_guide_id: travel_guide_id },
      include: [
        {
          model: TravelTour,
          as: "travelTour",
        },
        {
          model: TravelGuide,
          as: "travelGuide",
        },
      ],
    });

    if (guideTours.length === 0) {
      return res
        .status(200)
        .json({ message: "Không tìm thấy tour nào cho hướng dẫn viên này!" });
    }

    res.status(200).json({
      message: "Lấy danh sách tour của hướng dẫn viên thành công!",
      data: guideTours,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách tour của hướng dẫn viên!",
      error: error.message,
    });
  }
};

// Thêm hướng dẫn viên vào một tour
exports.addGuideToTour = async (req, res) => {
  try {
    const { travel_tour_id, travel_guide_id } = req.body;

    // Kiểm tra tour du lịch tồn tại
    const travelTour = await TravelTour.findByPk(travel_tour_id);
    if (!travelTour) {
      return res
        .status(200)
        .json({ message: "Không tìm thấy lịch khởi hành!" });
    }

    // Kiểm tra hướng dẫn viên tồn tại
    const travelGuide = await TravelGuide.findByPk(travel_guide_id);
    if (!travelGuide) {
      return res
        .status(200)
        .json({ message: "Không tìm thấy hướng dẫn viên!" });
    }

    // Kiểm tra hướng dẫn viên đã được gán cho tour này chưa
    const existingGuideTour = await GuideTour.findOne({
      where: {
        travel_tour_id: travel_tour_id,
        travel_guide_id: travel_guide_id,
      },
    });

    if (existingGuideTour) {
      return res
        .status(200)
        .json({ message: "Hướng dẫn viên đã được gán cho tour này!" });
    }

    // Tạo mới gán hướng dẫn viên cho tour
    const newGuideTour = await GuideTour.create({
      travel_tour_id,
      travel_guide_id,
      status: 0,
    });

    res.status(201).json({
      message: "Thêm hướng dẫn viên vào tour thành công!",
      data: newGuideTour,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi thêm hướng dẫn viên vào tour!",
      error: error.message,
    });
  }
};

// Xóa hướng dẫn viên khỏi tour
exports.removeGuideFromTour = async (req, res) => {
  try {
    const guideTourId = req.params.id;

    const guideTour = await GuideTour.findByPk(guideTourId);
    if (!guideTour) {
      return res
        .status(200)
        .json({ message: "Không tìm thấy hướng dẫn viên trong tour!" });
    }

    await guideTour.destroy();

    res.status(200).json({
      message: "Xóa hướng dẫn viên khỏi tour thành công!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa hướng dẫn viên khỏi tour!",
      error: error.message,
    });
  }
};

exports.approveGuideTour = async (req, res) => {
  try {
    const guideTourId = req.params.id;

    const guideTour = await GuideTour.findByPk(guideTourId);
    if (!guideTour) {
      return res
        .status(200)
        .json({ message: "Không tìm thấy hướng dẫn viên trong tour!" });
    }
    const travelGuide = await TravelGuide.findByPk(guideTour.travel_guide_id);
    if (!travelGuide) {
      return res
        .status(200)
        .json({ message: "Không tìm thấy hướng dẫn viên!" });
    }
    const travelTour = await TravelTour.findByPk(guideTour.travel_tour_id);
    if (!travelTour) {
      return res
        .status(200)
        .json({ message: "Không tìm thấy lịch khởi hành!" });
    }
    if (travelTour.status === 0) {
      travelTour.status = 1;
      await travelTour.save();
    } else {
      return res.status(400).json({ message: "Tour đã có người nhận!" });
    }
    guideTour.status = 1;
    await guideTour.save();

    res.status(200).json({
      message: "Duyệt hướng dẫn viên thành công!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi duyệt hướng dẫn viên!",
      error: error.message,
    });
  }
};
exports.rejectGuideTour = async (req, res) => {
  try {
    const guideTourId = req.params.id;

    const guideTour = await GuideTour.findByPk(guideTourId);
    if (!guideTour) {
      return res
        .status(200)
        .json({ message: "Không tìm thấy hướng dẫn viên trong tour!" });
    }
    const travelTour = await TravelTour.findByPk(guideTour.travel_tour_id);
    if (!travelTour) {
      return res
        .status(200)
        .json({ message: "Không tìm thấy lịch khởi hành!" });
    }
    if (travelTour.status === 1) {
      travelTour.status = 0;
      await travelTour.save();
    }
    guideTour.status = 2;
    await guideTour.save();

    res.status(200).json({
      message: "Từ chối hướng dẫn viên thành công!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi từ chối hướng dẫn viên!",
      error: error.message,
    });
  }
};
exports.getGuideTourByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      page = 1,
      limit = 10,
      start_location_id,
      end_location_id,
      name_tour,
      start_day,
      status,
      upcoming,
    } = req.query;
    const travelGuide = await TravelGuide.findOne({
      where: {
        user_id: userId,
      },
    });
    if (!travelGuide) {
      return res
        .status(200)
        .json({ message: "Không tìm thấy hướng dẫn viên!" });
    }

    // Tạo điều kiện where cho Tour
    const tourWhereCondition = {};
    if (start_location_id) {
      tourWhereCondition.start_location = start_location_id;
    }
    if (end_location_id) {
      tourWhereCondition.end_location = end_location_id;
    }
    if (name_tour) {
      tourWhereCondition.name_tour = {
        [Op.like]: `%${name_tour}%`,
      };
    }

    // Tạo điều kiện where cho TravelTour
    const travelTourWhereCondition = {};
    if (start_day) {
      travelTourWhereCondition.start_day = {
        [Op.gte]: new Date(start_day),
      };
    }

    // Filter theo status
    if (status) {
      travelTourWhereCondition.status = status;
    }

    // Filter tour sắp diễn ra (trong 7 ngày tới)
    if (upcoming === "true") {
      const now = new Date();
      const sevenDaysLater = new Date(now);
      sevenDaysLater.setDate(now.getDate() + 7);

      travelTourWhereCondition.start_day = {
        [Op.between]: [now, sevenDaysLater],
      };
    }

    const offset = (page - 1) * limit;

    const { count, rows: guideTours } = await GuideTour.findAndCountAll({
      where: { travel_guide_id: travelGuide.id },
      include: [
        {
          model: TravelTour,
          as: "travelTour",
          where: travelTourWhereCondition,
          include: [
            {
              model: Tour,
              as: "Tour",
              where: tourWhereCondition,
              include: [
                {
                  model: Location,
                  as: "startLocation",
                  attributes: ["id", "name_location"],
                },
                {
                  model: Location,
                  as: "endLocation",
                  attributes: ["id", "name_location"],
                },
              ],
            },
          ],
        },
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["createdAt", "DESC"]],
    });

    // Format lại dữ liệu trả về
    const formattedGuideTours = guideTours.map((guideTour) => {
      const guideTourData = guideTour.get({ plain: true });
      return {
        ...guideTourData,
        travel_tour: {
          ...guideTourData.travelTour,
          tour: {
            ...guideTourData.travelTour.Tour,
            start_location: guideTourData.travelTour.Tour.startLocation || null,
            end_location: guideTourData.travelTour.Tour.endLocation || null,
          },
        },
      };
    });

    res.status(200).json({
      message: "Lấy danh sách tour của hướng dẫn viên thành công!",
      data: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        items: formattedGuideTours,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách tour của hướng dẫn viên!",
      error: error.message,
    });
  }
};
exports.getTravelTourDetailForGuide = async (req, res) => {
  try {
    const { travelTourId } = req.params;

    // Lấy thông tin tour du lịch
    const travelTour = await TravelTour.findOne({
      where: { id: travelTourId },
      include: [
        {
          model: Tour,
          as: "Tour",
          include: [
            {
              model: Location,
              as: "startLocation",
              attributes: ["id", "name_location"],
            },
            {
              model: Location,
              as: "endLocation",
              attributes: ["id", "name_location"],
            },
          ],
        },
      ],
    });

    if (!travelTour) {
      return res.status(200).json({ message: "Không tìm thấy tour du lịch!" });
    }

    // Lấy thông tin hướng dẫn viên của tour
    const guideTours = await GuideTour.findAll({
      where: { travel_tour_id: travelTourId },
      include: [
        {
          model: TravelGuide,
          as: "travelGuide",
          include: [
            {
              model: User,
              as: "user",
            },
          ],
        },
      ],
    });
    const bookings = await Booking.findAll({
      where: { travel_tour_id: travelTourId },
    });

    // Format lại dữ liệu trả về
    const formattedTravelTour = {
      id: travelTour.id,
      tour_id: travelTour.tour_id,
      start_day: travelTour.start_day,
      end_day: travelTour.end_day,
      status: travelTour.status,
      active: travelTour.active,
      price: travelTour.price,
      current_people: travelTour.current_people,
      max_people: travelTour.max_people,
      tour: {
        id: travelTour.Tour.id,
        name_tour: travelTour.Tour.name_tour,
        start_location: travelTour.Tour.startLocation,
        end_location: travelTour.Tour.endLocation,
      },
      guides: guideTours.map((guideTour) => ({
        id: guideTour.travelGuide.id,
        gender: guideTour.travelGuide.gender_guide,
        first_name: guideTour.travelGuide.first_name,
        last_name: guideTour.travelGuide.last_name,
        email: guideTour.travelGuide.email,
        phone: guideTour.travelGuide.number_phone,
        address: guideTour.travelGuide.address,
        avatar: guideTour.travelGuide.user.avatar,
        display_name: guideTour.travelGuide.user.displayName,
      })),
      bookings: bookings.map((booking) => ({
        id: booking.id,
        status: booking.status,
        number_children: booking.number_children,
        number_adult: booking.number_adult,
        number_toddler: booking.number_toddler,
        number_newborn: booking.number_newborn,
        booking_date: booking.booking_date,
        total_cost: booking.total_cost,
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        address: booking.address,
        note: booking.note,
        booking_code: booking.booking_code,
      })),
    };

    res.json({
      message: "Lấy thông tin tour du lịch thành công!",
      data: formattedTravelTour,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Lỗi khi lấy thông tin tour du lịch",
      error: error.message,
    });
  }
};

// Gán TravelGuide cho TravelTour
exports.assignTravelGuideToTravelTour = async (req, res) => {
  try {
    const { travel_tour_id, travel_guide_id } = req.body;

    // Kiểm tra TravelTour có tồn tại không
    const travelTour = await TravelTour.findByPk(travel_tour_id);
    if (!travelTour) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy lịch khởi hành!" });
    }

    // Kiểm tra hướng dẫn viên có tồn tại không
    const travelGuide = await db.TravelGuide.findByPk(travel_guide_id);
    if (!travelGuide) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy hướng dẫn viên!" });
    }

    // Kiểm tra xem hướng dẫn viên đã được gán cho lịch khởi hành này chưa
    const existingAssignment = await db.GuideTour.findOne({
      where: { travel_tour_id, travel_guide_id },
    });
    if (existingAssignment) {
      return res.status(400).json({
        message: "Hướng dẫn viên đã được gán cho lịch khởi hành này!",
      });
    }

    // Kiểm tra xem hướng dẫn viên có bị trùng thời gian với lịch khởi hành khác không
    const overlappingAssignments = await db.GuideTour.findAll({
      where: {
        travel_guide_id,
      },
      include: [
        {
          model: TravelTour,
          as: "travelTour",
          where: {
            [Op.or]: [
              {
                start_day: {
                  [Op.between]: [travelTour.start_day, travelTour.end_day],
                },
              },
              {
                end_day: {
                  [Op.between]: [travelTour.start_day, travelTour.end_day],
                },
              },
              {
                [Op.and]: [
                  { start_day: { [Op.lte]: travelTour.start_day } },
                  { end_day: { [Op.gte]: travelTour.end_day } },
                ],
              },
            ],
          },
        },
      ],
    });

    if (overlappingAssignments.length > 0) {
      return res.status(400).json({
        message:
          "Hướng dẫn viên đã được gán cho một lịch khởi hành khác trong khoảng thời gian này!",
        data: overlappingAssignments.map((assignment) => ({
          travel_tour_id: assignment.travel_tour_id,
          start_day: assignment.travelTour.start_day,
          end_day: assignment.travelTour.end_day,
        })),
      });
    }

    // Gán hướng dẫn viên cho lịch khởi hành
    const newAssignment = await db.GuideTour.create({
      travel_tour_id,
      travel_guide_id,
      status: 0, // 0: Chưa xác nhận, 1: Đã xác nhận
    });

    res.status(201).json({
      message: "Gán hướng dẫn viên cho lịch khởi hành thành công!",
      data: newAssignment,
    });
  } catch (error) {
    console.error("Lỗi khi gán hướng dẫn viên cho lịch khởi hành:", error);
    res.status(500).json({
      message: "Lỗi khi gán hướng dẫn viên cho lịch khởi hành!",
      error: error.message,
    });
  }
};

// Cập nhật trạng thái của GuideTour --Trạng thái mới: 1 (đồng ý), 2 (từ chối)
exports.confirmGuideTour = async (req, res) => {
  try {
    const { guide_tour_id } = req.params;
    const { status } = req.body;

    // Kiểm tra trạng thái hợp lệ
    if (![1, 2].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ!" });
    }

    // Tìm GuideTour theo ID
    const guideTour = await db.GuideTour.findByPk(guide_tour_id);
    if (!guideTour) {
      return res
        .status(404)
        .json({
          message: "Không tìm thấy hướng dẫn viên trong lịch khởi hành!",
        });
    }

    // Cập nhật trạng thái
    guideTour.status = status;
    await guideTour.save();

    // Nếu trạng thái là từ chối (2), có thể thực hiện thêm logic nếu cần
    if (status === 2) {
      const travelTour = await db.TravelTour.findByPk(guideTour.travel_tour_id);
      if (travelTour) {
        travelTour.status = 0;
        await travelTour.save();
      }
    }

    res.status(200).json({
      message: `Cập nhật trạng thái hướng dẫn viên trong lịch khởi hành thành công!`,
      data: guideTour,
    });
  } catch (error) {
    console.error(
      "Lỗi khi cập nhật trạng thái hướng dẫn viên trong lịch khởi hành:",
      error
    );
    res.status(500).json({
      message:
        "Lỗi khi cập nhật trạng thái hướng dẫn viên trong lịch khởi hành!",
      error: error.message,
    });
  }
};
