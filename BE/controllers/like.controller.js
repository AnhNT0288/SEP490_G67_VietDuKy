const db = require("../models");
const Like = db.Like;
const { validateTarget } = require("../utils/like");

// Like/Unlike
exports.toggleLike = async (req, res) => {
  try {
    const { user_id, target_id, target_type } = req.body;

    const { valid, message } = await validateTarget(target_id, target_type);
    if (!valid) return res.status(400).json({ message });

    const existingLike = await Like.findOne({
      where: { user_id, target_id, target_type },
    });

    if (existingLike) {
      await existingLike.destroy();
      return res.status(200).json({ message: "Bỏ thích thành công" });
    } else {
      await Like.create({ user_id, target_id, target_type });
      return res.status(201).json({ message: "Thích thành công" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

// Kiểm tra đã like chưa
exports.isLiked = async (req, res) => {
  try {
    const { user_id, target_id, target_type } = req.query;

    const { valid, message } = await validateTarget(target_id, target_type);
    if (!valid) return res.status(400).json({ message });

    const isLiked = await Like.findOne({
      where: { user_id, target_id, target_type },
    });

    return res.status(200).json({ isLiked: !!isLiked });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};

// Đếm số lượng like
exports.countLikes = async (req, res) => {
  try {
    const { target_id, target_type } = req.query;

    const { valid, message } = await validateTarget(target_id, target_type);
    if (!valid) return res.status(400).json({ message });

    const likes = await Like.findAll({
      where: { target_id, target_type },
      attributes: ["user_id"], // Chỉ lấy cột user_id
    });

    const userIds = likes.map((like) => like.user_id); // Lấy danh sách user_id
    const count = userIds.length; // Tổng số lượng like

    return res.status(200).json({ count, userIds });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ" });
  }
};
