const db = require("../models");
const Sequelize = require("sequelize");
const TravelGuide = db.TravelGuide;
const User = db.User;
const Feedback = db.Feedback;
const Tour = db.Tour;
const Customer = db.Customer;
const TravelGuideLocation = db.TravelGuideLocation;
const Location = db.Location;

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

    res.status(200).json({
      message: "Cập nhật thông tin hướng dẫn viên thành công!",
      data: {
        user,
        travelGuide,
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

    if (travelGuides.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy hướng dẫn viên nào cho địa điểm này!",
      });
    }

    res.status(200).json({
      message: "Lấy danh sách hướng dẫn viên theo địa điểm thành công!",
      data: travelGuides,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách hướng dẫn viên theo địa điểm!",
      error: error.message,
    });
  }
};

// Gán TravelGuide cho Staff
exports.assignTravelGuideToStaff = async (req, res) => {
  try {
    const { user_id, travel_guide_ids } = req.body;

    // Kiểm tra user_id có phải role Staff không
    const user = await User.findByPk(user_id);
    if (!user || user.role_id !== 2) {
      return res.status(400).json({ message: "Người dùng không phải Staff!" });
    }

    // Kiểm tra các TravelGuide có tồn tại không
    const travelGuides = await TravelGuide.findAll({
      where: { id: travel_guide_ids },
    });

    if (travelGuides.length !== travel_guide_ids.length) {
      return res
        .status(400)
        .json({ message: "Một số TravelGuide không tồn tại!" });
    }

    // Gán Staff cho các TravelGuide
    await Promise.all(
      travelGuides.map(
        (guide) => guide.update({ staff_id: user_id }) // Lưu user_id vào cột staff_id
      )
    );

    res.status(200).json({ message: "Phân chia TravelGuide thành công!" });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi phân chia TravelGuide!",
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

    // Lấy danh sách TravelGuide của Staff
    const travelGuides = await TravelGuide.findAll({
      where: { staff_id },
    });

    res.status(200).json({
      message: "Lấy danh sách TravelGuide thành công!",
      data: travelGuides,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách TravelGuide!",
      error: error.message,
    });
  }
};
