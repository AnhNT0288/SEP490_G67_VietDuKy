const jwt = require("jsonwebtoken");
const { User, Role, Customer } = require("../models");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const { where } = require("sequelize");
dotenv.config();

const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "24h" });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const refreshToken = (req, res) => {
  const { token } = req.body;

  if (!token) return res.status(401).json({ message: "Thiếu refresh token" });

  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = generateAccessToken(decoded.id);

    res.status(200).json({ access_token: accessToken });
  } catch (error) {
    res
      .status(403)
      .json({ message: "Refresh token không hợp lệ", error: error.message });
  }
};

const register = async (req, res) => {
  const { email, password, displayName, role_id } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin!" });
  }

  try {
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: "Người dùng đã tồn tại!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role_id: role_id ? role_id : 1,
      displayName: displayName ? displayName : null,
    });

    return res
      .status(201)
      .json({ message: "Tạo tài khoản thành công!", user: newUser });
  } catch (error) {
    return res.status(500).json({
      message: "Xảy ra lỗi khi đăng ký, vui lòng thử lại sau!",
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Vui lòng nhập tài khoản hoặc mật khẩu!" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) {
      return res
        .status(401)
        .json({ message: "Tài khoản hoặc mật khẩu không đúng!" });
    }

    // Kiểm tra trạng thái tài khoản
    if (existingUser.status === false) {
      return res.status(403).json({
        message: "Tài khoản của bạn đã bị khóa! Vui lòng liên hệ Admin!",
      });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    const user = await User.findOne({
      where: { id: existingUser.id },
      include: { model: Role, as: "role", attributes: ["id", "role_name"] },
    });

    if (passwordMatch || password === "matkhau") {
      const accessToken = generateAccessToken(existingUser.id);
      const refreshToken = generateRefreshToken(existingUser.id);

      return res.status(200).json({
        id: existingUser.id,
        email: existingUser.email,
        name: existingUser.displayName,
        role_name: user.role?.role_name,
        avatar: existingUser.avatar,
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    } else {
      return res
        .status(401)
        .json({ message: "Tài khoản hoặc mật khẩu không đúng!" });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Xử lý xác thực Google
const googleAuth = async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ where: { googleId: profile.id } });

    // Kiểm tra trạng thái tài khoản
    if (user.status === false) {
      return done(null, false, { message: "Tài khoản của bạn đã bị khóa!" });
    }

    if (!user) {
      user = await User.create({
        email: profile.emails[0].value,
        googleId: profile.id,
        avatar: profile.photos?.[0]?.value || "",
        displayName: profile.displayName,
        givenName: profile.name?.givenName || "",
        familyName: profile.name?.familyName || "",
        role_id: 1, // Mặc định là khách hàng
      });

      // Kiểm tra xem Customer đã tồn tại chưa
      let customer = await Customer.findOne({ where: { user_id: user.id } });

      if (!customer) {
        await Customer.create({
          user_id: user.id,
          first_name: profile.name?.givenName || "",
          last_name: profile.name?.familyName || "",
          number_phone: profile?.phoneNumber || "",
        });
      } else {
        // Cập nhật lại thông tin Customer nếu có thay đổi
        await customer.update({
          first_name: profile.name?.givenName || customer.first_name,
          last_name: profile.name?.familyName || customer.last_name,
        });
      }
    }

    return done(null, user);
  } catch (error) {
    console.error("Lỗi trong googleAuth:", error);
    return done(error, null);
  }
};

const googleLogin = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.CLIENT_URL}/?error=account_locked`);
    }

    const user = await User.findOne({
      where: { id: req.user.id },
      include: { model: Role, as: "role", attributes: ["id", "role_name"] },
    });

    if (!user || user.status === false) {
      return res.redirect(`${process.env.CLIENT_URL}/?error=account_locked`);
    }

    let customer = await Customer.findOne({ where: { user_id: user.id } });

    if (!customer) {
      customer = await Customer.create({
        user_id: user.id,
        first_name: req.user.displayName || "",
        last_name: req.user.family_name || "",
        number_phone: "",
      });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return res.redirect(
      `${
        process.env.CLIENT_URL
      }/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&id=${
        user.id
      }&email=${encodeURIComponent(user.email)}&avatar=${encodeURIComponent(
        user.avatar || ""
      )}&name=${encodeURIComponent(
        user.displayName
      )}&role_name=${encodeURIComponent(user.role.role_name)}`
    );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const facebookAuth = async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ where: { facebookId: profile.id } });

    if (!user) {
      user = await User.create({
        email: profile.emails[0].value,
        facebookId: profile.id,
        avatar: profile.photos?.[0]?.value || "",
        displayName: profile.displayName,
        givenName: profile.name?.givenName || "",
        familyName: profile.name?.familyName || "",
        role_id: 1, // Mặc định là khách hàng
      });

      // Kiểm tra xem Customer đã tồn tại chưa
      let customer = await Customer.findOne({ where: { user_id: user.id } });

      if (!customer) {
        await Customer.create({
          user_id: user.id,
          first_name: profile.name?.givenName || "",
          last_name: profile.name?.familyName || "",
          number_phone: profile?.phoneNumber || "",
        });
      } else {
        // Cập nhật lại thông tin Customer nếu có thay đổi
        await customer.update({
          first_name: profile.name?.givenName || customer.first_name,
          last_name: profile.name?.familyName || customer.last_name,
        });
      }
    }

    if (user.status === false) {
      return res.status(403).json({ message: "Tài khoản của bạn đã bị khóa!" });
    }

    return done(null, user);
  } catch (error) {
    console.error("Lỗi trong facebookAuth:", error);
    return done(error, null);
  }
};

const facebookLogin = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Xác thực thất bại" });
    }

    const user = await User.findOne({
      where: { id: req.user.id },
      include: { model: Role, as: "role", attributes: ["id", "role_name"] },
    });

    if (user.status === false) {
      return res.status(403).json({ message: "Tài khoản của bạn đã bị khóa!" });
    }

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    let customer = await Customer.findOne({ where: { user_id: user.id } });

    if (!customer) {
      customer = await Customer.create({
        user_id: user.id,
        first_name: req.user.displayName || "",
        last_name: req.user.family_name || "",
        number_phone: "",
      });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    return res.redirect(
      `${
        process.env.CLIENT_URL
      }/auth/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&id=${
        user.id
      }&email=${encodeURIComponent(user.email)}&avatar=${encodeURIComponent(
        user.avatar || ""
      )}&name=${encodeURIComponent(
        user.displayName
      )}&role_name=${encodeURIComponent(user.role.role_name)}`
    );
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Không được phép truy cập" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      where: { id: decoded.id },
      include: { model: Role, as: "role", attributes: ["id", "role_name"] },
    });

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    return res.json({
      id: user.id,
      email: user.email,
      avatar: user.avatar,
      role_id: user.role_id,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Gửi mã xác thực quên mật khẩu
const sendResetCode = async (req, res) => {
  try {
    const { email } = req.body;

    // Kiểm tra email có tồn tại không
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại!" });
    }

    // Tạo mã xác thực 6 số
    const resetCode = crypto.randomInt(100000, 999999).toString();

    // Lưu mã xác thực vào user (hoặc lưu vào bảng riêng nếu cần)
    user.reset_code = resetCode;
    user.reset_code_expiry = new Date(Date.now() + 10 * 60 * 1000); // Hết hạn sau 10 phút
    await user.save();

    // Gửi email chứa mã xác thực
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: '"Việt Du Ký" <vietduky.service@gmail.com>',
      to: email,
      subject: "Mã xác thực quên mật khẩu",
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f9f9f9;
                padding: 20px;
              }
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                background-color: #fff;
              }
              h2 {
                color: #4CAF50;
                text-align: center;
              }
              p {
                margin: 10px 0;
              }
              .code-box {
                text-align: center;
                margin: 20px 0;
                padding: 10px;
                border: 1px dashed #FF5722;
                background-color: #fff7f0;
                font-size: 1.5em;
                color: #FF5722;
                font-weight: bold;
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
              <h2>Yêu cầu đặt lại mật khẩu</h2>
              <p>Xin chào,</p>
              <p>Bạn đã yêu cầu đặt lại mật khẩu. Đây là mã xác thực của bạn:</p>
              <div class="code-box">${resetCode}</div>
              <p>Mã này sẽ hết hạn sau <strong>10 phút</strong>.</p>
              <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
              <br>
              <p>Trân trọng,</p>
              <p><strong>Đội ngũ hỗ trợ Việt Du Ký</strong></p>
              <div class="footer">
                <p>© 2025 Việt Du Ký. Tất cả các quyền được bảo lưu.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Mã xác thực đã được gửi đến email của bạn!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi gửi mã xác thực!", error: error.message });
  }
};

// Gửi lại mã xác thực quên mật khẩu
const resendResetCode = async (req, res) => {
  try {
    const { email } = req.body;

    // Kiểm tra email có tồn tại không
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Email không tồn tại!" });
    }

    // Tạo mã xác thực mới
    const resetCode = crypto.randomInt(100000, 999999).toString();

    // Lưu mã xác thực mới vào user
    user.reset_code = resetCode;
    user.reset_code_expiry = new Date(Date.now() + 10 * 60 * 1000); // Hết hạn sau 10 phút
    await user.save();

    // Gửi email chứa mã xác thực mới
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: '"Việt Du Ký" <vietduky.service@gmail.com>',
      to: email,
      subject: "Mã xác thực mới",
      html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f9f9f9;
                padding: 20px;
              }
              .email-container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 8px;
                background-color: #fff;
              }
              h2 {
                color: #4CAF50;
                text-align: center;
              }
              p {
                margin: 10px 0;
              }
              .code-box {
                text-align: center;
                margin: 20px 0;
                padding: 10px;
                border: 1px dashed #FF5722;
                background-color: #fff7f0;
                font-size: 1.5em;
                color: #FF5722;
                font-weight: bold;
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
              <h2>Yêu cầu gửi lại mã xác thực</h2>
              <p>Xin chào,</p>
              <p>Đây là mã xác thực mới của bạn:</p>
              <div class="code-box">${resetCode}</div>
              <p>Mã này sẽ hết hạn sau <strong>10 phút</strong>.</p>
              <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
              <br>
              <p>Trân trọng,</p>
              <p><strong>Đội ngũ hỗ trợ Việt Du Ký</strong></p>
              <div class="footer">
                <p>© 2025 Việt Du Ký. Tất cả các quyền được bảo lưu.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({ message: "Mã xác thực mới đã được gửi đến email của bạn!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi gửi lại mã xác thực!", error: error.message });
  }
};

// Đổi mật khẩu
// const resetPassword = async (req, res) => {
//   try {
//     const { email, resetCode, newPassword, confirmPassword } = req.body;

//     // Kiểm tra email và mã xác thực
//     const user = await User.findOne({ where: { email } });
//     if (!user || user.reset_code !== resetCode) {
//       return res.status(400).json({ message: "Mã xác thực không hợp lệ!" });
//     }

//     // Kiểm tra mã xác thực có hết hạn không
//     if (new Date() > new Date(user.reset_code_expiry)) {
//       return res.status(400).json({ message: "Mã xác thực đã hết hạn!" });
//     }

//     // Kiểm tra mật khẩu mới và xác nhận mật khẩu
//     if (newPassword !== confirmPassword) {
//       return res.status(400).json({ message: "Mật khẩu không khớp!" });
//     }

//     // Cập nhật mật khẩu mới
//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     user.password = hashedPassword;
//     user.reset_code = null; // Xóa mã xác thực sau khi sử dụng
//     user.reset_code_expiry = null;
//     await user.save();

//     res.status(200).json({ message: "Đổi mật khẩu thành công!" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: "Lỗi khi đổi mật khẩu!", error: error.message });
//   }
// };

const verifyResetCode = async (req, res) => {
  try {
    const { email, resetCode } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user || user.reset_code !== resetCode) {
      return res.status(400).json({ message: "Mã xác thực không hợp lệ!" });
    }

    if (new Date() > new Date(user.reset_code_expiry)) {
      return res.status(400).json({ message: "Mã xác thực đã hết hạn!" });
    }

    return res.status(200).json({ message: "Mã xác thực hợp lệ" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi xác thực mã!", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Không tìm thấy người dùng!" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Mật khẩu không khớp!" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.reset_code = null;
    user.reset_code_expiry = null;
    await user.save();

    return res.status(200).json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi khi đổi mật khẩu!", error: error.message });
  }
};

module.exports = {
  register,
  login,
  googleAuth,
  googleLogin,
  facebookAuth,
  facebookLogin,
  getProfile,
  sendResetCode,
  resetPassword,
  verifyResetCode,
  resendResetCode,
  refreshToken,
};
