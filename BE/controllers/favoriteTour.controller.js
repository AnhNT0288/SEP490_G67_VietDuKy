const db = require("../models");
const FavoriteTour = db.FavoriteTour;
const User = db.User;
const Tour = db.Tour;

// Thêm tour vào danh sách yêu thích
exports.addFavoriteTour = async (req, res) => {
  try {
    const { user_id, tour_id } = req.body;

    // Kiểm tra tour có tồn tại hay không
    const tour = await Tour.findByPk(tour_id);
    if (!tour) {
      return res.status(404).json({ message: "Tour không tồn tại!" });
    }

    // Kiểm tra tour đã tồn tại trong danh sách yêu thích chưa
    const existingFavorite = await FavoriteTour.findOne({
      where: { user_id, tour_id },
    });
    if (existingFavorite) {
      return res
        .status(400)
        .json({ message: "Tour đã có trong danh sách yêu thích!" });
    }

    const favorite = await FavoriteTour.create({ user_id, tour_id });
    res.status(201).json({
      message: "Thêm tour vào danh sách yêu thích thành công!",
      data: favorite,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi thêm tour vào danh sách yêu thích",
      error: error.message,
    });
  }
};

// Lấy danh sách tour yêu thích của người dùng (user_id)
exports.getFavoriteToursByUser = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại!" });
    }

    const favorites = await FavoriteTour.findAll({
      where: { user_id },
      include: [{ model: Tour, as: "tour" }],
    });

    res.status(200).json({
      message: "Lấy danh sách tour yêu thích thành công!",
      data: favorites,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách tour yêu thích",
      error: error.message,
    });
  }
};

// Xóa tour khỏi danh sách yêu thích
exports.removeFavoriteTour = async (req, res) => {
  try {
    const { user_id, tour_id } = req.body;

    const favorite = await FavoriteTour.findOne({
      where: { user_id, tour_id },
    });
    if (!favorite) {
      return res
        .status(404)
        .json({ message: "Tour không tồn tại trong danh sách yêu thích!" });
    }

    await favorite.destroy();
    res
      .status(200)
      .json({ message: "Xóa tour khỏi danh sách yêu thích thành công!" });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa tour khỏi danh sách yêu thích",
      error: error.message,
    });
  }
};
