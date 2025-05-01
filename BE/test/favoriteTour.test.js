console.error = jest.fn();

const {
  addFavoriteTour,
  getFavoriteToursByUser,
  removeFavoriteTour,
} = require('../controllers/favoriteTour.controller');
const db = require('../models');
const { FavoriteTour, Tour, User } = db;

jest.mock('../models'); // Mock models

describe('Unit Test: FavoriteTour Controller', () => {
  let req, res, user, tour, favorite;

  beforeEach(() => {
    req = {
      body: {
        user_id: 1,
        tour_id: 1,
      },
      params: {
        user_id: 1,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    user = { id: 1, email: "user@example.com", displayName: "John Doe" };
    tour = { id: 1, name_tour: "Tour Hà Nội" };
    favorite = { id: 1, user_id: user.id, tour_id: tour.id };

    db.User.findByPk = jest.fn().mockResolvedValue(user);
    db.Tour.findByPk = jest.fn().mockResolvedValue(tour);
    db.FavoriteTour.findOne = jest.fn().mockResolvedValue(favorite);
    db.FavoriteTour.findAll = jest.fn().mockResolvedValue([favorite]);
    db.FavoriteTour.create = jest.fn().mockResolvedValue(favorite);
    db.FavoriteTour.destroy = jest.fn().mockResolvedValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset mock functions after each test
  });

  // Test: Thêm tour vào danh sách yêu thích
  it('should add tour to favorite successfully', async () => {
    await addFavoriteTour(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Thêm tour vào danh sách yêu thích thành công!",
      data: favorite,
    });
  });

  // Test: Lỗi khi tour không tồn tại trong danh sách yêu thích
  it('should return 404 if tour does not exist when adding to favorite', async () => {
    db.Tour.findByPk = jest.fn().mockResolvedValue(null); // Mock tour not found

    await addFavoriteTour(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tour không tồn tại!",
    });
  });

  // Test: Lỗi khi tour đã có trong danh sách yêu thích
  it('should return 400 if tour is already in favorite list', async () => {
    db.FavoriteTour.findOne = jest.fn().mockResolvedValue(favorite); // Mock existing favorite

    await addFavoriteTour(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tour đã có trong danh sách yêu thích!",
    });
  });

  // Test: Lấy danh sách tour yêu thích của người dùng
  it('should return all favorite tours for a user', async () => {
    await getFavoriteToursByUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Lấy danh sách tour yêu thích thành công!",
      data: [favorite],
    });
  });

  // Test: Lỗi khi không tìm thấy người dùng khi lấy danh sách yêu thích
  it('should return 404 if user not found when getting favorite tours', async () => {
    db.User.findByPk = jest.fn().mockResolvedValue(null); // Mock user not found

    await getFavoriteToursByUser(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Người dùng không tồn tại!",
    });
  });

  // Test: Xóa tour khỏi danh sách yêu thích
  it('should remove tour from favorite successfully', async () => {
    await removeFavoriteTour(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Xóa tour khỏi danh sách yêu thích thành công!",
    });
  });

  // Test: Lỗi khi không tìm thấy tour trong danh sách yêu thích khi xóa
  it('should return 404 if tour not found when removing from favorite', async () => {
    db.FavoriteTour.findOne = jest.fn().mockResolvedValue(null); // Mock favorite not found

    await removeFavoriteTour(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tour không tồn tại trong danh sách yêu thích!",
    });
  });
});
