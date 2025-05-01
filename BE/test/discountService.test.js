console.error = jest.fn();

const {
  getAllDiscountServices,
  addTravelTourToDiscountService,
  getNotApproveDiscountService,
  getApproveDiscountService,
  approveDiscountService,
  getDiscountServiceById,
  createDiscountService,
  updateDiscountService,
  deleteDiscountService,
} = require('../controllers/discountService.controller');
const db = require('../models');
const { DiscountService, TravelTour, Tour, ProgramDiscount } = db;

jest.mock('../models'); // Mock models

describe('Unit Test: DiscountService Controller', () => {
  let req, res, discountService, travelTour;

  beforeEach(() => {
    req = {
      body: {
        travel_tour_id: 1,
        program_discount_id: 1,
        price_discount: 100000,
      },
      params: {
        id: 1,
      },
      query: {
        keyword: "Tour",
        travel_tour_id: 1,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    travelTour = { id: 1, name_tour: "Tour Hà Nội", max_people: 10, current_people: 2 };
    discountService = {
      id: 1,
      travel_tour_id: 1,
      program_discount_id: 1,
      price_discount: 100000,
      status: 0,
      save: jest.fn().mockResolvedValue(true),
      destroy: jest.fn().mockResolvedValue(true),
    };

    db.DiscountService.findAll = jest.fn().mockResolvedValue([discountService]);
    db.DiscountService.findByPk = jest.fn().mockResolvedValue(discountService);
    db.DiscountService.create = jest.fn().mockResolvedValue(discountService);
    db.TravelTour.findByPk = jest.fn().mockResolvedValue(travelTour);
    db.ProgramDiscount.findByPk = jest.fn().mockResolvedValue({ id: 1 });
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset mock functions after each test
  });

  // Test: Lấy tất cả dịch vụ giảm giá
  it('should return all discount services successfully', async () => {
    await getAllDiscountServices(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Lấy danh sách dịch vụ giảm giá thành công",
      data: [discountService],
    });
  });

  // Test: Thêm một TravelTour vào dịch vụ giảm giá
  it('should add travel tour to discount service successfully', async () => {
    db.TravelTour.findAll = jest.fn().mockResolvedValue([travelTour]);

    await addTravelTourToDiscountService(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Đã tạo 1 dịch vụ giảm giá tự động!",
      data: [discountService],
    });
  });

  // Test: Lấy danh sách dịch vụ giảm giá chưa phê duyệt
  it('should return not approve discount services', async () => {
    await getNotApproveDiscountService(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Lấy danh sách dịch vụ giảm giá chưa phê duyệt thành công",
      data: [discountService],
    });
  });

  // Test: Lấy danh sách dịch vụ giảm giá đã phê duyệt
  it('should return approve discount services', async () => {
    await getApproveDiscountService(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Lấy danh sách dịch vụ giảm giá đã phê duyệt thành công",
      data: [discountService],
    });
  });

  // Test: Phê duyệt dịch vụ giảm giá
  it('should approve discount service successfully', async () => {
    req.body.price_discount = 150000;

    await approveDiscountService(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Phê duyệt dịch vụ giảm giá thành công!",
      data: discountService,
    });
  });

  // Test: Lỗi khi phê duyệt dịch vụ giảm giá (giá giảm không hợp lệ)
  it('should return 400 if price discount is missing', async () => {
    req.body.price_discount = null;

    await approveDiscountService(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Giá giảm không được để trống!",
    });
  });

  // Test: Lấy dịch vụ giảm giá theo ID
  it('should return discount service by ID', async () => {
    await getDiscountServiceById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Lấy dịch vụ giảm giá thành công",
      data: discountService,
    });
  });

  // Test: Tạo dịch vụ giảm giá mới
  it('should create a new discount service successfully', async () => {
    await createDiscountService(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tạo dịch vụ giảm giá thành công!",
      data: discountService,
    });
  });

  // Test: Cập nhật dịch vụ giảm giá
  it('should update discount service successfully', async () => {
    req.body.price_discount = 120000; // Changing price_discount to test update

    await updateDiscountService(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cập nhật dịch vụ giảm giá thành công!",
      data: discountService,
    });
  });

  // Test: Xóa dịch vụ giảm giá
  it('should delete discount service successfully', async () => {
    await deleteDiscountService(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Xóa dịch vụ giảm giá thành công!",
    });
  });

  // Test: Lỗi khi không tìm thấy dịch vụ giảm giá khi xóa
  it('should return 404 if discount service not found when deleting', async () => {
    db.DiscountService.findByPk = jest.fn().mockResolvedValue(null); // Mock not found

    await deleteDiscountService(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Không tìm thấy dịch vụ giảm giá!",
    });
  });
});
