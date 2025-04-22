const db = require("../models");
const Directory = db.Directory;
const Article = db.Article;

//Lấy ra tất cả các danh mục
exports.getAllDirectories = async (req, res) => {
  try {
    const directories = await Directory.findAll();
    res.status(200).json({
      message: "Lấy tất cả danh mục thành công!",
      data: directories,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh mục!",
      error: error.message,
    });
  }
};

//Thêm một danh mục mới
exports.createDirectory = async (req, res) => {
  try {
    const { name_directory, alias } = req.body;
    const directory = await Directory.create({
      name_directory,
      alias,
    });
    res.status(201).json({
      message: "Tạo danh mục thành công!",
      data: directory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tạo danh mục!",
      error: error.message,
    });
  }
};

//Cập nhật một danh mục
exports.updateDirectory = async (req, res) => {
  try {
    const id = req.params.id;
    const { name_directory, alias } = req.body;
    const directory = await Directory.findByPk(id);
    if (!directory) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục!",
      });
    }
    if (name_directory != undefined) directory.name_directory = name_directory;
    if (alias != undefined) directory.alias = alias;
    await directory.save();
    res.status(200).json({
      message: "Cập nhật danh mục thành công!",
      data: directory,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật danh mục!",
      error: error.message,
    });
  }
};

//Xóa một danh mục
exports.deleteDirectory = async (req, res) => {
  try {
    const id = req.params.id;
    const directory = await Directory.findByPk(id);
    if (!directory) {
      return res.status(404).json({
        message: "Không tìm thấy danh mục!",
      });
    }
    await directory.destroy();
    res.status(200).json({
      message: "Xóa danh mục thành công!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa danh mục!",
      error: error.message,
    });
  }
};
