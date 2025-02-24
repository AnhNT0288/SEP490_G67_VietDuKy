const db = require("../models");
const User = db.User;
const Role = db.Role;
const RoleService = db.RoleService;
const bcrypt = require("bcryptjs");

// Lấy danh sách tất cả User
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json({
      message: "Get user successfully!",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving users!",
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
        message: "User not found!",
      });
    }
    res.json({
      message: "Get user successfully!",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving user!",
      error: error.message,
    });
  }
};

//Thêm một User mới
exports.addNewUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const avatarPath = req.file
      ? `/uploads/avatars/${req.file.filename}`
      : null;

    // Kiểm tra xem username đã tồn tại chưa
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Hash password bằng bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo user mới
    const newUser = await User.create({
      username,
      password: hashedPassword,
      avatar: avatarPath,
    });

    res.status(201).json({
      message: "User created successfully!",
      data: newUser,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

//Cập nhật thông tin User
exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { username, password } = req.body;
    const avatarPath = req.file
      ? `/uploads/avatars/${req.file.filename}`
      : null;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Hash password bằng bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cập nhật thông tin user
    if (username) user.username = username;
    if (password) user.password = hashedPassword;
    if (avatarPath) user.avatar = avatarPath;

    await user.save();

    res.json({ message: "User updated successfully!", data: user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating user", error: error.message });
  }
};

//Thay đổi mật khẩu User
exports.changePassword = async (req, res) => {
  try {
    const id = req.params.id;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Kiểm tra mật khẩu cũ
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid old password" });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.json({ message: "Password changed successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error changing password", error: error.message });
  }
};

//Activate/Deactivate User
exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found!",
      });
    }

    user.status = !user.status;
    await user.save();
    res.json({
      message: "User updated successfully!",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating user!",
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
      message: "Get user successfully!",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving users!",
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
      return res.status(404).json({ message: "User not found!" });
    }

    const role = await Role.findByPk(role_id);
    if (!role) {
      return res.status(404).json({ message: "Role not found!" });
    }

    const existingRole = await RoleService.findOne({
      where: { user_id, role_id },
    });
    if (existingRole) {
      return res.status(400).json({ message: "User already has this role!" });
    }

    const newRoleService = await RoleService.create({ user_id, role_id });

    res.status(201).json({
      message: "Role assigned successfully!",
      data: newRoleService,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error assigning role",
      error: error.message,
    });
  }
};
