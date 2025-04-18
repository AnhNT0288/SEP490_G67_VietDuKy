const db = require("../models");
const User = db.User;
const Role = db.Role;
const bcrypt = require("bcryptjs");

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
