const db = require("../models");
const slugify = require("slugify");
const PostExperience = db.PostExperience;
const User = db.User;

// Lấy tất cả bài viết trải nghiệm
exports.getAllPostExperiences = async (req, res) => {
  try {
    const postExperiences = await PostExperience.findAll({
      include: [{ model: User, as: "user" }],
    });

    res.status(200).json({
      message: "Lấy tất cả bài viết trải nghiệm thành công!",
      data: postExperiences,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy bài viết trải nghiệm",
      error: error.message,
    });
  }
};

// Lấy bài viết trải nghiệm theo ID
exports.getPostExperienceById = async (req, res) => {
  try {
    const postId = req.params.id;
    const postExperience = await PostExperience.findByPk(postId, {
      include: [{ model: User, as: "user" }],
    });

    if (!postExperience) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bài viết trải nghiệm!" });
    }

    res.status(200).json({
      message: "Lấy bài viết trải nghiệm thành công!",
      data: postExperience,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy bài viết trải nghiệm",
      error: error.message,
    });
  }
};

// Lấy bài viết trải nghiệm theo user_id
exports.getPostExperienceByUserId = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const postExperiences = await PostExperience.findAll({
      where: { user_id: userId },
      include: [{ model: User, as: "user" }],
    });

    if (!postExperiences || postExperiences.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy bài viết trải nghiệm của người dùng này!",
      });
    }

    res.status(200).json({
      message: "Lấy bài viết trải nghiệm thành công!",
      data: postExperiences,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy bài viết trải nghiệm",
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

// Tạo bài viết trải nghiệm mới
exports.createPostExperience = async (req, res) => {
  try {
    const { user_id, name_post, title_post, description_post, post_date } = req.body;
    const postEx_album =
      req.files && req.files.length > 0
        ? JSON.stringify(req.files.map((file) => file.path))
        : null;
    // Kiểm tra xem user có tồn tại không
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng!" });
    }

    // Xử lý tiếng Việt trước khi tạo alias
    const processedTitle = removeVietnameseTones(title_post);

    // Tạo alias từ title_post
    const alias = slugify(processedTitle, {
      lower: true, // Chuyển thành chữ thường
      strict: true, // Loại bỏ ký tự đặc biệt
    });

    // Tạo mới bài viết trải nghiệm
    const newPostExperience = await PostExperience.create({
      user_id,
      title_post,
      name_post,
      description_post,
      post_date,
      postEx_album,
      alias,
    });

    res.status(201).json({
      message: "Tạo bài viết trải nghiệm thành công!",
      data: newPostExperience,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tạo bài viết trải nghiệm",
      error: error.message,
    });
  }
};

// Cập nhật bài viết trải nghiệm
exports.updatePostExperience = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title_post, name_post, description_post, post_date } = req.body;
    const postEx_album =
      req.files && req.files.length > 0
        ? JSON.stringify(req.files.map((file) => file.path))
        : null;

    const postExperience = await PostExperience.findByPk(postId);
    if (!postExperience) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bài viết trải nghiệm!" });
    }

    // Cập nhật bài viết trải nghiệm
    if (title_post !== undefined) {
      postExperience.title_post = title_post;

      // Xử lý tiếng Việt trước khi tạo alias
      const processedTitle = removeVietnameseTones(title_post);

      // Tạo lại alias nếu title_post thay đổi
      postExperience.alias = slugify(processedTitle, {
        lower: true,
        strict: true,
      });
    }
    if (name_post != undefined)
      postExperience.name_post = name_post || postExperience.name_post;
    if (description_post != undefined)
      postExperience.description_post =
        description_post || postExperience.description_post;
    if (post_date != undefined)
      postExperience.post_date = post_date || postExperience.post_date;
    if (postEx_album != undefined)
      postExperience.postEx_album = postEx_album || postExperience.postEx_album;

    await postExperience.save();

    res.status(200).json({
      message: "Cập nhật bài viết trải nghiệm thành công!",
      data: postExperience,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật bài viết trải nghiệm",
      error: error.message,
    });
  }
};

// Xóa bài viết trải nghiệm
exports.deletePostExperience = async (req, res) => {
  try {
    const postId = req.params.id;

    const postExperience = await PostExperience.findByPk(postId);
    if (!postExperience) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bài viết trải nghiệm!" });
    }

    await postExperience.destroy();

    res.status(200).json({
      message: "Xóa bài viết trải nghiệm thành công!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa bài viết trải nghiệm",
      error: error.message,
    });
  }
};

//Duyệt bài viết trải nghiệm
exports.approvePostExperience = async (req, res) => {
  try {
    const postId = req.params.id;
    const postExperience = await PostExperience.findByPk(postId);
    if (!postExperience) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bài viết trải nghiệm!" });
    }

    if (postExperience.status === 1) {
      return res.status(400).json({
        message: "Bài viết trải nghiệm đã được duyệt trước đó rồi!",
      });
    }

    postExperience.status = 1; // Đánh dấu là đã duyệt
    await postExperience.save();

    res.status(200).json({
      message: "Duyệt bài viết trải nghiệm thành công!",
      data: postExperience,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi duyệt bài viết trải nghiệm",
      error: error.message,
    });
  }
};

//Từ chối bài viết trải nghiệm
exports.rejectPostExperience = async (req, res) => {
  try {
    const postId = req.params.id;
    const postExperience = await PostExperience.findByPk(postId);
    if (!postExperience) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bài viết trải nghiệm!" });
    }

    if (postExperience.status === 2) {
      return res.status(400).json({
        message: "Bài viết trải nghiệm đã được từ chối trước đó rồi!",
      });
    }

    postExperience.status = 2; // Đánh dấu là đã từ chối
    await postExperience.save();

    res.status(200).json({
      message: "Từ chối bài viết trải nghiệm thành công!",
      data: postExperience,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi từ chối bài viết trải nghiệm",
      error: error.message,
    });
  }
};

//Tăng số lượt xem của bài viết trải nghiệm
exports.incrementViews = async (req, res) => {
  try {
    const postId = req.params.id;
    const postExperience = await PostExperience.findByPk(postId);
    if (!postExperience) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy bài viết trải nghiệm!" });
    }

    postExperience.views += 1; // Tăng số lượt xem
    await postExperience.save();

    res.status(200).json({
      message: "Tăng số lượt xem bài viết trải nghiệm thành công!",
      views: postExperience.views,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tăng số lượt xem bài viết trải nghiệm",
      error: error.message,
    });
  }
};
