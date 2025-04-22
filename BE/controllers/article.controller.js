const db = require("../models");
const slugify = require("slugify");
const Article = db.Article;
const User = db.User;
const Directory = db.Directory;

// Lấy danh sách tất cả bài viết
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.findAll({
      include: [
        {
          model: User,
          as: "author",
        },
        {
          model: Directory,
          as: "directory",
        },
      ],
    });
    res.status(200).json({
      message: "Lấy danh sách tất cả bài viết thành công!",
      data: articles,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách bài viết!",
      error: error.message,
    });
  }
};

//Lấy bài viết theo danh mục
exports.getArticlesByDirectory = async (req, res) => {
  try {
    const { directory_id } = req.params;

    const articles = await Article.findAll({
      where: {
        directory_id,
      },
      include: [
        {
          model: Directory,
          as: "directory",
        },
      ],
    });

    res.status(200).json({
      message: "Lấy bài viết theo danh mục thành công!",
      data: articles,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy bài viết theo danh mục!",
      error: error.message,
    });
  }
};

//Lấy bài viết theo id
exports.getArticleById = async (req, res) => {
  try {
    const { article_id } = req.params;

    const article = await Article.findByPk(article_id, {
      include: [
        {
          model: User,
          as: "author",
        },
        {
          model: Directory,
          as: "directory",
        },
      ],
    });

    if (!article) {
      return res.status(404).json({
        message: "Không tìm thấy bài viết!",
      });
    }

    res.status(200).json({
      message: "Lấy bài viết thành công!",
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy bài viết!",
      error: error.message,
    });
  }
};

//Lấy danh sách bài viết theo người dùng
exports.getArticlesByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    const articles = await Article.findAll({
      where: {
        user_id,
      },
      include: [
        {
          model: User,
          as: "author",
        },
        {
          model: Directory,
          as: "directory",
        },
      ],
    });

    if (!articles || articles.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy bài viết của người dùng này!",
      });
    }

    res.status(200).json({
      message: "Lấy danh sách bài viết của người dùng thành công!",
      data: articles,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách bài viết của người dùng!",
      error: error.message,
    });
  }
};

const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ dấu
    .replace(/đ/g, "d") // Thay thế "đ" thành "d"
    .replace(/Đ/g, "D") // Thay thế "Đ" thành "D"
    .replace(/[^a-zA-Z0-9\s-]/g, "") // Loại bỏ ký tự đặc biệt
    .trim();
};

//Thêm một bài viết mới
exports.createArticle = async (req, res) => {
  try {
    const { directory_id, user_id, article_title, description } = req.body;

    const album_post =
      req.files && req.files.length > 0
        ? JSON.stringify(req.files.map((file) => file.path))
        : null;

    const processedTitle = removeVietnameseTones(article_title);

    // Tạo alias từ article_title
    const alias = slugify(processedTitle, {
      lower: true, // Chuyển thành chữ thường
      strict: true, // Loại bỏ ký tự đặc biệt
    });

    // Tạo bài viết mới
    const data = {
      directory_id,
      user_id,
      article_title,
      alias,
      album_post,
      description,
    };

    const newArticle = await Article.create(data);

    res.status(200).json({
      message: "Thêm bài viết mới thành công!",
      data: newArticle,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi thêm bài viết mới!",
      error: error.message,
    });
  }
};

//Cập nhật thông tin một bài viết
exports.updateArticle = async (req, res) => {
  try {
    const { article_id } = req.params;
    const {
      directory_id,
      user_id,
      article_title,
      description,
      true_featured,
      true_active,
    } = req.body;

    const album_post =
      req.files && req.files.length > 0
        ? JSON.stringify(req.files.map((file) => file.path))
        : null;

    const article = await Article.findByPk(article_id);

    if (!article) {
      return res.status(404).json({
        message: "Không tìm thấy bài viết!",
      });
    }

    if (directory_id !== undefined) article.directory_id = directory_id;
    if (user_id !== undefined) article.user_id = user_id;
    if (album_post !== null) article.album_post = album_post;
    if (description !== undefined) article.description = description;
    if (true_featured !== undefined) article.true_featured = true_featured;
    if (true_active !== undefined) article.true_active = true_active;
    if (article_title !== undefined) {
      article.article_title = article_title;

      // Xử lý tiếng Việt trước khi tạo alias
      const processedTitle = removeVietnameseTones(article_title);

      // Tạo lại alias nếu article_title thay đổi
      article.alias = slugify(processedTitle, {
        lower: true,
        strict: true,
      });
    }

    await article.save();

    res.status(200).json({
      message: "Cập nhật bài viết thành công!",
      data: article,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật bài viết!",
      error: error.message,
    });
  }
};

//Xóa một bài viết
exports.deleteArticle = async (req, res) => {
  try {
    const { article_id } = req.params;

    const article = await Article.findByPk(article_id);

    if (!article) {
      return res.status(404).json({
        message: "Không tìm thấy bài viết!",
      });
    }

    await article.destroy();

    res.status(200).json({
      message: "Xóa bài viết thành công!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa bài viết!",
      error: error.message,
    });
  }
};

//Tăng số lượt xem của bài viết
exports.incrementViews = async (req, res) => {
  try {
    const { id } = req.params;

    const article = await Article.findByPk(id);

    if (!article) {
      return res.status(404).json({
        message: "Không tìm thấy bài viết!",
      });
    }

    article.views += 1;
    await article.save();

    res.status(200).json({
      message: "Tăng số lượt xem thành công!",
      views: article.views,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tăng số lượt xem!",
      error: error.message,
    });
  }
};
