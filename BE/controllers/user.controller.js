const db = require("../models");
const User = db.User;
const Role = db.Role;
const bcrypt = require("bcryptjs");
const StaffProfile = db.StaffProfile;
const StaffLocation = db.StaffLocation;
const TravelTour = db.TravelTour;
const Location = db.Location;
const Tour = db.Tour;
const { Op, Sequelize } = require("sequelize");

// Lấy danh sách tất cả User
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({
      message: "Lấy danh sách người dùng thành công!",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách người dùng!",
      error: error.message,
    });
  }
};

//Lấy một User theo ID
exports.getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng!",
      });
    }
    res.json({
      message: "Lấy thông tin người dùng thành công!",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy thông tin người dùng!",
      error: error.message,
    });
  }
};

//Thêm một User mới
exports.addNewUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const avatarUrl = req.file ? req.file.path : null;

    // Kiểm tra xem username đã tồn tại chưa
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Tên người dùng đã tồn tại" });
    }

    // Hash password bằng bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = await User.create({
      username,
      password: hashedPassword,
      avatar: avatarUrl,
    });

    res.status(201).json({
      message: "Tạo người dùng mới thành công!",
      data: newUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi tạo người dùng mới", error: error.message });
  }
};

//Cập nhật thông tin User
exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { username, password } = req.body;
    const avatarUrl = req.file ? req.file.path : null;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Hash password bằng bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cập nhật thông tin user
    if (username) user.username = username;
    if (password) user.password = hashedPassword;
    if (avatarUrl) user.avatar = avatarUrl;

    await user.save();

    res.json({
      message: "Cập nhật thông tin người dùng thành công!",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật thông tin người dùng",
      error: error.message,
    });
  }
};

//Thay đổi mật khẩu User
exports.changePassword = async (req, res) => {
  try {
    const id = req.params.id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    // Kiểm tra mật khẩu cũ
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Mật khẩu cũ không đúng" });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.json({ message: "Thay đổi mật khẩu thành công!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi thay đổi mật khẩu", error: error.message });
  }
};

//Activate/Deactivate User
exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng!",
      });
    }

    user.status = !user.status;
    await user.save();
    res.json({
      message: "Cập nhật trạng thái người dùng thành công!",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật trạng thái người dùng!",
      error: error.message,
    });
  }
};

//Lọc người dùng theo status
exports.filterByStatus = async (req, res) => {
  try {
    const { status } = req.query;
    const users = await User.findAll({
      where: {
        status: status === "true" ? true : false,
      },
    });
    res.json({
      message: "Lấy danh sách người dùng thành công!",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách người dùng!",
      error: error.message,
    });
  }
};

//Phân quyền cho User
exports.assignRole = async (req, res) => {
  try {
    const { user_id, role_id } = req.body;
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    const role = await Role.findByPk(role_id);
    if (!role) {
      return res.status(404).json({ message: "Không tìm thấy vai trò!" });
    }

    const existingRole = await RoleService.findOne({
      where: { user_id, role_id },
    });
    if (existingRole) {
      return res.status(400).json({ message: "Người dùng đã có vai trò này!" });
    }

    const newRoleService = await RoleService.create({ user_id, role_id });

    res.status(201).json({
      message: "Phân quyền thành công!",
      data: newRoleService,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi phân quyền",
      error: error.message,
    });
  }
};

// Lấy danh sách người dùng theo role_id
exports.getUsersByRoleId = async (req, res) => {
  try {
    const { role_id } = req.params;

    // Kiểm tra xem role có tồn tại không
    const role = await Role.findByPk(role_id);
    if (!role) {
      return res.status(404).json({ message: "Không tìm thấy vai trò!" });
    }

    // Tìm danh sách người dùng theo role_id
    const users = await User.findAll({
      where: { role_id },
      attributes: ["id", "avatar", "status", "email"],
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "role_name"], // Lấy thông tin vai trò nếu cần
        },
      ],
    });

    res.json({
      message: "Lấy danh sách người dùng theo vai trò thành công!",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách người dùng theo vai trò!",
      error: error.message,
    });
  }
};

//Cập nhật thông tin StaffProfile
exports.updateStaffProfile = async (req, res) => {
  try {
    const { user_id } = req.params; // ID của user
    const { phone, date_of_birth, gender } = req.body;

    // Kiểm tra xem user có phải là Staff không
    const user = await User.findByPk(user_id);
    if (!user || user.role_id !== 2) {
      return res.status(400).json({ message: "Người dùng không phải Staff!" });
    }

    // Tìm hoặc tạo StaffProfile
    const [profile, created] = await StaffProfile.findOrCreate({
      where: { user_id },
      defaults: { phone, date_of_birth, gender },
    });

    // Nếu profile đã tồn tại, cập nhật thông tin
    if (!created) {
      if (phone !== undefined) profile.phone = phone;
      if (date_of_birth !== undefined) profile.date_of_birth = date_of_birth;
      if (gender !== undefined) profile.gender = gender;
      await profile.save();
    }

    res.status(200).json({
      message: "Cập nhật thông tin cá nhân thành công!",
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật thông tin cá nhân!",
      error: error.message,
    });
  }
};

//Gán địa điểm cho Staff
exports.assignLocationsToStaff = async (req, res) => {
  try {
    const { location_ids } = req.body;
    const { user_id } = req.params;

    // Kiểm tra user_id có phải role Staff không
    const user = await User.findByPk(user_id);
    if (!user || user.role_id !== 2) {
      return res.status(400).json({ message: "Người dùng không phải Staff!" });
    }

    // Kiểm tra xem các địa điểm có tồn tại không
    const existingLocations = await Location.findAll({
      where: { id: location_ids },
    });

    if (existingLocations.length !== location_ids.length) {
      return res.status(400).json({
        message: "Một hoặc nhiều địa điểm không tồn tại!",
      });
    }

    // Xóa các location hiện tại của Staff
    await StaffLocation.destroy({ where: { user_id } });

    // Gán các location mới
    const assignments = location_ids.map((location_id) => ({
      user_id, // Đảm bảo sử dụng đúng tên cột
      location_id,
    }));
    await StaffLocation.bulkCreate(assignments);

    res.status(200).json({
      message: "Gán địa điểm cho Staff thành công!",
      data: assignments,
    });
  } catch (error) {
    console.error("Lỗi khi gán địa điểm cho Staff:", error);
    res.status(500).json({
      message: "Lỗi khi gán địa điểm cho Staff!",
      error: error.message,
    });
  }
};

// Lấy danh sách TravelTour theo các địa điểm mà Staff phụ trách
exports.getTravelToursByStaffLocations = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Kiểm tra user_id có phải role Staff không
    const user = await User.findByPk(user_id);
    if (!user || user.role_id !== 2) {
      return res.status(400).json({ message: "Người dùng không phải Staff!" });
    }

    // Lấy danh sách location mà Staff phụ trách
    const staffLocations = await StaffLocation.findAll({
      where: { user_id },
      include: [{ model: Location, as: "location" }],
    });

    if (staffLocations.length === 0 || !staffLocations || !staffLocations[0]) {
      return res
        .status(404)
        .json({ message: "Staff không phụ trách địa điểm nào!" });
    }

    // Lấy danh sách location_id mà Staff phụ trách
    const locationIds = staffLocations.map((sl) => sl.location_id);

    // Lấy danh sách TravelTour theo location
    const travelTours = await TravelTour.findAll({
      include: [
        {
          model: Tour,
          as: "Tour",
          where: {
            [Op.or]: [
              { start_location: { [Op.in]: locationIds } },
              { end_location: { [Op.in]: locationIds } },
            ],
          },
          include: [
            { model: Location, as: "startLocation" },
            { model: Location, as: "endLocation" },
          ],
        },
      ],
    });

    if (!travelTours || travelTours.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy TravelTour nào!" });
    }

    res.status(200).json({
      message: "Lấy danh sách TravelTour thành công!",
      data: travelTours,
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách TravelTour:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách TravelTour!",
      error: error.message,
    });
  }
};
