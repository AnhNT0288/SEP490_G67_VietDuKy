const db = require("../models");
const Location = db.Location;

// Lấy danh sách tất cả Tour
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.json(locations);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách địa điểm!",
      error: error.message,
    });
  }
};

// Lấy một Location theo ID
exports.getLocationById = async (req, res) => {
  try {
    const id = req.params.id;
    const location = await Location.findByPk(id);
    if (!location) {
      return res.status(404).json({
        message: "Không tìm thấy địa điểm!",
      });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy thông tin địa điểm!",
      error: error.message,
    });
  }
};

// Tạo một Location mới
exports.createLocation = async (req, res) => {
  try {
    const { name_location } = req.body;
    const imageUrl = req.file?.path || req.file?.url;
    console.log("FILE UPLOADED:", req.file);
    if (!name_location) {
      return res.status(400).json({
        message: "Tên và hình ảnh là bắt buộc!",
      });
    }
    const newLocation = {
      name_location,
      image: imageUrl,
    };
    const location = await Location.create(newLocation);
    res.status(201).json({
      message: "Tạo địa điểm thành công!",
      data: location,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tạo địa điểm!",
      error: error.message,
    });
  }
};

// Xóa một Location theo ID
exports.deleteLocation = async (req, res) => {
  try {
    const id = req.params.id;
    const location = await Location.findByPk(id);
    if (!location) {
      return res.status(404).json({
        message: "Không tìm thấy địa điểm!",
      });
    }
    await location.destroy();
    res.json({
      message: "Xóa địa điểm thành công!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa địa điểm!",
      error: error.message,
    });
  }
};

// Cập nhật Location theo ID
exports.updateLocation = async (req, res) => {
  try {
    const id = req.params.id;
    const location = await Location.findByPk(id);
    if (!location) {
      return res.status(404).json({
        message: "Không tìm thấy địa điểm!",
      });
    }
    const { name } = req.body;
    const imageUrl = req.file ? req.file.path : null;
    if (imageUrl != undefined) location.image = imageUrl;
    if (name != undefined) location.name_location = name;
    await location.save();
    res.json({
      message: "Cập nhật địa điểm thành công!",
      data: location,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật địa điểm!",
      error: error.message,
    });
  }
};
