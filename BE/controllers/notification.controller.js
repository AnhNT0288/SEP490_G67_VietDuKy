const db = require('../models');
const Notification = db.Notification;

// Lấy tất cả thông báo của user
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']]
    });
    
    res.json(notifications);
  } catch (error) {
    console.error("Error getting notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Đánh dấu thông báo đã đọc
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByPk(notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: 'Thông báo không tồn tại' });
    }
    
    notification.read = true;
    await notification.save();
    
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Đánh dấu tất cả thông báo đã đọc
exports.markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    await Notification.update(
      { read: true },
      { where: { userId, read: false } }
    );
    
    res.json({ message: 'Đã đánh dấu tất cả thông báo là đã đọc' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa thông báo
exports.deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findByPk(notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: 'Thông báo không tồn tại' });
    }
    
    await notification.destroy();
    res.json({ message: 'Đã xóa thông báo thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tạo thông báo mới
exports.createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, data } = req.body;
    const notification = await Notification.create({
      userId,
      title,
      message,
      notificationType: type,
      data
    });

    // Gửi thông báo realtime
    const io = req.app.get('io');
    io.emit('sendNotification', {
      userId,
      notification
    });

    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}; 