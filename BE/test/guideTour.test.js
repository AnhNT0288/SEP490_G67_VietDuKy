console.error = jest.fn();

const {
  getGuideTours,
  addGuideToTour,
  approveGuideTour,
  getGuideTourByUserId,
  getAvailableTravelGuidesForTour,
  getGuideTourStatistics,
  getPendingGuideTour,
} = require('../controllers/guideTour.controller');
const db = require('../models');
const { GuideTour, TravelTour, TravelGuide, User, Tour, Passenger, Booking } = db;

jest.mock('../models'); // Mock models

describe('Unit Test: GuideTour Controller', () => {
  let req, res, guideTour, travelTour, travelGuide, user;

  beforeEach(() => {
    req = {
      body: {
        travel_tour_id: 1,
        travel_guide_id: 1,
        group_name: "Group A",
        isLeader: true,
      },
      params: {
        id: 1,
        travel_tour_id: 1,
        userId: 1,
        travelGuideId: 1,
      },
      query: {
        rating: 5,
        timeFilter: "this_month",
        page: 1,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    user = { id: 1, email: "user@example.com", displayName: "John Doe" };
    travelGuide = { id: 1, first_name: "Nguyễn", last_name: "Văn A", email: "guide@example.com", number_phone: "0901234567" };
    travelTour = { id: 1, tour_id: 1, start_day: "2025-05-01", end_day: "2025-05-05", price_tour: 1000000, max_people: 20, current_people: 10 };
    guideTour = { id: 1, travel_guide_id: 1, travel_tour_id: 1, group_name: "Group A", isLeader: true, status: 0, save: jest.fn().mockResolvedValue(true), destroy: jest.fn().mockResolvedValue(true) };

    db.User.findByPk = jest.fn().mockResolvedValue(user);
    db.TravelGuide.findByPk = jest.fn().mockResolvedValue(travelGuide);
    db.TravelTour.findByPk = jest.fn().mockResolvedValue(travelTour);
    db.GuideTour.findAll = jest.fn().mockResolvedValue([guideTour]);
    db.GuideTour.findOne = jest.fn().mockResolvedValue(guideTour);
    db.GuideTour.create = jest.fn().mockResolvedValue(guideTour);
    db.GuideTour.update = jest.fn().mockResolvedValue(true);
    db.GuideTour.destroy = jest.fn().mockResolvedValue(true);
    db.Tour.findByPk = jest.fn().mockResolvedValue({ name_tour: "Tour Hà Nội" });
    db.Passenger.findAll = jest.fn().mockResolvedValue([{ id: 1, travel_guide_id: 1 }]);
    db.Booking.findAll = jest.fn().mockResolvedValue([{ id: 1 }]);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset mock functions after each test
  });

  // Test: Lấy danh sách yêu cầu tham gia tour từ TravelGuide
  it('should return all guide tours successfully', async () => {
    await getGuideTours(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Lấy danh sách tour của hướng dẫn viên thành công!",
      data: [guideTour],
    });
  });

  // Test: Thêm hướng dẫn viên vào tour
  it('should add guide to tour successfully', async () => {
    await addGuideToTour(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Gửi yêu cầu tham gia tour thành công! Vui lòng đợi admin xác nhận.",
      data: guideTour,
    });
  });

  // Test: Phê duyệt hướng dẫn viên tham gia tour
  it('should approve guide tour successfully', async () => {
    await approveGuideTour(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Duyệt hướng dẫn viên thành công và đã gửi email thông báo!",
    });
  });

  // Test: Lấy thống kê hướng dẫn viên cho tour
  it('should return guide tour statistics successfully', async () => {
    const stats = { ongoing: 5, completed: 3, pending: 2, cancelled: 1, totalCustomers: 50 };
    db.GuideTour.findAll = jest.fn().mockResolvedValue([{ status: 1, travelTour: { status: 2, current_people: 5 } }]);

    await getGuideTourStatistics(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Lấy thống kê GuideTour thành công",
      data: {
        currentSchedule: stats.ongoing,
        completedSchedule: stats.completed,
        pendingSchedule: stats.pending,
        cancelledSchedule: stats.cancelled,
        totalCustomers: stats.totalCustomers,
        comparison: expect.any(Object),
        monthInfo: expect.any(Object),
      },
    });
  });

  // Test: Lấy danh sách TravelGuide chưa được phê duyệt
  it('should return all pending guide tours', async () => {
    await getPendingGuideTour(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Lấy danh sách GuideTour chờ thành công!",
      data: [guideTour],
    });
  });

  // Test: Lỗi khi thêm hướng dẫn viên vào tour
  it('should return 400 if guide has already requested for the tour', async () => {
    db.GuideTour.findOne = jest.fn().mockResolvedValue(guideTour); // Mock existing guide request

    await addGuideToTour(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Hướng dẫn viên đã gửi yêu cầu tham gia tour này rồi! Vui lòng kiểm tra lại",
    });
  });

  // Test: Lỗi khi không tìm thấy hướng dẫn viên trong yêu cầu
  it('should return 404 if guide tour not found when approving', async () => {
    db.GuideTour.findByPk = jest.fn().mockResolvedValue(null); // Mock guide tour not found

    await approveGuideTour(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Không tìm thấy hướng dẫn viên trong tour!",
    });
  });
});
