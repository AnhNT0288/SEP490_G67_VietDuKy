const jwt = require("jsonwebtoken");
const { User, Role } = require("../models");
require("dotenv").config();

/**
 * Middleware xác thực người dùng
 */
const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Bạn cần đăng nhập để sử dụng" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({
      where: { id: decoded.id },
      include: { model: Role, as: "role", attributes: ["role_name"] },
    });

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    req.user = user; // Gán user vào request để sử dụng trong các API khác
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Bạn cần đăng nhập để sử dụng", error: error.message });
  }
};

/**
 * Middleware kiểm tra quyền truy cập theo role
 * @param {Array} allowedRoles - Danh sách role được phép truy cập
 */
const checkRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role.role_name)) {
      return res.status(403).json({ message: "Forbidden: Không có quyền truy cập" });
    }
    next();
  };
};

// Middleware xác thực Admin
const authenticateAdmin = checkRoles(["admin"]);

// Middleware xác thực Customer
const authenticateCustomer = checkRoles(["customer"]);

// Middleware xác thực Staff
const authenticateStaff = checkRoles(["staff"]);

// Middleware xác thực Tour Guide
const authenticateTourGuide = checkRoles(["tour_guide"]);

module.exports = {
  authenticateUser,
  checkRoles,
  authenticateAdmin,
  authenticateCustomer,
  authenticateStaff,
  authenticateTourGuide,
};
