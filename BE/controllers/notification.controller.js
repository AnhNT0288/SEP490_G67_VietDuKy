const db = require("../models");
const Notification = db.Notification;
const NotificationType = db.NotificationType;
const User = db.User;
const Booking = db.Booking;

// Lấy tất cả thông báo của người dùng
exports.getNotificationsByUser = async (req, res) => {
  try {
    const userId = req.query.user_id;
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    // Lấy tất cả thông báo của người dùng
    const notifications = await Notification.findAll({
      where: { user_id: userId },
      include: [
        {
          model: NotificationType,
          as: "type",
        },
      ],
    });

    if (notifications.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông báo nào cho người dùng này" });
    }

    res.status(200).json({
      message: "Lấy thông báo thành công",
      data: notifications,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy thông báo",
      error: error.message,
    });
  }
};

// Tạo thông báo khi có booking
exports.createNotificationForBooking = async (req, res) => {
  try {
    const { user_id, booking_id, type_id, send_date, message } = req.body;

    // Kiểm tra xem user và booking có tồn tại không
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    const booking = await Booking.findByPk(booking_id);
    if (!booking) {
      return res.status(404).json({ message: "Đặt chỗ không tồn tại!" });
    }

    // Kiểm tra NotificationType có tồn tại không
    const notificationType = await NotificationType.findByPk(type_id);
    if (!notificationType) {
      return res.status(404).json({ message: "Loại thông báo không tồn tại!" });
    }

    // Tạo thông báo
    const newNotification = await Notification.create({
      user_id,
      booking_id,
      type_id,
      send_date,
      message,
    });

    res.status(201).json({
      message: "Tạo thông báo thành công!",
      data: newNotification,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tạo thông báo",
      error: error.message,
    });
  }
};

// Xóa thông báo theo ID
exports.deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;

    const notification = await Notification.findByPk(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Thông báo không tồn tại!" });
    }

    await notification.destroy();

    res.status(200).json({
      message: "Xóa thông báo thành công!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa thông báo",
      error: error.message,
    });
  }
};
