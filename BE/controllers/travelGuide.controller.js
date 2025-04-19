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
    const { user_id, travel_guide_ids, group_name } = req.body;

    // Kiểm tra user_id có phải role Staff không
    const user = await User.findByPk(user_id);
    if (!user || user.role_id !== 2) {
      return res.status(400).json({ message: "Người dùng không phải Staff!" });
    }

    // Lấy danh sách TravelGuide
    const travelGuides = await TravelGuide.findAll({
      where: { id: travel_guide_ids },
    });

    if (travelGuides.length !== travel_guide_ids.length) {
      return res
        .status(400)
        .json({ message: "Một số hướng dẫn viên không tồn tại!" });
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

    // Xóa Staff khỏi các TravelGuide và cập nhật trạng thái
    await Promise.all(
      travelGuides.map((guide) => {
        guide.staff_id = null;
        guide.status = 0; // Đặt lại trạng thái chưa được gán
        return guide.save();
      })
    );

    res
      .status(200)
      .json({ message: "Xóa hướng dẫn viên khỏi Staff thành công!" });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa TravelGuide khỏi Staff!",
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
