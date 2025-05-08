const db = require("../models");
const User = db.User;
const Role = db.Role;
const bcrypt = require("bcryptjs");
const StaffProfile = db.StaffProfile;
const StaffLocation = db.StaffLocation;
const TravelTour = db.TravelTour;
const Location = db.Location;
const Tour = db.Tour;
const nodemailer = require("nodemailer");
const { Op, Sequelize } = require("sequelize");

// Cấu hình nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

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

//Cập nhật FCM Token
exports.updateFcmToken = async (req, res) => {
  try {
    const { fcmToken } = req.body;
    //Lấy user_id từ token
    const userId = req.user.id;
    console.log("userId", userId);

    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    user.fcm_token = fcmToken;
    await user.save();
    res.json({ message: "FCM Token đã được cập nhật thành công!" });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật FCM Token!",
      error: error.message,
    });
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
    const id = req.params.id; // ID của người dùng cần thay đổi trạng thái
    const adminId = req.user.id; // ID của admin từ token

    // Lấy thông tin admin từ token
    const adminUser = await User.findByPk(adminId, {
      include: { model: Role, as: "role", attributes: ["role_name"] },
    });

    // Kiểm tra nếu người dùng hiện tại không phải admin
    if (!adminUser || adminUser.role.role_name !== "admin") {
      return res.status(403).json({
        message: "Bạn không có quyền thực hiện hành động này!",
      });
    }

    // Không cho phép admin khóa tài khoản của chính mình
    if (id === adminId.toString()) {
      return res.status(400).json({
        message: "Bạn không thể khóa tài khoản của chính mình!",
      });
    }

    // Lấy thông tin người dùng cần thay đổi trạng thái
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng!",
      });
    }

    // Toggle trạng thái tài khoản
    user.status = user.status === true ? false : true;
    await user.save();

    res.json({
      message: `Tài khoản đã được ${
        user.status === true ? "mở khóa" : "khóa"
      } thành công!`,
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
    const adminId = req.user.id; // ID của admin từ token

    // Lấy thông tin admin từ token
    const adminUser = await User.findByPk(adminId, {
      include: { model: Role, as: "role", attributes: ["role_name"] },
    });

    // Kiểm tra nếu người dùng hiện tại không phải admin
    if (!adminUser || adminUser.role.role_name !== "admin") {
      return res.status(403).json({
        message: "Bạn không có quyền thực hiện hành động này!",
      });
    }

    // Không cho phép admin thay đổi vai trò của chính mình
    if (user_id === adminId.toString()) {
      return res.status(400).json({
        message: "Bạn không thể thay đổi vai trò của chính mình!",
      });
    }

    // Kiểm tra vai trò được gán
    const role = await Role.findByPk(role_id);
    if (!role) {
      return res.status(404).json({ message: "Không tìm thấy vai trò!" });
    }

    // Không cho phép gán vai trò "admin" cho người khác
    if (role.role_name === "admin") {
      return res.status(400).json({
        message: "Chỉ có một admin duy nhất được phép tồn tại!",
      });
    }

    // Kiểm tra người dùng cần gán vai trò
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    // Kiểm tra nếu người dùng đã có vai trò này
    const existingRole = await Role.findOne({
      where: { user_id, role_id },
    });
    if (existingRole) {
      return res.status(400).json({ message: "Người dùng đã có vai trò này!" });
    }

    // Gán vai trò mới cho người dùng
    const newRole = await Role.create({ user_id, role_id });

    res.status(201).json({
      message: "Phân quyền thành công!",
      data: newRole,
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
      attributes: ["id", "avatar", "status", "email", "displayName"],
      include: [
        {
          model: Role,
          as: "role",
          attributes: ["id", "role_name"],
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

exports.getStaffProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy user_id từ token

    // Tìm user và bao gồm thông tin StaffProfile (nếu có)
    const user = await User.findOne({
      where: { id: userId },
      attributes: ["id", "email", "displayName", "avatar"], // Các trường từ User
      include: [
        {
          model: StaffProfile,
          attributes: ["id", "phone", "date_of_birth", "gender"], // Các trường của StaffProfile
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    return res.json(user); // Trả về toàn bộ thông tin User + StaffProfile
  } catch (error) {
    console.error("Lỗi khi lấy profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//Cập nhật thông tin StaffProfile
exports.updateStaffProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy user_id từ token
    const { phone, date_of_birth, gender, displayName } = req.body; // Lấy thêm displayName

    // Tìm user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    // Nếu có displayName, cập nhật luôn vào User
    if (displayName !== undefined) {
      user.displayName = displayName;
      await user.save(); // Lưu lại user
    }

    // Tìm hoặc tạo StaffProfile
    const [profile, created] = await StaffProfile.findOrCreate({
      where: { user_id: userId },
      defaults: { phone, date_of_birth, gender },
    });

    // Nếu profile đã tồn tại, cập nhật
    if (!created) {
      if (phone !== undefined) profile.phone = phone;
      if (date_of_birth !== undefined) profile.date_of_birth = date_of_birth;
      if (gender !== undefined) profile.gender = gender;
      await profile.save();
    }

    // Lấy lại User + StaffProfile sau khi cập nhật
    const updatedUser = await User.findOne({
      where: { id: userId },
      attributes: ["id", "email", "displayName", "avatar"],
      include: [
        {
          model: StaffProfile,
          attributes: ["id", "phone", "date_of_birth", "gender"],
        },
      ],
    });

    res.status(200).json({
      message: "Cập nhật thông tin cá nhân thành công!",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật profile:", error);
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

    // Lấy danh sách các địa điểm đã được gán cho Staff
    const existingAssignments = await StaffLocation.findAll({
      where: { user_id },
    });
    const existingLocationIds = existingAssignments.map(
      (assignment) => assignment.location_id
    );

    // Lọc ra các địa điểm chưa được gán
    const newLocationIds = location_ids.filter(
      (id) => !existingLocationIds.includes(id)
    );

    if (newLocationIds.length === 0) {
      return res.status(400).json({
        message: "Tất cả các địa điểm đã được gán cho Staff!",
      });
    }

    // Gán các địa điểm mới
    const assignments = newLocationIds.map((location_id) => ({
      user_id,
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

// Lấy danh sách các địa điểm được gán cho Staff
exports.getLocationsByStaff = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Kiểm tra user_id có phải role Staff không
    const user = await User.findByPk(user_id);
    if (!user || user.role_id !== 2) {
      return res.status(400).json({ message: "Người dùng không phải Staff!" });
    }

    // Lấy danh sách các địa điểm được gán cho Staff
    const staffLocations = await StaffLocation.findAll({
      where: { user_id },
      include: [
        {
          model: Location,
          as: "location",
          attributes: ["id", "name_location"],
        },
      ],
    });

    // if (staffLocations.length === 0) {
    //   return res.status(404).json({
    //     message: "Không tìm thấy địa điểm nào được gán cho Staff này!",
    //   });
    // }

    res.status(200).json({
      message: "Lấy danh sách địa điểm thành công!",
      data: staffLocations.map((sl) => sl.location),
    });
  } catch (error) {
    console.error("Lỗi khi lấy danh sách địa điểm của Staff:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách địa điểm của Staff!",
      error: error.message,
    });
  }
};

// Xóa địa điểm khỏi Staff
exports.deleteLocationFromStaff = async (req, res) => {
  try {
    const { user_id, location_id } = req.body;

    // Kiểm tra user_id có phải role Staff không
    const user = await User.findByPk(user_id);
    if (!user || user.role_id !== 2) {
      return res.status(400).json({ message: "Người dùng không phải Staff!" });
    }

    // Kiểm tra Location có tồn tại không
    const location = await Location.findByPk(location_id);
    if (!location) {
      return res.status(404).json({ message: "Không tìm thấy Location!" });
    }

    // Kiểm tra xem địa điểm đã được gán cho Staff chưa
    const staffLocation = await StaffLocation.findOne({
      where: { user_id, location_id },
    });

    if (!staffLocation) {
      return res.status(404).json({
        message: "Địa điểm này chưa được gán cho Staff!",
      });
    }

    // Xóa địa điểm khỏi Staff
    await staffLocation.destroy();

    res.status(200).json({
      message: "Xóa địa điểm khỏi Staff thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi xóa địa điểm khỏi Staff:", error);
    res.status(500).json({
      message: "Lỗi khi xóa địa điểm khỏi Staff!",
      error: error.message,
    });
  }
};

// API gửi mail liên hệ tư vấn
exports.contactAdvice = async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    // Kiểm tra xem req.user có tồn tại không
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: "Người dùng chưa được xác thực!" });
    }

    const userId = req.user.id;

    // Truy vấn email từ bảng User dựa trên user_id và role là customer
    const user = await User.findOne({
      where: { id: userId },
      include: {
        model: Role,
        as: "role",
        where: { role_name: "customer" },
        attributes: [],
      },
      attributes: ["email"],
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin khách hàng!" });
    }

    const email = user.email;

    // Kiểm tra thông tin đầu vào
    if (!name || !phone || !message) {
      return res
        .status(400)
        .json({ message: "Vui lòng điền đầy đủ thông tin!" });
    }

    // Lấy danh sách email của staff hoặc admin có quyền tư vấn
    const staffOrAdmins = await User.findAll({
      include: {
        model: Role,
        as: "role",
        where: { role_name: { [Op.in]: ["staff", "admin"] } },
        attributes: [],
      },
      where: { can_consult: true }, // Chỉ lấy user có quyền tư vấn
      attributes: ["email"],
    });

    if (!staffOrAdmins || staffOrAdmins.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy staff nào có quyền tư vấn!",
      });
    }

    const recipientEmails = staffOrAdmins.map((user) => user.email);

    // Cấu hình nội dung email
    const mailOptions = {
      from: '"Việt Du Ký" <vietduky.service@gmail.com>',
      to: recipientEmails,
      subject: "Yêu cầu tư vấn từ khách hàng",
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #fff;
                margin: 0;
                padding: 0;
              }
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                background-color: #fef2f2;
                position: relative;
              }
              h1 {
                color: #d32f2f;
                text-align: center;
              }
              p {
                margin: 10px 0;
              }
              .info-table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
                table-layout: fixed;
              }
              .info-table th, .info-table td {
                border: 1px solid #ddd;
                padding: 10px;
                text-align: left;
                word-wrap: break-word;
              }
              .info-table th {
                background-color: #d32f2f;
                color: #fff;
              }
              .info-table td {
                background-color: #fff;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                font-size: 0.9em;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="email-container">
              <h1>Yêu cầu tư vấn</h1>
              <p>Xin chào,</p>
              <p>Khách hàng <strong>${name}</strong> đã gửi yêu cầu tư vấn. Dưới đây là thông tin chi tiết:</p>
              <table class="info-table">
                <tr>
                  <th>Thông tin</th>
                  <th>Chi tiết</th>
                </tr>
                <tr>
                  <td>Họ và tên</td>
                  <td>${name}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>${email}</td>
                </tr>
                <tr>
                  <td>Số điện thoại</td>
                  <td><a href="tel:{${phone}}">${phone}</a></td>
                </tr>
                <tr>
                  <td>Nội dung</td>
                  <td>${message}</td>
                </tr>
              </table>
              <p>Vui lòng liên hệ với khách hàng để hỗ trợ tư vấn.</p>
              <div class="footer">
                <p>© 2025 Việt Du Ký</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    // Gửi email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Lỗi khi gửi email: ", error);
        return res.status(500).json({ message: "Lỗi khi gửi email!", error });
      } else {
        console.log("Email đã được gửi: " + info.response);
        return res
          .status(200)
          .json({ message: "Yêu cầu tư vấn đã được gửi thành công!" });
      }
    });
  } catch (error) {
    console.error("Lỗi khi gửi yêu cầu tư vấn:", error);
    res
      .status(500)
      .json({ message: "Lỗi khi gửi yêu cầu tư vấn!", error: error.message });
  }
};
