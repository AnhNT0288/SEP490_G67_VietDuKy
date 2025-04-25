const db = require("../models");
const TravelTour = db.TravelTour;
const Tour = db.Tour;
const Location = db.Location;
const Booking = db.Booking;
const User = db.User;
const TravelGuide = db.TravelGuide;
const GuideTour = db.GuideTour;
const { Op, Sequelize } = require("sequelize");

//Lấy tất cả dữ liệu trong bảng travel tour
exports.getAllTravelTours = async (req, res) => {
  try {
    const { status } = req.query;

    // Tạo điều kiện where
    const whereCondition = {};
    if (status !== undefined) {
      whereCondition.status = status;
    }

    const travelTours = await TravelTour.findAll({
      where: whereCondition,
      include: [
        {
          model: Tour,
          as: "Tour",
          // attributes: ['id', 'name_tour', 'price_tour', 'day_number', 'rating_tour', 'max_people', 'image']
        },
      ],
      order: [["start_day", "ASC"]],
    });

    // Format lại dữ liệu trả về
    const formattedTravelTours = travelTours.map((travelTour) => {
      const travelTourData = travelTour.get({ plain: true });
      return {
        ...travelTourData,
        tour: travelTourData.Tour || null,
      };
    });

    res.json({
      message: "Lấy danh sách tour thành công!",
      data: formattedTravelTours,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách tour!",
      error: error.message,
    });
  }
};

//Lấy thông tin travel tour theo ID
exports.getTravelTourById = async (req, res) => {
  try {
    const travelTourId = req.params.id;
    const travelTour = await TravelTour.findByPk(travelTourId, {
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
      return res.status(404).json({ message: "Không tìm thấy tour du lịch!" });
    }

    // Format lại dữ liệu trả về
    const formattedTravelTour = {
      ...travelTour.get({ plain: true }),
      tour: {
        ...travelTour.Tour.get({ plain: true }),
        start_location: travelTour.Tour.StartLocation || null,
        end_location: travelTour.Tour.EndLocation || null,
      },
    };

    res.json({
      message: "Lấy thông tin tour du lịch thành công!",
      data: formattedTravelTour,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy thông tin tour du lịch với id=" + req.params.id,
      error: error.message,
    });
  }
};

//Lấy thông tin travel tour theo tour_id
exports.getTravelTourByTourId = async (req, res) => {
  try {
    const tourId = req.params.id;
    const travelTour = await TravelTour.findAll({
      where: { tour_id: tourId },
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

    if (!travelTour || travelTour.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy tour du lịch!",
      });
    }

    // Format lại dữ liệu trả về
    const formattedTravelTours = travelTour.map((item) => {
      const travelTourData = item.get({ plain: true });
      return {
        ...travelTourData,
        tour: {
          ...travelTourData.Tour,
          start_location: travelTourData.Tour?.startLocation || null,
          end_location: travelTourData.Tour?.endLocation || null,
        },
      };
    });

    res.json({
      message: "Lấy thông tin tour du lịch thành công!",
      data: formattedTravelTours,
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Lỗi khi lấy thông tin tour du lịch với tour_id=" + req.params.id,
      error: error.message,
    });
  }
};

const calculateRequiredGuides = (max_people) => {
  if (!max_people || max_people <= 0) {
    throw new Error("Số lượng khách không hợp lệ!");
  }

  // Một hướng dẫn viên quản lý tối đa 15 khách
  const guideCapacity = 15;
  const fullGuides = Math.floor(max_people / guideCapacity);
  const remainingPeople = max_people % guideCapacity;

  // Nếu số người còn lại lớn hơn 10, thêm một hướng dẫn viên mới
  return remainingPeople > 10 ? fullGuides + 1 : fullGuides;
};

//Tạo travel tour mới
exports.createTravelTour = async (req, res) => {
  try {
    const {
      tour_id,
      start_day,
      end_day,
      price_tour,
      max_people,
      start_time_depart,
      end_time_depart,
      start_time_close,
      end_time_close,
      children_price,
      toddler_price,
    } = req.body;

    // Tính toán required_guides dựa trên max_people
    const required_guides = calculateRequiredGuides(max_people);

    if (
      !tour_id ||
      !start_day ||
      !end_day ||
      !price_tour ||
      !max_people ||
      !start_time_depart ||
      !end_time_depart ||
      !start_time_close ||
      !end_time_close ||
      !children_price ||
      !toddler_price
    ) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc!" });
    }

    const data = {
      tour_id,
      start_day,
      end_day,
      price_tour,
      max_people,
      start_time_depart,
      end_time_depart,
      start_time_close,
      end_time_close,
      children_price,
      toddler_price,
      required_guides,
      status: 0,
      active: 1,
    };
    const Tour = await db.Tour.findByPk(tour_id);
    if (!Tour) {
      return res.status(404).json({ message: "Không tìm thấy tour!" });
    }
    /// Validate thời gian khởi hành và kết thúc
    if (start_time_depart >= end_time_depart) {
      return res.status(400).json({
        message:
          "Thời gian khởi hành phải trước thời gian kết thúc cho ngày khởi hành!",
      });
    }
    if (start_time_close >= end_time_close) {
      return res.status(400).json({
        message:
          "Thời gian khởi hành phải trước thời gian kết thúc cho ngày kết thúc!",
      });
    }

    //Validate ngày bắt đầu và ngày kết thúc
    if (start_day < Date.now()) {
      return res
        .status(400)
        .json({ message: "Ngày bắt đầu phải ở tương lai!" });
    }
    if (end_day < start_day) {
      return res
        .status(400)
        .json({ message: "Ngày kết thúc phải sau ngày bắt đầu!" });
    }

    //Validate giá tour và số người
    if (price_tour < 0) {
      return res.status(400).json({ message: "Giá tour phải lớn hơn 0!" });
    }
    if (max_people < 0) {
      return res.status(400).json({ message: "Số người phải lớn hơn 0!" });
    }

    const newTravelTour = await db.TravelTour.create(data);
    res.json({
      message: "Tạo tour du lịch mới thành công!",
      tour: newTravelTour,
    });
  } catch (error) {
    console.error("Lỗi khi thêm tour:", error);
    res.status(500).json({ error: error.message });
  }
};

//Xóa travel tour theo ID
exports.deleteTravelTour = async (req, res) => {
  try {
    const travelTourId = req.params.id;

    // Tìm travel tour theo ID
    const travelTour = await TravelTour.findByPk(travelTourId);

    if (!travelTour) {
      return res.status(404).json({ message: "Không tìm thấy tour du lịch!" });
    }

    // Kiểm tra xem có booking nào liên quan đến travel tour này không
    const bookings = await db.Booking.findAll({
      where: { travel_tour_id: travelTourId },
    });

    if (bookings.length > 0) {
      return res.status(400).json({
        message: "Không thể xóa tour du lịch vì đã có booking liên quan!",
      });
    }

    // Xóa travel tour nếu không có booking
    await travelTour.destroy();
    res.json({ message: "Xóa tour du lịch thành công!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Cập nhật thông tin travel tour theo ID
exports.updateTravelTour = async (req, res) => {
  try {
    const travelTourId = req.params.id;
    const travelTour = await TravelTour.findByPk(travelTourId);

    if (!travelTour) {
      return res.status(404).json({ message: "Không tìm thấy tour du lịch!" });
    }

    const {
      tour_id,
      start_day,
      end_day,
      price_tour,
      max_people,
      start_time_depart,
      end_time_depart,
      start_time_close,
      end_time_close,
      children_price,
      toddler_price,
    } = req.body;

    // Validate thời gian khởi hành và kết thúc
    if (start_time_depart >= end_time_depart) {
      return res.status(400).json({
        message:
          "Thời gian khởi hành phải trước thời gian kết thúc cho ngày khởi hành!",
      });
    }
    if (start_time_close >= end_time_close) {
      return res.status(400).json({
        message:
          "Thời gian khởi hành phải trước thời gian kết thúc cho ngày kết thúc!",
      });
    }

    // Validate thời gian kết thúc phải sau thời gian khởi hành
    if (start_day < Date.now()) {
      return res
        .status(400)
        .json({ message: "Ngày bắt đầu phải ở tương lai!" });
    }
    if (end_day < start_day) {
      return res
        .status(400)
        .json({ message: "Ngày kết thúc phải sau ngày bắt đầu!" });
    }

    // Validate giá tour
    if (price_tour < 0) {
      return res.status(400).json({ message: "Giá tour phải lớn hơn 0!" });
    }

    // Nếu max_people được cập nhật, tính toán lại required_guides
    if (max_people !== undefined) {
      if (max_people <= 0) {
        return res
          .status(400)
          .json({ message: "Số lượng khách không hợp lệ!" });
      }
      travelTour.required_guides = calculateRequiredGuides(max_people);
      travelTour.max_people = max_people;
    }

    if (tour_id !== undefined) travelTour.tour_id = tour_id;
    if (start_day !== undefined) travelTour.start_day = start_day;
    if (end_day !== undefined) travelTour.end_day = end_day;
    if (price_tour !== undefined) travelTour.price_tour = price_tour;
    if (max_people !== undefined) travelTour.max_people = max_people;
    if (start_time_depart !== undefined)
      travelTour.start_time_depart = start_time_depart;
    if (end_time_depart !== undefined)
      travelTour.end_time_depart = end_time_depart;
    if (start_time_close !== undefined)
      travelTour.start_time_close = start_time_close;
    if (end_time_close !== undefined)
      travelTour.end_time_close = end_time_close;
    if (children_price !== undefined)
      travelTour.children_price = children_price;
    if (toddler_price !== undefined) travelTour.toddler_price = toddler_price;
    await travelTour.save();
    res.json({
      message: "Cập nhật tour du lịch thành công!",
      data: travelTour,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật tour du lịch với id=" + req.params.id,
      error: error.message,
    });
  }
};

// Đóng Tour tự động khi đủ số lượng người đăng ký
exports.closeTourWhenFull = async (req, res) => {
  try {
    const travelTourId = req.params.id;

    const travelTour = await TravelTour.findByPk(travelTourId);
    if (!travelTour) {
      return res.status(404).json({ message: "Không tìm thấy tour!" });
    }

    if (travelTour.current_people >= travelTour.max_people) {
      travelTour.active = false;
      await travelTour.save();

      res.status(200).json({
        message: "Tour đã được đóng vì đã đủ số lượng người đăng ký!",
        data: travelTour,
      });
    } else {
      res.status(400).json({
        message: "Tour chưa đủ số lượng người đăng ký để đóng.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi đóng tour",
      error: error.message,
    });
  }
};

exports.getListTravelTourForGuide = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      start_location_id,
      end_location_id,
      name_tour,
      start_day,
    } = req.query;

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
    const travelTourWhereCondition = {
      status: 0,
      active: 1,
    };

    if (start_day) {
      travelTourWhereCondition.start_day = {
        [Op.gte]: new Date(start_day),
      };
    }

    const offset = (page - 1) * limit;

    const { count, rows: travelTours } = await TravelTour.findAndCountAll({
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
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["start_day", "ASC"]],
    });

    if (!travelTours || travelTours.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy tour du lịch!",
        data: {
          totalItems: 0,
          totalPages: 0,
          currentPage: parseInt(page),
          items: [],
        },
      });
    }

    // Format lại dữ liệu trả về
    const formattedTravelTours = travelTours.map((travelTour) => {
      const travelTourData = travelTour.get({ plain: true });
      return {
        ...travelTourData,
        tour: {
          ...travelTourData.Tour,
          start_location: travelTourData.Tour.StartLocation || null,
          end_location: travelTourData.Tour.EndLocation || null,
        },
      };
    });

    res.json({
      message: "Lấy danh sách tour thành công!",
      data: {
        totalItems: count,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        items: formattedTravelTours,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Lỗi khi lấy tour du lịch",
      error: error.message,
    });
  }
};

exports.getFullTravelTours = async (req, res) => {
  try {
    const travelTours = await TravelTour.findAll({
      where: {
        current_people: {
          [Op.gte]: Sequelize.col("max_people"), // current_people >= max_people
        },
      },
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

    if (!travelTours || travelTours.length === 0) {
      return res.status(404).json({
        message: "Không có travelTour nào đã đủ số lượng người!",
      });
    }

    // Format lại dữ liệu trả về
    const formattedTravelTours = travelTours.map((travelTour) => {
      const travelTourData = travelTour.get({ plain: true });
      return {
        ...travelTourData,
        tour: {
          ...travelTourData.Tour,
          start_location: travelTourData.Tour?.startLocation || null,
          end_location: travelTourData.Tour?.endLocation || null,
        },
      };
    });

    res.json({
      message: "Lấy danh sách travelTour đã đủ số lượng người thành công!",
      data: formattedTravelTours,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách travelTour đã đủ số lượng người!",
      error: error.message,
    });
  }
};

// Lấy danh sách TravelTour mà Staff phụ trách và trạng thái gán hướng dẫn viên
exports.getTravelToursByStaffWithLocation = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { filter } = req.query;

    // Kiểm tra user_id có phải role Staff không
    const user = await User.findByPk(user_id);
    if (!user || user.role_id !== 2) {
      return res.status(400).json({ message: "Người dùng không phải Staff!" });
    }

    // Lấy danh sách Location mà Staff phụ trách
    const staffLocations = await db.StaffLocation.findAll({
      where: { user_id },
      attributes: ["location_id"],
    });

    if (!staffLocations.length) {
      return res
        .status(404)
        .json({ message: "Staff không phụ trách địa điểm nào!" });
    }

    const locationIds = staffLocations.map((loc) => loc.location_id);

    // Lấy danh sách TravelGuide có `is_current = true` và liên kết với các Location mà Staff phụ trách
    const travelGuides = await TravelGuide.findAll({
      include: [
        {
          model: db.TravelGuideLocation,
          as: "TravelGuideLocations",
          where: {
            location_id: { [Sequelize.Op.in]: locationIds },
            is_current: true, // Chỉ lấy địa điểm hiện tại
          },
          attributes: ["location_id"],
        },
      ],
    });

    if (!travelGuides.length) {
      return res.status(404).json({
        message: "Không tìm thấy TravelGuide nào phù hợp!",
      });
    }

    // Lấy danh sách location_id từ TravelGuideLocation
    const travelGuideLocationIds = travelGuides.flatMap((guide) =>
      guide.TravelGuideLocations.map((loc) => loc.location_id)
    );

    // Lấy danh sách TravelTour liên kết với các Location mà TravelGuide phụ trách
    const travelTours = await TravelTour.findAll({
      where: {
        guide_assignment_status: filter ? filter : { [Op.ne]: null }, // Lọc theo trạng thái nếu có
      },
      include: [
        {
          model: db.Tour,
          as: "Tour",
          where: {
            [Sequelize.Op.and]: [
              { start_location: { [Sequelize.Op.in]: locationIds } }, // start_location = current_location của TravelGuide
              { end_location: { [Sequelize.Op.in]: travelGuideLocationIds } }, // end_location = location trong TravelGuideLocation
            ],
          },
          include: [
            {
              model: db.Location,
              as: "startLocation",
              attributes: ["id", "name_location"],
            },
            {
              model: db.Location,
              as: "endLocation",
              attributes: ["id", "name_location"],
            },
          ],
        },
      ],
    });

    if (!travelTours.length) {
      return res.status(404).json({
        message: "Không tìm thấy tour nào phù hợp với điều kiện lọc!",
      });
    }

    // Format lại dữ liệu trả về
    const formattedTravelTours = travelTours.map((tour) => ({
      id: tour.id,
      name: tour.name,
      start_day: tour.start_day,
      end_day: tour.end_day,
      max_people: tour.max_people,
      assigned_guides: tour.assigned_guides,
      required_guides: tour.required_guides,
      guide_assignment_status: tour.guide_assignment_status,
      start_location: tour.Tour?.startLocation || null,
      end_location: tour.Tour?.endLocation || null,
    }));

    res.status(200).json({
      message: "Lấy danh sách TravelTour thành công!",
      data: formattedTravelTours,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách TravelTour:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách TravelTour!",
      error: error.message,
    });
  }
};

// Lấy danh sách TravelTour mà Staff phụ trách
exports.getTravelToursByStaffEndLocationWithBooking = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Kiểm tra user_id có phải role Staff không
    const user = await User.findByPk(user_id);
    if (!user || user.role_id !== 2) {
      return res.status(400).json({ message: "Người dùng không phải Staff!" });
    }

    // Lấy danh sách Location mà Staff phụ trách
    const staffLocations = await db.StaffLocation.findAll({
      where: { user_id },
      attributes: ["location_id"],
    });

    if (!staffLocations.length) {
      return res.status(404).json({
        message: "Staff không phụ trách địa điểm nào!",
      });
    }

    const locationIds = staffLocations.map((loc) => loc.location_id);

    // Lấy danh sách TravelTour có end_location trong bảng Tour trùng với location mà Staff phụ trách
    const travelTours = await TravelTour.findAll({
      where: {
        active: true, // Chỉ lấy các tour chưa đóng
      },
      include: [
        {
          model: Booking,
          as: "Bookings",
          required: true, // Chỉ lấy các TravelTour có Booking
        },
        {
          model: Tour,
          as: "Tour",
          where: {
            end_location: { [Sequelize.Op.in]: locationIds }, // end_location từ bảng Tour
          },
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

    if (!travelTours.length) {
      return res.status(404).json({
        message: "Không tìm thấy TravelTour nào phù hợp!",
      });
    }

    // Format lại dữ liệu trả về
    const formattedTravelTours = travelTours.map((travelTour) => ({
      id: travelTour.id,
      name: travelTour.Tour?.name_tour || null,
      start_day: travelTour.start_day,
      end_day: travelTour.end_day,
      max_people: travelTour.max_people,
      current_people: travelTour.current_people,
      start_location: travelTour.Tour?.startLocation || null,
      end_location: travelTour.Tour?.endLocation || null,
      bookings: travelTour.Bookings.map((booking) => ({
        id: booking.id,
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        number_adult: booking.number_adult,
        number_children: booking.number_children,
        number_toddler: booking.number_toddler,
        booking_date: booking.booking_date,
      })),
    }));

    res.status(200).json({
      message: "Lấy danh sách TravelTour thành công!",
      data: formattedTravelTours,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách TravelTour:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách TravelTour!",
      error: error.message,
    });
  }
};
exports.closeTravelTour = async (req, res) => {
  try {
    const { id } = req.params;
    const travelTour = await TravelTour.findByPk(id);
    if (!travelTour) {
      return res.status(404).json({ message: "Không tìm thấy tour du lịch!" });
    }
    if (travelTour.active === false) {
      return res.status(400).json({ message: "Tour du lịch đã đóng!" });
    }

    travelTour.active = false;
    await travelTour.save();

    res.status(200).json({
      message: "Đóng tour du lịch thành công!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi đóng tour du lịch!",
      error: error.message,
    });
  }
};
