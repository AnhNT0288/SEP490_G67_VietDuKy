const db = require("../models");
const DiscountService = db.DiscountService;
const ProgramDiscount = db.ProgramDiscount;
const TravelTour = db.TravelTour;
const Tour = db.Tour;
const { Op } = require("sequelize");

// Lấy tất cả dịch vụ giảm giá
exports.getAllDiscountServices = async (req, res) => {
  try {
    const discountServices = await DiscountService.findAll({
      include: [
        { model: ProgramDiscount, as: "programDiscount" },
        { model: TravelTour, as: "travelTour", include: [{ model: Tour }] },
      ],
    });
    res.status(200).json({
      message: "Lấy danh sách dịch vụ giảm giá thành công",
      data: discountServices,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách dịch vụ giảm giá",
      error: error.message,
    });
  }
};

exports.addTravelTourToDiscountService = async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysLater = new Date(now);
    sevenDaysLater.setDate(now.getDate() + 7);

    // Tìm các tour sắp khởi hành và còn chỗ trống
    const upcomingTours = await db.TravelTour.findAll({
      where: {
        start_day: {
          [Op.between]: [now, sevenDaysLater]
        },
        current_people: {
          [Op.lt]: db.sequelize.literal('max_people - 10')
        }
      }
    });

    // Tạo DiscountService cho mỗi tour tìm được
    const createdServices = [];
    for (const tour of upcomingTours) {
      // Kiểm tra xem đã có DiscountService cho tour này chưa
      const existingService = await db.DiscountService.findOne({
        where: {
          travel_tour_id: tour.id,
          program_discount_id: 1
        }
      });

      // Nếu chưa có thì tạo mới
      if (!existingService) {
        const discountService = await db.DiscountService.create({
          travel_tour_id: tour.id,
          program_discount_id: 1 // ID cố định là 1 theo yêu cầu
        });
        createdServices.push(discountService);
      }
    }

    return res.status(200).json({
      message: `Đã tạo ${createdServices.length} dịch vụ giảm giá tự động!`,
      data: createdServices
    });

  } catch (error) {
    console.error("Lỗi khi thêm tour vào dịch vụ giảm giá:", error);
    res.status(500).json({
      message: "Lỗi khi thêm tour vào dịch vụ giảm giá!",
      error: error.message
    });
  }
};
exports.getNotApproveDiscountService = async (req, res) => {
  try {
    const discountServices = await DiscountService.findAll({
        where: { status: 0 },
        include: [
            { model: TravelTour, as: "travelTour", include: [{ model: Tour }] },
          ],
    });
    res.status(200).json({
      message: "Lấy danh sách dịch vụ giảm giá chưa phê duyệt thành công",
      data: discountServices,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách dịch vụ giảm giá chưa phê duyệt",
      error: error.message,
    });
  }
};  
exports.getApproveDiscountService = async (req, res) => {
  try {
    const discountServices = await DiscountService.findAll({
      where: { status: 1 },
      include: [
        { model: TravelTour, as: "travelTour", include: [{ model: Tour }] },
      ],
    });
    res.status(200).json({
      message: "Lấy danh sách dịch vụ giảm giá đã phê duyệt thành công",
      data: discountServices,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách dịch vụ giảm giá đã phê duyệt",
      error: error.message,
    });
  }
};
exports.approveDiscountService = async (req, res) => {
  try {
    const { discount_service_id, price_discount } = req.body;
    const discountService = await DiscountService.findByPk(discount_service_id);
    if (!discountService) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy dịch vụ giảm giá!" });
    }
    if (!price_discount) {
      return res
        .status(400)
        .json({ message: "Giá giảm không được để trống!" });
    }
    discountService.status = 1;
    discountService.price_discount = price_discount;
    await discountService.save();
    res.status(200).json({
      message: "Phê duyệt dịch vụ giảm giá thành công!",
      data: discountService,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi phê duyệt dịch vụ giảm giá",
      error: error.message,
    });
  }
};

// Lấy dịch vụ giảm giá theo ID
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
      return res
        .status(404)
        .json({ message: "Không tìm thấy dịch vụ giảm giá!" });
    }
    res.status(200).json({
      message: "Lấy dịch vụ giảm giá thành công",
      data: discountService,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy dịch vụ giảm giá",
      error: error.message,
    });
  }
};

// Tạo dịch vụ giảm giá mới
exports.createDiscountService = async (req, res) => {
  try {
    const { travel_tour_id } = req.body;

    const newDiscountService = await DiscountService.create({
      travel_tour_id,
      program_discount_id: 1,
    });

    res.status(201).json({
      message: "Tạo dịch vụ giảm giá thành công!",
      data: newDiscountService,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tạo dịch vụ giảm giá",
      error: error.message,
    });
  }
};

// Cập nhật dịch vụ giảm giá
exports.updateDiscountService = async (req, res) => {
  try {
    const discountServiceId = req.params.id;
    const { travel_tour_id, program_discount_id } = req.body;

    const discountService = await DiscountService.findByPk(discountServiceId);
    if (!discountService) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy dịch vụ giảm giá!" });
    }

    discountService.travel_tour_id =
      travel_tour_id || discountService.travel_tour_id;
    discountService.program_discount_id =
      program_discount_id || discountService.program_discount_id;

    await discountService.save();

    res.status(200).json({
      message: "Cập nhật dịch vụ giảm giá thành công!",
      data: discountService,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật dịch vụ giảm giá",
      error: error.message,
    });
  }
};

// Xóa dịch vụ giảm giá
exports.deleteDiscountService = async (req, res) => {
  try {
    const discountServiceId = req.params.id;

    const discountService = await DiscountService.findByPk(discountServiceId);
    if (!discountService) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy dịch vụ giảm giá!" });
    }

    await discountService.destroy();

    res.status(200).json({
      message: "Xóa dịch vụ giảm giá thành công!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi xóa dịch vụ giảm giá",
      error: error.message,
    });
  }
};
