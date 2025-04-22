const db = require("../models");
const ProgramDiscount = db.ProgramDiscount;

// Lấy tất cả chương trình giảm giá
exports.getAllProgramDiscounts = async (req, res) => {
  try {
    const discounts = await ProgramDiscount.findAll();
    res.status(200).json({
      message: "Lấy danh sách chương trình giảm giá thành công",
      data: discounts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách chương trình giảm giá",
      error: error.message,
    });
  }
};

// Lấy chương trình giảm giá theo ID
exports.getProgramDiscountById = async (req, res) => {
  try {
    const discountId = req.params.id;
    const discount = await ProgramDiscount.findByPk(discountId);
    if (!discount) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy chương trình giảm giá!" });
    }
    res.status(200).json({
      message: "Lấy thông tin chương trình giảm giá thành công",
      data: discount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy thông tin chương trình giảm giá",
      error: error.message,
    });
  }
};

// Tạo chương trình giảm giá mới
exports.createProgramDiscount = async (req, res) => {
  try {
    const {
      discount_name,
      description,
      discount_value,
      percent_discount,
      start_date,
      end_date,
    } = req.body;
    const image = req.file ? req.file.path : null;

    const newDiscount = await ProgramDiscount.create({
      discount_name,
      description,
      discount_value,
      percent_discount,
      start_date,
      end_date,
      image,
    });

    res.status(201).json({
      message: "Tạo chương trình giảm giá thành công!",
      data: newDiscount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tạo chương trình giảm giá",
      error: error.message,
    });
  }
};

// Cập nhật chương trình giảm giá theo ID
exports.updateProgramDiscount = async (req, res) => {
  try {
    const discountId = req.params.id;
    const {
      discount_name,
      description,
      discount_value,
      percent_discount,
      start_date,
      end_date,
      status,
    } = req.body;

    const discount = await ProgramDiscount.findByPk(discountId);
    if (!discount) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy chương trình giảm giá!" });
    }

    if (discount_name != undefined)
      discount.discount_name = discount_name || discount.discount_name;
    if (description != undefined)
      discount.description = description || discount.description;
    if (discount_value != undefined)
      discount.discount_value = discount_value || discount.discount_value;
    if (percent_discount != undefined)
      discount.percent_discount = percent_discount || discount.percent_discount;
    if (start_date != undefined)
      discount.start_date = start_date || discount.start_date;
    if (end_date != undefined)
      discount.end_date = end_date || discount.end_date;
    if (status != undefined) discount.status = status || discount.status;

    await discount.save();

    res.status(200).json({
      message: "Cập nhật chương trình giảm giá thành công!",
      data: discount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật chương trình giảm giá",
      error: error.message,
    });
  }
};

// Xóa chương trình giảm giá theo ID
exports.deleteProgramDiscount = async (req, res) => {
  try {
    const discountId = req.params.id;

    const discount = await ProgramDiscount.findByPk(discountId);
    if (!discount) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy chương trình giảm giá!" });
    }

    await discount.destroy();

    res.status(200).json({
      message: "Xóa chương trình giảm giá thành công!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa chương trình giảm giá",
      error: error.message,
    });
  }
};
