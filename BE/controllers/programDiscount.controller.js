const db = require("../models");
const ProgramDiscount = db.ProgramDiscount;

//Lấy tất cả chương trình giảm giá
exports.getAllProgramDiscounts = async (req, res) => {
  try {
    const discounts = await ProgramDiscount.findAll();
    res.status(200).json({
      message: "Program discounts fetched successfully",
      data: discounts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching program discounts",
      error: error.message,
    });
  }
};

//Lấy chương trình giảm giá theo ID
exports.getProgramDiscountById = async (req, res) => {
  try {
    const discountId = req.params.id;
    const discount = await ProgramDiscount.findByPk(discountId);
    if (!discount) {
      return res.status(404).json({ message: "Program discount not found!" });
    }
    res.status(200).json({
      message: "Program discount fetched successfully",
      data: discount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching program discount",
      error: error.message,
    });
  }
};

//Tạo chương trình giảm giá mới
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

    const newDiscount = await ProgramDiscount.create({
      discount_name,
      description,
      discount_value,
      percent_discount,
      start_date,
      end_date,
    });

    res.status(201).json({
      message: "Program discount created successfully!",
      data: newDiscount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating program discount",
      error: error.message,
    });
  }
};

//  Cập nhật chương trình giảm giá theo ID
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
      return res.status(404).json({ message: "Program discount not found!" });
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
      message: "Program discount updated successfully!",
      data: discount,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating program discount",
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
      return res.status(404).json({ message: "Program discount not found!" });
    }

    await discount.destroy();

    res.status(200).json({
      message: "Program discount deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting program discount",
      error: error.message,
    });
  }
};
