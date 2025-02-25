const db = require("../models");
const DiscountService = db.DiscountService;
const ProgramDiscount = db.ProgramDiscount;
const TravelTour = db.TravelTour;

//Lấy tất cả dịch vụ giảm giá
exports.getAllDiscountServices = async (req, res) => {
  try {
    const discountServices = await DiscountService.findAll({
      include: [
        { model: ProgramDiscount, as: "programDiscount" },
        { model: TravelTour, as: "travelTour" },
      ],
    });
    res.status(200).json({
      message: "Discount services fetched successfully",
      data: discountServices,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching discount services",
      error: error.message,
    });
  }
};

//Lấy dịch vụ giảm giá theo ID
exports.getDiscountServiceById = async (req, res) => {
  try {
    const discountServiceId = req.params.id;
    const discountService = await DiscountService.findByPk(discountServiceId, {
      include: [
        { model: ProgramDiscount, as: "programDiscount" },
        { model: TravelTour, as: "travelTour" },
      ],
    });
    if (!discountService) {
      return res.status(404).json({ message: "Discount service not found!" });
    }
    res.status(200).json({
      message: "Discount service fetched successfully",
      data: discountService,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching discount service",
      error: error.message,
    });
  }
};

//Tạo dịch vụ giảm giá mới
exports.createDiscountService = async (req, res) => {
  try {
    const { travel_tour_id, program_discount_id } = req.body;

    const newDiscountService = await DiscountService.create({
      travel_tour_id,
      program_discount_id,
    });

    res.status(201).json({
      message: "Discount service created successfully!",
      data: newDiscountService,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating discount service",
      error: error.message,
    });
  }
};

//Cập nhật dịch vụ giảm giá
exports.updateDiscountService = async (req, res) => {
  try {
    const discountServiceId = req.params.id;
    const { travel_tour_id, program_discount_id } = req.body;

    const discountService = await DiscountService.findByPk(discountServiceId);
    if (!discountService) {
      return res.status(404).json({ message: "Discount service not found!" });
    }

    discountService.travel_tour_id =
      travel_tour_id || discountService.travel_tour_id;
    discountService.program_discount_id =
      program_discount_id || discountService.program_discount_id;

    await discountService.save();

    res.status(200).json({
      message: "Discount service updated successfully!",
      data: discountService,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating discount service",
      error: error.message,
    });
  }
};

//Xóa dịch vụ giảm giá
exports.deleteDiscountService = async (req, res) => {
  try {
    const discountServiceId = req.params.id;

    const discountService = await DiscountService.findByPk(discountServiceId);
    if (!discountService) {
      return res.status(404).json({ message: "Discount service not found!" });
    }

    await discountService.destroy();

    res.status(200).json({
      message: "Discount service deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting discount service",
      error: error.message,
    });
  }
};
