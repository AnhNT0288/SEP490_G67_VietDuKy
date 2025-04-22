const db = require("../models");
const TourActivities = db.TourActivities;
const Tour = db.Tour;

// Tạo hoạt động mới cho tour
exports.createTourActivities = async (req, res) => {
  try {
    const { tour_id, day, title, description, detail } = req.body;
    const image = req.file ? req.file.path : null;

    // Kiểm tra tour có tồn tại không
    const tour = await Tour.findByPk(tour_id);
    if (!tour) {
      return res.status(404).json({
        message: "Tour không tồn tại!",
      });
    }

    // Kiểm tra dữ liệu đầu vào
    if (!day || !title) {
      return res.status(400).json({
        message: "Vui lòng nhập ngày và tiêu đề hoạt động!",
      });
    }

    if (!image) {
      return res.status(400).json({
        message: "Vui lòng chọn ảnh cho hoạt động!",
      });
    }

    // Tạo hoạt động mới
    const newActivity = await TourActivities.create({
      tour_id,
      day,
      title,
      description,
      detail,
      image,
    });

    res.status(201).json({
      message: "Thêm hoạt động tour thành công!",
      data: newActivity,
    });
  } catch (error) {
    console.error("Error creating tour activity:", error);
    res.status(500).json({
      message: "Lỗi khi thêm hoạt động tour!",
      error: error.message,
    });
  }
};

exports.updateTourActivities = async (req, res) => {
  try {
    const id = req.params.id;
    const { tour_id, day, title, description, detail } = req.body;
    const image = req.file ? req.file.path : null;

    // Kiểm tra tour có tồn tại không
    const tour = await Tour.findByPk(tour_id);
    if (!tour) {
      return res.status(404).json({
        message: "Tour không tồn tại!",
      });
    }

    // Kiểm tra hoạt động có tồn tại không
    const activity = await TourActivities.findByPk(id);
    if (!activity) {
      return res.status(404).json({
        message: "Hoạt động không tồn tại!",
      });
    }

    // Cập nhật thông tin hoạt động
    await activity.update({
      tour_id,
      day,
      title,
      description,
      detail,
      image,
    });

    res.json({
      message: "Cập nhật hoạt động tour thành công!",
      data: activity,
    });
  } catch (error) {
    console.error("Error updating tour activity:", error);
    res.status(500).json({
      message: "Lỗi khi cập nhật hoạt động tour!",
      error: error.message,
    });
  }
};

exports.deleteTourActivities = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra hoạt động có tồn tại không
    const activity = await TourActivities.findByPk(id);
    if (!activity) {
      return res.status(404).json({
        message: "Hoạt động không tồn tại!",
      });
    }

    // Xóa hoạt động  
    await activity.destroy();

    res.json({
      message: "Xóa hoạt động tour thành công!",
    });
  } catch (error) {
    console.error("Error deleting tour activity:", error);
    res.status(500).json({
      message: "Lỗi khi xóa hoạt động tour!",
      error: error.message,
    });
  }
};

