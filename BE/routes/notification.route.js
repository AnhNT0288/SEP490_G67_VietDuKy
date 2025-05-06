const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification.controller');
// const { isAuthenticated } = require('../middleware/auth.middleware');

// Áp dụng middleware xác thực cho tất cả các routes
// router.use(isAuthenticated);

// Lấy tất cả thông báo của user
router.get('/user/:userId', notificationController.getUserNotifications);

// Đánh dấu thông báo đã đọc
router.put('/read/:notificationId', notificationController.markAsRead);

// Đánh dấu tất cả thông báo đã đọc
router.put('/read-all/:userId', notificationController.markAllAsRead);

// Xóa thông báo
router.delete('/:notificationId', notificationController.deleteNotification);

// Tạo thông báo mới
router.post('/', notificationController.createNotification);

module.exports = router; 