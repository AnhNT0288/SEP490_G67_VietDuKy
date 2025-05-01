const db = require("../models");
const Feedback = db.Feedback;
const Tour = db.Tour;
const User = db.User;
const TravelGuide = db.TravelGuide;
const { Op } = require("sequelize");

// Lấy tất cả Feedback theo user_id
exports.getFeedbackByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Tìm User dựa trên user_id
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    // Lấy tất cả feedback của user dựa trên user_id
    const feedbacks = await Feedback.findAll({
      where: { user_id: userId },
      include: [
        { model: Tour, as: "tour" },
        {
          model: User,
          as: "user",
        },
        {
          model: TravelGuide,
          as: "travelGuide",
          attributes: ["first_name", "last_name"],
        },
      ],
    });

    if (feedbacks.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy feedback nào cho người dùng này" });
    }

    res.status(200).json({
      message: "Lấy feedback thành công",
      data: feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy feedback",
      error: error.message,
    });
  }
};

// Tạo feedback cho Tour
exports.createFeedbackForTour = async (req, res) => {
  try {
    const {
      user_id,
      tour_id,
      description_feedback,
      rating_tour,
      feedback_date,
    } = req.body;
    const feedback_album =
      req.files && req.files.length > 0
        ? JSON.stringify(req.files.map((file) => file.path))
        : null;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    const tour = await Tour.findByPk(tour_id);
    if (!tour) {
      return res.status(404).json({ message: "Tour không tồn tại!" });
    }

    // Kiểm tra xem người dùng đã đặt tour này chưa
    const booking = await db.Booking.findOne({
      where: { user_id },
    });

    if (!booking) {
      return res
        .status(403)
        .json({ message: "Bạn chưa đặt tour này, không thể feedback!" });
    }

    // Kiểm tra nếu không có rating, mặc định cho rating = 5
    const feedbackRating = rating_tour || 5;

    // Tạo feedback mới
    const newFeedback = await Feedback.create({
      user_id,
      tour_id,
      description_feedback,
      rating: feedbackRating,
      feedback_date,
      feedback_album,
    });

    // Lấy tất cả feedback của tour để tính trung bình cộng rating
    const tourFeedbacks = await Feedback.findAll({
      where: { tour_id },
    });

    const totalRating = tourFeedbacks.reduce(
      (sum, feedback) => sum + (feedback.rating || 0),
      0
    );
    const averageRating =
      tourFeedbacks.length > 0
        ? (totalRating / tourFeedbacks.length).toFixed(1)
        : 0;

    // Cập nhật trường rating_tour của tour
    tour.rating_tour = averageRating;
    await tour.save();

    res.status(201).json({
      message: "Tạo feedback cho tour thành công!",
      data: newFeedback,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tạo feedback cho tour",
      error: error.message,
    });
  }
};

// Tạo feedback cho Travel Guide
exports.createFeedbackForTravelGuide = async (req, res) => {
  try {
    const {
      user_id,
      travel_guide_id,
      description_feedback,
      rating,
      feedback_date,
    } = req.body;
    const feedback_album =
      req.files && req.files.length > 0
        ? JSON.stringify(req.files.map((file) => file.path))
        : null;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    const travelGuide = await TravelGuide.findByPk(travel_guide_id);
    if (!travelGuide) {
      return res.status(404).json({ message: "Hướng dẫn viên không tồn tại!" });
    }

    // Kiểm tra xem người dùng đã đặt tour có liên quan đến hướng dẫn viên này chưa
    const booking = await db.Booking.findOne({
      where: { user_id },
      include: [
        {
          model: db.TravelTour,
          where: { id: travelGuide.travel_tour_id },
        },
      ],
    });

    if (!booking) {
      return res.status(403).json({
        message:
          "Bạn chưa đặt tour có liên quan đến hướng dẫn viên này, không thể feedback!",
      });
    }

    // Kiểm tra nếu không có rating, mặc định cho rating = 5
    const feedbackRating = rating || 5;

    const newFeedback = await Feedback.create({
      user_id,
      travel_guide_id,
      description_feedback,
      rating: feedbackRating,
      feedback_date,
      feedback_album,
    });

    res.status(201).json({
      message: "Tạo feedback cho hướng dẫn viên thành công!",
      data: newFeedback,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tạo feedback cho hướng dẫn viên",
      error: error.message,
    });
  }
};

// Cập nhật Feedback
exports.updateFeedback = async (req, res) => {
  try {
    const feedbackId = req.params.id;
    const { description_feedback, rating, feedback_date } = req.body;
    const feedback_album =
      req.files && req.files.length > 0
        ? JSON.stringify(req.files.map((file) => file.path))
        : null;

    const feedback = await Feedback.findByPk(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback không tồn tại!" });
    }

    // Cập nhật các trường thông tin trong feedback
    if (description_feedback !== undefined)
      feedback.description_feedback =
        description_feedback || feedback.description_feedback;
    if (rating !== undefined) feedback.rating = rating || feedback.rating;
    if (feedback_date !== undefined)
      feedback.feedback_date = feedback_date || feedback.feedback_date;
    if (feedback_album !== undefined)
      feedback.feedback_album = feedback_album || feedback.feedback_album;
    await feedback.save();

    res.status(200).json({
      message: "Cập nhật feedback thành công!",
      data: feedback,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật feedback",
      error: error.message,
    });
  }
};

// Xóa Feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const feedbackId = req.params.id;

    const feedback = await Feedback.findByPk(feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback không tồn tại!" });
    }

    await feedback.destroy();

    res.status(200).json({
      message: "Xóa feedback thành công!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa feedback",
      error: error.message,
    });
  }
};

// Lấy tất cả Feedback theo tour_id
exports.getFeedbackByTourId = async (req, res) => {
  try {
    const tourId = req.params.tourId;

    // Tìm Tour dựa trên tour_id
    const tour = await Tour.findByPk(tourId);

    if (!tour) {
      return res.status(404).json({ message: "Tour không tồn tại!" });
    }

    // Lấy tất cả feedback của tour dựa trên tour_id
    const feedbacks = await Feedback.findAll({
      where: { tour_id: tourId },
      include: [
        { model: User, as: "user" },
        {
          model: TravelGuide,
          as: "travelGuide",
          attributes: ["first_name", "last_name"],
        },
      ],
    });

    if (feedbacks.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy feedback nào cho tour này",
      });
    }

    res.status(200).json({
      message: "Lấy feedback thành công",
      data: feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy feedback",
      error: error.message,
    });
  }
};

// Lấy tất cả Feedback theo travel_guide_id
exports.getFeedbackByTravelGuideId = async (req, res) => {
  try {
    const travelGuideId = req.params.travelGuideId;

    // Tìm Travel Guide dựa trên travel_guide_id
    const travelGuide = await TravelGuide.findByPk(travelGuideId);

    if (!travelGuide) {
      return res.status(404).json({ message: "Hướng dẫn viên không tồn tại!" });
    }

    // Lấy tất cả feedback của travel guide dựa trên travel_guide_id
    const feedbacks = await Feedback.findAll({
      where: { travel_guide_id: travelGuideId },
      include: [
        { model: User, as: "user" },
        {
          model: Tour,
          as: "tour",
          attributes: ["name_tour"],
        },
      ],
    });

    if (feedbacks.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy feedback nào cho hướng dẫn viên này",
      });
    }

    res.status(200).json({
      message: "Lấy feedback thành công",
      data: feedbacks,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy feedback",
      error: error.message,
    });
  }
};

// Lấy tất cả Feedback cho admin
exports.getAllTourFeedbacksForAdmin = async (req, res) => {
  try {
    const { rating, timeFilter, page = 1 } = req.query;
    const limit = 8;
    const offset = (page - 1) * limit;

    // Điều kiện lọc
    const whereConditions = {
      tour_id: { [Op.ne]: null },
    };

    // Lọc theo số sao
    if (rating) {
      whereConditions.rating = rating;
    }

    // Lọc theo thời gian
    const now = new Date();
    switch (timeFilter) {
      case "today":
        whereConditions.feedback_date = {
          [Op.eq]: now.toISOString().split("T")[0],
        };
        break;
      case "this_week":
        const startOfWeek = new Date(
          now.setDate(now.getDate() - now.getDay() + 1)
        ); // Bắt đầu tuần
        const endOfWeek = new Date(
          now.setDate(now.getDate() - now.getDay() + 7)
        ); // Kết thúc tuần
        whereConditions.feedback_date = {
          [Op.between]: [
            startOfWeek.toISOString().split("T")[0],
            endOfWeek.toISOString().split("T")[0],
          ],
        };
        break;
      case "this_month":
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        whereConditions.feedback_date = {
          [Op.between]: [
            startOfMonth.toISOString().split("T")[0],
            endOfMonth.toISOString().split("T")[0],
          ],
        };
        break;
      case "last_3_months":
        const threeMonthsAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 3,
          now.getDate()
        );
        whereConditions.feedback_date = {
          [Op.gte]: threeMonthsAgo.toISOString().split("T")[0],
        };
        break;
      case "this_year":
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31);
        whereConditions.feedback_date = {
          [Op.between]: [
            startOfYear.toISOString().split("T")[0],
            endOfYear.toISOString().split("T")[0],
          ],
        };
        break;
      default:
        // Không áp dụng filter thời gian
        break;
    }

    // Lấy danh sách feedback
    const feedbacks = await Feedback.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "displayName", "email"],
        },
        {
          model: Tour,
          as: "tour",
          attributes: ["id", "name_tour"],
        },
      ],
      limit,
      offset,
      order: [["feedback_date", "DESC"]],
    });

    res.status(200).json({
      message: "Lấy danh sách feedback thành công",
      data: feedbacks.rows,
      pagination: {
        totalItems: feedbacks.count,
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(feedbacks.count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách feedback",
      error: error.message,
    });
  }
};

// Lấy tất cả Feedback cho Travel Guide cho admin
exports.getAllTravelGuideFeedbacksForAdmin = async (req, res) => {
  try {
    const { rating, timeFilter, page = 1 } = req.query;
    const limit = 8;
    const offset = (page - 1) * limit;

    // Điều kiện lọc
    const whereConditions = {
      travel_guide_id: { [Op.ne]: null },
    };

    // Lọc theo số sao
    if (rating) {
      whereConditions.rating = rating;
    }

    // Lọc theo thời gian
    const now = new Date();
    switch (timeFilter) {
      case "today":
        whereConditions.feedback_date = {
          [Op.eq]: now.toISOString().split("T")[0],
        };
        break;
      case "this_week":
        const startOfWeek = new Date(
          now.setDate(now.getDate() - now.getDay() + 1)
        ); // Bắt đầu tuần
        const endOfWeek = new Date(
          now.setDate(now.getDate() - now.getDay() + 7)
        ); // Kết thúc tuần
        whereConditions.feedback_date = {
          [Op.between]: [
            startOfWeek.toISOString().split("T")[0],
            endOfWeek.toISOString().split("T")[0],
          ],
        };
        break;
      case "this_month":
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        whereConditions.feedback_date = {
          [Op.between]: [
            startOfMonth.toISOString().split("T")[0],
            endOfMonth.toISOString().split("T")[0],
          ],
        };
        break;
      case "last_3_months":
        const threeMonthsAgo = new Date(
          now.getFullYear(),
          now.getMonth() - 3,
          now.getDate()
        );
        whereConditions.feedback_date = {
          [Op.gte]: threeMonthsAgo.toISOString().split("T")[0],
        };
        break;
      case "this_year":
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31);
        whereConditions.feedback_date = {
          [Op.between]: [
            startOfYear.toISOString().split("T")[0],
            endOfYear.toISOString().split("T")[0],
          ],
        };
        break;
      default:
        break;
    }

    // Lấy danh sách feedback
    const feedbacks = await Feedback.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "displayName", "email"],
        },
        {
          model: TravelGuide,
          as: "travelGuide",
          attributes: ["id", "first_name", "last_name"],
        },
      ],
      limit,
      offset,
      order: [["feedback_date", "DESC"]],
    });

    res.status(200).json({
      message: "Lấy danh sách feedback thành công",
      data: feedbacks.rows,
      pagination: {
        totalItems: feedbacks.count,
        currentPage: parseInt(page, 10),
        totalPages: Math.ceil(feedbacks.count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách feedback",
      error: error.message,
    });
  }
};
