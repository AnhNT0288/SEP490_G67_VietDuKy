console.error = jest.fn();

const {
  getFeedbackByUser,
  createFeedbackForTour,
  createFeedbackForTravelGuide,
  updateFeedback,
  deleteFeedback,
  getFeedbackByTourId,
  getFeedbackByTravelGuideId,
  getAllTourFeedbacksForAdmin,
  getAllTravelGuideFeedbacksForAdmin,
} = require('../controllers/feedback.controller');
const db = require('../models');
const { Feedback, User, Tour, TravelGuide } = db;

jest.mock('../models'); // Mock models

describe('Unit Test: Feedback Controller', () => {
  let req, res, user, tour, travelGuide, feedback;

  beforeEach(() => {
    req = {
      body: {
        user_id: 1,
        tour_id: 1,
        description_feedback: "Great tour!",
        rating_tour: 5,
        feedback_date: "2025-05-01",
      },
      params: {
        userId: 1,
        tourId: 1,
        travelGuideId: 1,
        id: 1,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    user = { id: 1, email: "user@example.com", displayName: "John Doe" };
    tour = { id: 1, name_tour: "Tour Hà Nội" };
    travelGuide = { id: 1, first_name: "Nguyễn", last_name: "Văn A" };
    feedback = {
      id: 1,
      user_id: user.id,
      tour_id: tour.id,
      description_feedback: "Great tour!",
      rating: 5,
      feedback_date: "2025-05-01",
      save: jest.fn().mockResolvedValue(true),
      destroy: jest.fn().mockResolvedValue(true),
    };

    db.User.findByPk = jest.fn().mockResolvedValue(user);
    db.Tour.findByPk = jest.fn().mockResolvedValue(tour);
    db.TravelGuide.findByPk = jest.fn().mockResolvedValue(travelGuide);
    db.Feedback.findOne = jest.fn().mockResolvedValue(feedback);
    db.Feedback.findAll = jest.fn().mockResolvedValue([feedback]);
    db.Feedback.create = jest.fn().mockResolvedValue(feedback);
    db.Feedback.destroy = jest.fn().mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset mock functions after each test
  });

  // Test: Lấy tất cả Feedback theo user_id
  it('should return all feedbacks for a user', async () => {
    await getFeedbackByUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Lấy feedback thành công",
      data: [feedback],
    });
  });

  // Test: Lỗi khi không tìm thấy người dùng
  it('should return 404 if user not found when getting feedback', async () => {
    db.User.findByPk = jest.fn().mockResolvedValue(null); // Mock user not found

    await getFeedbackByUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Người dùng không tồn tại!",
    });
  });

  // Test: Tạo feedback cho Tour
  it('should create feedback for tour successfully', async () => {
    await createFeedbackForTour(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tạo feedback cho tour thành công!",
      data: feedback,
    });
  });

  // Test: Lỗi khi tour không tồn tại khi tạo feedback
  it('should return 404 if tour not found when creating feedback for tour', async () => {
    db.Tour.findByPk = jest.fn().mockResolvedValue(null); // Mock tour not found

    await createFeedbackForTour(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tour không tồn tại!",
    });
  });

  // Test: Lỗi khi người dùng chưa đặt tour khi tạo feedback
  it('should return 403 if user has not booked the tour', async () => {
    db.Booking.findOne = jest.fn().mockResolvedValue(null); // Mock booking not found

    await createFeedbackForTour(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: "Bạn chưa đặt tour này, không thể feedback!",
    });
  });

  // Test: Tạo feedback cho Travel Guide
  it('should create feedback for travel guide successfully', async () => {
    await createFeedbackForTravelGuide(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tạo feedback cho hướng dẫn viên thành công!",
      data: feedback,
    });
  });

  // Test: Lỗi khi hướng dẫn viên không tồn tại khi tạo feedback
  it('should return 404 if travel guide not found when creating feedback for travel guide', async () => {
    db.TravelGuide.findByPk = jest.fn().mockResolvedValue(null); // Mock travel guide not found

    await createFeedbackForTravelGuide(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Hướng dẫn viên không tồn tại!",
    });
  });

  // Test: Lỗi khi người dùng chưa đặt tour có liên quan đến hướng dẫn viên khi tạo feedback
  it('should return 403 if user has not booked the tour with this travel guide', async () => {
    db.Booking.findOne = jest.fn().mockResolvedValue(null); // Mock booking not found

    await createFeedbackForTravelGuide(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message:
        "Bạn chưa đặt tour có liên quan đến hướng dẫn viên này, không thể feedback!",
    });
  });

  // Test: Cập nhật feedback
  it('should update feedback successfully', async () => {
    req.body.description_feedback = "Updated feedback"; // Changing feedback description to test update

    await updateFeedback(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cập nhật feedback thành công!",
      data: feedback,
    });
  });

  // Test: Xóa feedback
  it('should delete feedback successfully', async () => {
    await deleteFeedback(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Xóa feedback thành công!",
    });
  });

  // Test: Lỗi khi không tìm thấy feedback khi xóa
  it('should return 404 if feedback not found when deleting', async () => {
    db.Feedback.findByPk = jest.fn().mockResolvedValue(null); // Mock feedback not found

    await deleteFeedback(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Feedback không tồn tại!",
    });
  });

  // Test: Lấy feedback theo tour_id
  it('should return feedbacks by tour ID', async () => {
    await getFeedbackByTourId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Lấy feedback thành công",
      data: [feedback],
    });
  });

  // Test: Lỗi khi không tìm thấy tour khi lấy feedback
  it('should return 404 if tour not found when getting feedback by tour ID', async () => {
    db.Tour.findByPk = jest.fn().mockResolvedValue(null); // Mock tour not found

    await getFeedbackByTourId(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tour không tồn tại!",
    });
  });

  // Test: Lấy feedback theo travel_guide_id
  it('should return feedbacks by travel guide ID', async () => {
    await getFeedbackByTravelGuideId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Lấy feedback thành công",
      data: [feedback],
    });
  });

  // Test: Lỗi khi không tìm thấy travel guide khi lấy feedback
  it('should return 404 if travel guide not found when getting feedback by travel guide ID', async () => {
    db.TravelGuide.findByPk = jest.fn().mockResolvedValue(null); // Mock travel guide not found

    await getFeedbackByTravelGuideId(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Hướng dẫn viên không tồn tại!",
    });
  });

  // Test: Lấy tất cả feedback cho admin theo tour
  it('should return all tour feedbacks for admin', async () => {
    await getAllTourFeedbacksForAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Lấy danh sách feedback thành công",
      data: [feedback],
    });
  });

  // Test: Lấy tất cả feedback cho admin theo travel guide
  it('should return all travel guide feedbacks for admin', async () => {
    await getAllTravelGuideFeedbacksForAdmin(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Lấy danh sách feedback thành công",
      data: [feedback],
    });
  });
});
