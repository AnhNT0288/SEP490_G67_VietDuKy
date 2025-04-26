const db = require("../models");
const Sequelize = require("sequelize");
const TravelGuide = db.TravelGuide;
const User = db.User;
const Feedback = db.Feedback;
const Tour = db.Tour;
const Customer = db.Customer;
const TravelGuideLocation = db.TravelGuideLocation;
const Location = db.Location;
const TravelTour = db.TravelTour;
const GuideTour = db.GuideTour;

//Lấy tất cả TravelGuide
exports.getAllTravelGuides = async (req, res) => {
  try {
    const travelGuides = await TravelGuide.findAll();
    res.status(200).json({
      message: "Lấy danh sách hướng dẫn viên du lịch thành công!",
      data: travelGuides,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách hướng dẫn viên du lịch!",
      error: error.message,
    });
  }
};

//Lấy tất cả TravelGuide by ID
exports.getTravelGuidesByUser = async (req, res) => {
  try {
    const userId = req.params.user_id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    const travelGuides = await TravelGuide.findByPk(userId);
    if (!travelGuides) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy hướng dẫn viên du lịch!" });
    }

    res.status(200).json({
      message: "Lấy danh sách hướng dẫn viên du lịch thành công!",
      data: travelGuides,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách hướng dẫn viên du lịch!",
      error: error.message,
    });
  }
};

// Lấy thông tin Travel Guide theo User ID
exports.getTravelGuidesByUserID = async (req, res) => {
  try {
    const userId = req.params.id;

    // Kiểm tra người dùng có tồn tại không
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    // Tìm người dùng kèm theo thông tin hướng dẫn viên
    const travelGuide = await User.findOne({
      where: { id: userId },
      attributes: ["id", "email", "password", "displayName", "avatar"],
      include: [
        {
          model: TravelGuide,
          attributes: [
            "id",
            "user_id",
            "first_name",
            "last_name",
            "email",
            "number_phone",
            "gender_guide",
            "birth_date",
          ],
        },
      ],
    });

    // Nếu không có travelGuide hoặc không có travelGuide data, hoặc user_id không khớp
    if (
      !travelGuide ||
      !travelGuide.TravelGuide || // nếu alias khác, sửa lại
      travelGuide.TravelGuide.user_id !== Number(userId)
    ) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy hướng dẫn viên du lịch!" });
    }

    res.status(200).json({
      message: "Lấy thông tin hướng dẫn viên du lịch thành công!",
      data: travelGuide,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy thông tin hướng dẫn viên du lịch!",
      error: error.message,
    });
  }
};

// Lấy tất cả Feedback cho TravelGuide
exports.getFeedbackByTravelGuide = async (req, res) => {
  try {
    const travelGuideId = req.params.travelGuideId;

    const travelGuide = await TravelGuide.findByPk(travelGuideId);
    if (!travelGuide) {
      return res.status(404).json({ message: "Hướng dẫn viên không tồn tại!" });
    }

    // Lấy tất cả feedback của hướng dẫn viên
    const feedbacks = await Feedback.findAll({
      where: { travel_guide_id: travelGuideId },
      include: [
        { model: Tour, as: "tour" },
        {
          model: Customer,
          as: "customer",
          attributes: ["first_name", "last_name"],
        },
      ],
    });

    if (feedbacks.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy feedback nào cho hướng dẫn viên này",
      });
    }

    res.status(200).json({
      message: "Lấy feedback của hướng dẫn viên thành công!",
      data: feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy feedback của hướng dẫn viên",
      error: error.message,
    });
  }
};

//Tạo mới TravelGuide
exports.createTravelGuide = async (req, res) => {
  try {
    const {
      user_id,
      first_name,
      last_name,
      gender_guide,
      email,
      number_phone,
      birth_date,
      locations,
    } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    const newTravelGuide = await TravelGuide.create({
      user_id,
      first_name,
      last_name,
      gender_guide,
      email,
      number_phone,
      birth_date,
    });

    // Gán các địa điểm phụ trách cho TravelGuide
    if (locations && locations.length > 0) {
      for (let locationId of locations) {
        await TravelGuideLocation.create({
          travel_guide_id: newTravelGuide.id,
          location_id: locationId,
        });
      }
    }

    res.status(201).json({
      message: "Tạo hướng dẫn viên du lịch thành công!",
      data: newTravelGuide,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tạo hướng dẫn viên du lịch!",
      error: error.message,
    });
  }
};

//Cập nhật thông tin TravelGuide
exports.updateTravelGuide = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { locations, role_id } = req.body;

    // Tìm User bằng userId
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    // Kiểm tra xem User đã là TravelGuide chưa
    let travelGuide = await TravelGuide.findOne({ where: { user_id: userId } });

    // Nếu chưa, tạo mới TravelGuide
    if (!travelGuide) {
      const [first_name, ...last_name_parts] = (user.displayName || "").split(
        " "
      );
      const last_name = last_name_parts.join(" ") || "N/A";

      travelGuide = await TravelGuide.create({
        user_id: userId,
        first_name: first_name || "N/A",
        last_name: last_name || "N/A",
        email: user.email,
      });
    } else {
      // Cập nhật thông tin TravelGuide từ displayName
      const [first_name, ...last_name_parts] = (user.displayName || "").split(
        " "
      );
      travelGuide.first_name = first_name || "N/A";
      travelGuide.last_name = last_name_parts.join(" ") || "N/A";
      await travelGuide.save();
    }

    // Cập nhật role_id cho User
    user.role_id = role_id || 4; // Mặc định role_id là 4 (Travel Guide)
    await user.save();

    // Cập nhật danh sách địa điểm phụ trách
    if (locations && locations.length > 0) {
      // Xóa các địa điểm hiện tại
      await TravelGuideLocation.destroy({
        where: { travel_guide_id: travelGuide.id },
      });

      // Gán các địa điểm mới
      for (let locationId of locations) {
        await TravelGuideLocation.create({
          travel_guide_id: travelGuide.id,
          location_id: locationId,
        });
      }
    }

    // Lấy danh sách địa điểm phụ trách
    const assignedLocations = await TravelGuideLocation.findAll({
      where: { travel_guide_id: travelGuide.id },
      include: [
        {
          model: Location,
          as: "location",
          attributes: ["id", "name_location"],
        },
      ],
    });

    res.status(200).json({
      message: "Cập nhật thông tin hướng dẫn viên thành công!",
      data: {
        user,
        travelGuide,
        locations: assignedLocations.map((loc) => loc.location),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật thông tin hướng dẫn viên!",
      error: error.message,
    });
  }
};

//Xóa TravelGuide
exports.deleteTravelGuide = async (req, res) => {
  try {
    const travelGuideId = req.params.id;

    const travelGuide = await TravelGuide.findByPk(travelGuideId);
    if (!travelGuide) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy hướng dẫn viên du lịch!" });
    }

    await travelGuide.destroy();

    res.status(200).json({
      message: "Xóa hướng dẫn viên du lịch thành công!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa hướng dẫn viên du lịch!",
      error: error.message,
    });
  }
};

// Lấy tất cả Tour cho TravelGuide dựa trên địa điểm phụ trách (đề xuất cho TravelGuide)
exports.getToursByTravelGuideLocation = async (req, res) => {
  try {
    const travelGuideId = req.params.travelGuideId;

    const travelGuide = await TravelGuide.findByPk(travelGuideId);
    if (!travelGuide) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy hướng dẫn viên!" });
    }

    // Lấy danh sách các địa điểm mà TravelGuide này phụ trách
    const locations = await TravelGuideLocation.findAll({
      where: { travel_guide_id: travelGuideId },
      include: [
        {
          model: Location,
          as: "location",
          attributes: ["id", "name_location"],
        },
      ],
    });

    const locationIds = locations.map((location) => location.location.id);

    // Tìm các Tour có liên quan đến các địa điểm phụ trách
    const tours = await Tour.findAll({
      where: {
        start_location: { [Sequelize.Op.in]: locationIds },
        end_location: { [Sequelize.Op.in]: locationIds },
      },
      include: [
        { model: Location, as: "startLocation" },
        { model: Location, as: "endLocation" },
      ],
    });

    res.status(200).json({
      message: "Lấy danh sách tour theo địa điểm phụ trách thành công!",
      data: tours,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách tour",
      error: error.message,
    });
  }
};

// Lấy danh sách TravelGuide theo Location
exports.getTravelGuidesByLocation = async (req, res) => {
  try {
    const locationId = req.params.locationId;
    const { start_day, end_day } = req.query; // Nhận start_day và end_day từ query params

    // Kiểm tra xem địa điểm có tồn tại không
    const location = await Location.findByPk(locationId);
    if (!location) {
      return res.status(404).json({ message: "Không tìm thấy địa điểm!" });
    }

    // Lấy danh sách các TravelGuide liên kết với địa điểm
    const travelGuides = await TravelGuide.findAll({
      include: [
        {
          model: TravelGuideLocation,
          as: "TravelGuideLocations",
          where: { location_id: locationId },
          include: [
            {
              model: Location,
              as: "location",
              attributes: ["id", "name_location"],
            },
          ],
        },
      ],
    });

    if (!travelGuides.length) {
      return res.status(404).json({
        message: "Không tìm thấy hướng dẫn viên nào cho địa điểm này!",
      });
    }

    // Lọc ra các hướng dẫn viên không có lịch trình trùng lặp
    const availableGuides = [];
    for (const guide of travelGuides) {
      const overlappingAssignments = await GuideTour.findAll({
        where: {
          travel_guide_id: guide.id,
        },
        include: [
          {
            model: TravelTour,
            as: "travelTour",
            where: {
              [Sequelize.Op.or]: [
                {
                  start_day: {
                    [Sequelize.Op.between]: [start_day, end_day],
                  },
                },
                {
                  end_day: {
                    [Sequelize.Op.between]: [start_day, end_day],
                  },
                },
                {
                  [Sequelize.Op.and]: [
                    { start_day: { [Sequelize.Op.lte]: start_day } },
                    { end_day: { [Sequelize.Op.gte]: end_day } },
                  ],
                },
              ],
            },
          },
        ],
      });

      if (overlappingAssignments.length === 0) {
        availableGuides.push(guide);
      }
    }

    if (!availableGuides.length) {
      return res.status(404).json({
        message:
          "Không tìm thấy hướng dẫn viên nào khả dụng trong thời gian này!",
      });
    }

    res.status(200).json({
      message: "Lấy danh sách hướng dẫn viên theo địa điểm thành công!",
      data: availableGuides,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách hướng dẫn viên theo địa điểm:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách hướng dẫn viên theo địa điểm!",
      error: error.message,
    });
  }
};

// Lấy danh sách các địa điểm được gán cho TravelGuide
exports.getLocationsByTravelGuide = async (req, res) => {
  try {
    const { travel_guide_id } = req.params;

    // Kiểm tra TravelGuide có tồn tại không
    const travelGuide = await TravelGuide.findByPk(travel_guide_id);
    if (!travelGuide) {
      return res.status(404).json({ message: "Không tìm thấy TravelGuide!" });
    }

    // Lấy danh sách các địa điểm được gán cho TravelGuide
    const locations = await TravelGuideLocation.findAll({
      where: { travel_guide_id },
      include: [
        {
          model: Location,
          as: "location",
          attributes: ["id", "name_location"],
        },
      ],
    });

    if (locations.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy địa điểm nào được gán cho TravelGuide này!",
      });
    }

    res.status(200).json({
      message: "Lấy danh sách địa điểm thành công!",
      data: locations.map((loc) => loc.location),
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách địa điểm:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách địa điểm!",
      error: error.message,
    });
  }
};

// Gán thêm địa điểm cho TravelGuide
exports.addLocationsToTravelGuide = async (req, res) => {
  try {
    const { travel_guide_id, location_ids } = req.body;

    // Kiểm tra TravelGuide có tồn tại không
    const travelGuide = await TravelGuide.findByPk(travel_guide_id);
    if (!travelGuide) {
      return res.status(404).json({ message: "Không tìm thấy TravelGuide!" });
    }

    // Kiểm tra danh sách location_ids
    if (!Array.isArray(location_ids) || location_ids.length === 0) {
      return res
        .status(400)
        .json({ message: "Danh sách location_ids không hợp lệ!" });
    }

    const addedLocations = [];
    const existingLocations = [];

    // Gán từng Location cho TravelGuide
    for (const location_id of location_ids) {
      // Kiểm tra Location có tồn tại không
      const location = await Location.findByPk(location_id);
      if (!location) {
        return res
          .status(404)
          .json({ message: `Không tìm thấy Location với ID ${location_id}!` });
      }

      // Kiểm tra xem Location đã được gán cho TravelGuide chưa
      const existingAssignment = await TravelGuideLocation.findOne({
        where: { travel_guide_id, location_id },
      });

      if (existingAssignment) {
        existingLocations.push(location_id);
        continue;
      }

      // Gán Location mới
      await TravelGuideLocation.create({ travel_guide_id, location_id });
      addedLocations.push(location_id);
    }

    res.status(200).json({
      message: "Gán địa điểm mới cho TravelGuide thành công!",
      data: {
        addedLocations,
        existingLocations,
      },
    });
  } catch (error) {
    console.error("Lỗi khi gán địa điểm mới cho TravelGuide:", error);
    res.status(500).json({
      message: "Lỗi khi gán địa điểm mới cho TravelGuide!",
      error: error.message,
    });
  }
};

//Xóa địa điểm khỏi TravelGuide
exports.deleteLocationFromTravelGuide = async (req, res) => {
  try {
    const { travel_guide_id, location_id } = req.body;

    // Kiểm tra TravelGuide có tồn tại không
    const travelGuide = await TravelGuide.findByPk(travel_guide_id);
    if (!travelGuide) {
      return res.status(404).json({ message: "Không tìm thấy TravelGuide!" });
    }

    // Kiểm tra Location có tồn tại không
    const location = await Location.findByPk(location_id);
    if (!location) {
      return res.status(404).json({ message: "Không tìm thấy Location!" });
    }

    // Kiểm tra xem TravelGuide có được gán với Location này không
    const travelGuideLocation = await TravelGuideLocation.findOne({
      where: { travel_guide_id, location_id },
    });

    if (!travelGuideLocation) {
      return res.status(404).json({
        message: "TravelGuide không được gán với Location này!",
      });
    }

    // Xóa gán kết nối giữa TravelGuide và Location
    await travelGuideLocation.destroy();

    res.status(200).json({
      message: "Xóa địa điểm khỏi TravelGuide thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi xóa địa điểm khỏi TravelGuide:", error);
    res.status(500).json({
      message: "Lỗi khi xóa địa điểm khỏi TravelGuide!",
      error: error.message,
    });
  }
};

// Gán TravelGuide cho Staff
exports.assignTravelGuideToStaff = async (req, res) => {
  try {
    const { user_id, travel_guide_ids, group_name } = req.body;

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

    // Lấy danh sách TravelGuide liên kết với các Location
    const travelGuides = await TravelGuide.findAll({
      where: { id: travel_guide_ids },
      include: [
        {
          model: TravelGuideLocation,
          as: "TravelGuideLocations",
          where: { location_id: locationIds },
        },
      ],
    });

    if (travelGuides.length !== travel_guide_ids.length) {
      return res.status(400).json({
        message:
          "Một số hướng dẫn viên không tồn tại hoặc không thuộc các địa điểm mà Staff phụ trách!",
      });
    }

    // Kiểm tra xem TravelGuide nào đã được gán
    const alreadyAssigned = travelGuides.filter((guide) => guide.status === 1);
    if (alreadyAssigned.length > 0) {
      return res.status(400).json({
        message: "Một số hướng dẫn viên đã được gán cho Staff khác!",
        data: alreadyAssigned.map((guide) => ({
          id: guide.id,
          staff_id: guide.staff_id,
        })),
      });
    }

    // Gán Staff và tên nhóm cho các TravelGuide
    await Promise.all(
      travelGuides.map((guide) =>
        guide.update({ staff_id: user_id, status: 1, group_name })
      )
    );

    res.status(200).json({ message: "Phân chia hướng dẫn viên thành công!" });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi phân chia hướng dẫn viên!",
      error: error.message,
    });
  }
};

// Xóa TravelGuide khỏi Staff
exports.unassignTravelGuidesFromStaff = async (req, res) => {
  try {
    const { user_id, travel_guide_ids } = req.body;

    // Kiểm tra đầu vào
    if (
      !user_id ||
      !Array.isArray(travel_guide_ids) ||
      travel_guide_ids.length === 0
    ) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ!" });
    }

    // Kiểm tra xem user_id có phải là Staff không
    const staff = await User.findByPk(user_id);
    if (!staff || staff.role_id !== 2) {
      return res.status(400).json({ message: "Người dùng không phải Staff!" });
    }

    // Lấy danh sách TravelGuide theo ID
    const travelGuides = await TravelGuide.findAll({
      where: { id: travel_guide_ids, staff_id: user_id }, // Chỉ lấy các TravelGuide được gán cho Staff này
    });

    if (travelGuides.length !== travel_guide_ids.length) {
      return res.status(404).json({
        message:
          "Một số hướng dẫn viên không tồn tại hoặc không được gán cho Staff này!",
      });
    }

    // Lấy tên nhóm trước khi xóa
    const groupName = travelGuides[0]?.group_name || null;

    // Xóa Staff khỏi các TravelGuide và cập nhật trạng thái
    await Promise.all(
      travelGuides.map((guide) => {
        guide.staff_id = null;
        guide.status = 0;
        guide.group_name = null;
        return guide.save();
      })
    );

    res.status(200).json({
      message: "Xóa hướng dẫn viên khỏi Staff thành công!",
      group: groupName,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa TravelGuide khỏi Staff!",
      error: error.message,
    });
  }
};

// Thêm TravelGuide vào nhóm của Staff
exports.addTravelGuideToStaffGroup = async (req, res) => {
  try {
    const { user_id, travel_guide_id, group_name } = req.body;

    // Kiểm tra user_id có phải role Staff không
    const staff = await User.findByPk(user_id);
    if (!staff || staff.role_id !== 2) {
      return res.status(400).json({ message: "Người dùng không phải Staff!" });
    }

    // Kiểm tra TravelGuide có tồn tại không
    const travelGuide = await TravelGuide.findByPk(travel_guide_id);
    if (!travelGuide) {
      return res.status(404).json({ message: "Không tìm thấy TravelGuide!" });
    }

    // Kiểm tra xem TravelGuide đã được gán cho Staff khác chưa
    if (travelGuide.staff_id) {
      return res.status(400).json({
        message: "TravelGuide đã được gán cho Staff khác!",
        data: { staff_id: travelGuide.staff_id },
      });
    }

    // Gán TravelGuide vào nhóm của Staff
    travelGuide.staff_id = user_id;
    travelGuide.group_name = group_name || travelGuide.group_name; // Cập nhật tên nhóm nếu có
    travelGuide.status = 1; // Đánh dấu là đã được gán
    await travelGuide.save();

    res.status(200).json({
      message: "Thêm TravelGuide vào nhóm thành công!",
      data: travelGuide,
    });
  } catch (error) {
    console.error("Lỗi khi thêm TravelGuide vào nhóm:", error);
    res.status(500).json({
      message: "Lỗi khi thêm TravelGuide vào nhóm!",
      error: error.message,
    });
  }
};

// Lấy danh sách TravelGuide theo Staff
exports.getTravelGuidesByStaff = async (req, res) => {
  try {
    const { staff_id } = req.params;

    // Kiểm tra staff_id có phải role Staff không
    const staff = await User.findByPk(staff_id);
    if (!staff || staff.role_id !== 2) {
      return res.status(400).json({ message: "Người dùng không phải Staff!" });
    }

    // Lấy danh sách Location mà Staff phụ trách
    const staffLocations = await db.StaffLocation.findAll({
      where: { user_id: staff_id },
      attributes: ["location_id"],
    });

    if (!staffLocations.length) {
      return res
        .status(404)
        .json({ message: "Staff không phụ trách địa điểm nào!" });
    }
    
    const locationIds = staffLocations.map((loc) => loc.location_id);
    

    // Lấy danh sách TravelGuide liên kết với các Location mà Staff phụ trách
    const travelGuides = await TravelGuide.findAll({
      where: { staff_id: null }, // Chỉ lấy các TravelGuide chưa được gán cho Staff
      include: [
        {
          model: TravelGuideLocation,
          as: "TravelGuideLocations",
          where: {location_id: locationIds},
          include: [
            {
              model: Location,
              as: "location",
              attributes: ["id", "name_location"],
            },
          ],
        },
      ],
    });
    

    // Lọc ra các TravelGuide chưa được gán vào TravelTour
    // const unassignedTravelGuides = [];
    // for (const guide of travelGuides) {
    //   const assignedTours = await GuideTour.findOne({
    //     where: { travel_guide_id: guide.id },
    //   });

    //   if (!assignedTours) {
    //     unassignedTravelGuides.push(guide);
    //   }
    // }

    res.status(200).json({
      message: "Lấy danh sách hướng dẫn viên thành công!",
      data: travelGuides,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách hướng dẫn viên!",
      error: error.message,
    });
  }
};

// Cập nhật thông tin cá nhân của TravelGuide
exports.updatePersonalInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { gender_guide, number_phone, birth_date } = req.body;

    const travelGuide = await TravelGuide.findByPk(id);
    if (!travelGuide) {
      return res.status(404).json({ message: "Không tìm thấy TravelGuide!" });
    }

    if (gender_guide !== undefined) travelGuide.gender_guide = gender_guide;
    if (number_phone !== undefined) travelGuide.number_phone = number_phone;
    if (birth_date !== undefined) travelGuide.birth_date = birth_date;

    await travelGuide.save();

    res.status(200).json({
      message: "Cập nhật thông tin cá nhân thành công!",
      data: travelGuide,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật thông tin cá nhân!",
      error: error.message,
    });
  }
};

// Lấy danh sách TravelGuide với các điều kiện lọc
exports.getAllTravelGuides = async (req, res) => {
  try {
    const { search, gender, location } = req.query;

    // Tạo điều kiện lọc
    const whereCondition = {};

    // Lọc theo giới tính
    if (gender) {
      whereCondition.gender_guide = gender;
    }

    // Tìm kiếm theo tên
    if (search) {
      const normalizedSearch = search.trim().toLowerCase();
      whereCondition[Sequelize.Op.or] = [
        Sequelize.where(
          Sequelize.fn(
            "LOWER",
            Sequelize.fn("REPLACE", Sequelize.col("first_name"), " ", "")
          ),
          { [Sequelize.Op.like]: `%${normalizedSearch}%` }
        ),
        Sequelize.where(
          Sequelize.fn(
            "LOWER",
            Sequelize.fn("REPLACE", Sequelize.col("last_name"), " ", "")
          ),
          { [Sequelize.Op.like]: `%${normalizedSearch}%` }
        ),
      ];
    }

    // Lọc theo địa điểm
    let travelGuides;
    if (location) {
      travelGuides = await TravelGuide.findAll({
        where: whereCondition,
        include: [
          {
            model: TravelGuideLocation,
            as: "TravelGuideLocations",
            where: { location_id: location },
            include: [
              {
                model: Location,
                as: "location",
                attributes: ["id", "name_location"],
              },
            ],
          },
        ],
      });
    } else {
      travelGuides = await TravelGuide.findAll({
        where: whereCondition,
        include: [
          {
            model: TravelGuideLocation,
            as: "TravelGuideLocations",
            include: [
              {
                model: Location,
                as: "location",
                attributes: ["id", "name_location"],
              },
            ],
          },
        ],
      });
    }

    res.status(200).json({
      message: "Lấy danh sách hướng dẫn viên du lịch thành công!",
      data: travelGuides,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách hướng dẫn viên du lịch!",
      error: error.message,
    });
  }
};

// Cập nhật vị trí hiện tại của TravelGuide
exports.updateCurrentLocation = async (req, res) => {
  try {
    const { travel_guide_id } = req.params;
    const { location_id } = req.body;

    // Kiểm tra TravelGuide có tồn tại không
    const travelGuide = await TravelGuide.findByPk(travel_guide_id);
    if (!travelGuide) {
      return res.status(404).json({ message: "Không tìm thấy TravelGuide!" });
    }

    // Kiểm tra Location có tồn tại không
    const location = await Location.findByPk(location_id);
    if (!location) {
      return res.status(404).json({ message: "Không tìm thấy Location!" });
    }

    // Cập nhật `is_current` trong bảng TravelGuideLocation
    await TravelGuideLocation.update(
      { is_current: false }, // Đặt tất cả các địa điểm khác thành không phải hiện tại
      { where: { travel_guide_id } }
    );

    const updatedLocation = await TravelGuideLocation.update(
      { is_current: true }, // Đặt địa điểm mới là hiện tại
      { where: { travel_guide_id, location_id } }
    );

    if (!updatedLocation[0]) {
      return res.status(404).json({
        message: "TravelGuide không được gán với Location này!",
      });
    }

    res.status(200).json({
      message: "Cập nhật vị trí hiện tại thành công!",
      data: { travel_guide_id, location_id },
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật vị trí hiện tại:", error);
    res.status(500).json({
      message: "Lỗi khi cập nhật vị trí hiện tại!",
      error: error.message,
    });
  }
};

// Lấy vị trí hiện tại của TravelGuide
exports.getCurrentLocation = async (req, res) => {
  try {
    const { travel_guide_id } = req.params;

    // Kiểm tra TravelGuide có tồn tại không
    const travelGuide = await TravelGuide.findByPk(travel_guide_id);
    if (!travelGuide) {
      return res.status(404).json({ message: "Không tìm thấy TravelGuide!" });
    }

    // Lấy địa điểm hiện tại từ bảng TravelGuideLocation
    const currentLocation = await TravelGuideLocation.findOne({
      where: { travel_guide_id, is_current: true },
      include: [
        {
          model: Location,
          as: "location",
          attributes: ["id", "name_location"],
        },
      ],
    });

    if (!currentLocation) {
      return res.status(404).json({
        message: "Không tìm thấy vị trí hiện tại của TravelGuide!",
      });
    }

    res.status(200).json({
      message: "Lấy vị trí hiện tại thành công!",
      data: currentLocation.location,
    });
  } catch (error) {
    console.error("Lỗi khi lấy vị trí hiện tại:", error);
    res.status(500).json({
      message: "Lỗi khi lấy vị trí hiện tại!",
      error: error.message,
    });
  }
};

// Lấy danh sách TravelGuide đã được gán cho Staff
exports.getAssignedTravelGuidesByStaff = async (req, res) => {
  try {
    const { staff_id } = req.params;

    // Kiểm tra staff_id có phải role Staff không
    const staff = await User.findByPk(staff_id);
    if (!staff || staff.role_id !== 2) {
      return res.status(400).json({ message: "Người dùng không phải Staff!" });
    }

    // Lấy danh sách TravelGuide đã được gán cho Staff
    const assignedTravelGuides = await TravelGuide.findAll({
      where: { staff_id, status: 1 }, // Chỉ lấy các TravelGuide đã được gán
      include: [
        {
          model: TravelGuideLocation,
          as: "TravelGuideLocations",
          include: [
            {
              model: Location,
              as: "location",
              attributes: ["id", "name_location"],
            },
          ],
        },
      ],
    });

    if (!assignedTravelGuides.length) {
      return res.status(404).json({
        message: "Không tìm thấy hướng dẫn viên nào đã được gán cho Staff này!",
      });
    }

    res.status(200).json({
      message: "Lấy danh sách hướng dẫn viên đã được gán thành công!",
      data: assignedTravelGuides,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách hướng dẫn viên đã được gán:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách hướng dẫn viên đã được gán!",
      error: error.message,
    });
  }
};

// Lấy danh sách TravelGuide theo Staff và Location
exports.getTravelGuidesByStaffWithLocation = async (req, res) => {
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

    // Lấy danh sách TravelGuide liên kết với các Location mà Staff phụ trách
    const travelGuides = await TravelGuide.findAll({
      include: [
        {
          model: TravelGuideLocation,
          as: "TravelGuideLocations",
          where: {
            location_id: { [Sequelize.Op.in]: locationIds },
          },
          attributes: ["location_id", "is_current"],
          include: [
            {
              model: Location,
              as: "location",
              attributes: ["id", "name_location"],
            },
          ],
        },
        {
          model: GuideTour,
          as: "GuideTours",
          include: [
            {
              model: TravelTour,
              as: "travelTour",
              include: [
                {
                  model: Tour,
                  as: "Tour",
                  where: {
                    [Sequelize.Op.and]: [
                      { start_location: { [Sequelize.Op.in]: locationIds } }, // start_location = location với is_current = true
                      { end_location: { [Sequelize.Op.in]: locationIds } }, // end_location = location được gán cho TravelGuide
                    ],
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
            },
          ],
        },
      ],
    });

    if (!travelGuides.length) {
      return res.status(404).json({
        message: "Không tìm thấy TravelGuide nào phù hợp!",
      });
    }

    // Format lại dữ liệu trả về
    const formattedTravelGuides = travelGuides.map((guide) => ({
      id: guide.id,
      first_name: guide.first_name,
      last_name: guide.last_name,
      email: guide.email,
      phone: guide.number_phone,
      gender: guide.gender_guide,
      current_location:
        guide.TravelGuideLocations.find((loc) => loc.is_current)?.location ||
        null,
      assigned_locations: guide.TravelGuideLocations.map((loc) => ({
        id: loc.location_id,
        name: loc.location.name_location,
      })),
      tours: guide.GuideTours.map((guideTour) => {
        const travelTour = guideTour.TravelTour;
        const tour = travelTour?.Tour;

        return {
          id: travelTour?.id || null,
          name: tour?.name_tour || null,
          start_location: tour?.startLocation || null,
          end_location: tour?.endLocation || null,
        };
      }),
    }));

    res.status(200).json({
      message: "Lấy danh sách TravelGuide thành công!",
      data: formattedTravelGuides,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách TravelGuide:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách TravelGuide!",
      error: error.message,
    });
  }
};

// Lấy danh sách TravelGuide theo TravelTour
exports.getTravelGuidesByTravelTour = async (req, res) => {
  try {
    const { travel_tour_id } = req.params;

    // Kiểm tra TravelTour có tồn tại không
    const travelTour = await TravelTour.findByPk(travel_tour_id, {
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
      return res.status(404).json({ message: "Không tìm thấy TravelTour!" });
    }

    // Lấy danh sách GuideTour liên kết với TravelTour
    const guideTours = await GuideTour.findAll({
      where: { travel_tour_id },
      include: [
        {
          model: TravelGuide,
          as: "travelGuide",
          include: [
            {
              model: TravelGuideLocation,
              as: "TravelGuideLocations",
              include: [
                {
                  model: Location,
                  as: "location",
                  attributes: ["id", "name_location"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!guideTours.length) {
      return res.status(404).json({
        message: "Không tìm thấy hướng dẫn viên nào cho TravelTour này!",
      });
    }

    // Format lại dữ liệu trả về
    const formattedGuides = guideTours.map((guideTour) => {
      const guide = guideTour.travelGuide;
      const currentLocation = guide.TravelGuideLocations.find(
        (loc) => loc.is_current
      )?.location;

      return {
        id: guide.id,
        first_name: guide.first_name,
        last_name: guide.last_name,
        email: guide.email,
        phone: guide.number_phone,
        gender: guide.gender_guide,
        start_location: currentLocation || null, // start_location = location với is_current = true
        end_location: guide.TravelGuideLocations.map((loc) => ({
          id: loc.location_id,
          name: loc.location.name_location,
        })), // end_location = location được gán cho TravelGuide
      };
    });

    res.status(200).json({
      message: "Lấy danh sách TravelGuide thành công!",
      data: formattedGuides,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách TravelGuide:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách TravelGuide!",
      error: error.message,
    });
  }
};
