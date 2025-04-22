const db = require("../models");
const Topic = db.Topic;
const Tour = db.Tour;

// Tạo chủ đề mới
exports.createTopic = async (req, res) => {
  try {
    const { name, description } = req.body;
    console.log(req.body);

    if (!name) {
      return res.status(400).json({
        message: "Vui lòng nhập tên chủ đề!",
      });
    }
    const existingTopic = await Topic.findOne({ where: { name } });
    if (existingTopic) {
      return res.status(400).json({
        message: "Chủ đề đã tồn tại!",
      });
    }

    const topic = await Topic.create({
      name,
      description,
      active: true,
    });

    res.status(201).json({
      message: "Tạo chủ đề thành công!",
      data: topic,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Lỗi khi tạo chủ đề!",
      error: error.message,
    });
  }
};

// Lấy danh sách tất cả chủ đề
exports.getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.findAll({
      // where: { active: true },
    });

    res.json({
      message: "Lấy danh sách chủ đề thành công!",
      data: topics,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách chủ đề!",
      error: error.message,
    });
  }
};

// Lấy thông tin chủ đề theo ID
exports.getTopicById = async (req, res) => {
  try {
    const topicId = req.params.id;
    const topic = await Topic.findByPk(topicId);

    if (!topic || !topic.active) {
      return res.status(404).json({
        message: "Không tìm thấy chủ đề!",
      });
    }

    res.json({
      message: "Lấy thông tin chủ đề thành công!",
      data: topic,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Lỗi khi lấy thông tin chủ đề!",
      error: error.message,
    });
  }
};

// Cập nhật thông tin chủ đề
exports.updateTopic = async (req, res) => {
  try {
    const topicId = req.params.id;
    const { name, description, active } = req.body;

    const topic = await Topic.findByPk(topicId);

    if (!topic) {
      return res.status(404).json({
        message: "Không tìm thấy chủ đề!",
      });
    }

    if (name) topic.name = name;
    if (description !== undefined) topic.description = description;
    if (active !== undefined) topic.active = active;

    await topic.save();

    res.json({
      message: "Cập nhật chủ đề thành công!",
      data: topic,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Lỗi khi cập nhật chủ đề!",
      error: error.message,
    });
  }
};

// Xóa chủ đề (soft delete)
exports.deleteTopic = async (req, res) => {
  try {
    const topicId = req.params.id;
    const topic = await Topic.findByPk(topicId);

    if (!topic) {
      return res.status(404).json({
        message: "Không tìm thấy chủ đề!",
      });
    }
    await topic.destroy();

    res.json({
      message: "Xóa chủ đề thành công!",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Lỗi khi xóa chủ đề!",
      error: error.message,
    });
  }
};

// Thêm tour vào chủ đề
exports.addTourToTopic = async (req, res) => {
  try {
    const { topicId, tourIds } = req.body;
    const topic = await Topic.findByPk(topicId);
    if (!topic) {
      return res.status(500).json({ message: "Không tìm thấy chủ đề!" });
    }
    const tours = await Tour.findAll({
      where: { id: tourIds },
    });
    if (tours.length !== tourIds.length) {
      return res.status(500).json({ message: "Không tìm thấy tour!" });
    }
    await topic.addTours(tours);
    res.status(200).json({ message: "Thêm tour vào chủ đề thành công!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Lỗi khi thêm tour vào chủ đề!",
      error: error.message,
    });
  }
};

// Xóa một hoặc nhiều tour khỏi chủ đề
exports.removeToursFromTopic = async (req, res) => {
  try {
    const { topicId, tourIds } = req.body;
    const topic = await Topic.findByPk(topicId);
    if (!topic) {
      return res.status(500).json({ message: "Không tìm thấy chủ đề!" });
    }
    const tours = await Tour.findAll({
      where: { id: tourIds },
    });
    if (tours.length !== tourIds.length) {
      return res
        .status(500)
        .json({ message: "Không tìm thấy một hoặc nhiều tour!" });
    }
    await topic.removeTours(tours);
    res.status(200).json({ message: "Xóa tour khỏi chủ đề thành công!" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Lỗi khi xóa tour khỏi chủ đề!",
      error: error.message,
    });
  }
};
