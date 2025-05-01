console.error = jest.fn();

const {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getLatestBooking,
  getBookingByUserId,
  searchBooking,
  getBookingByBookingCode,
  getBookingByTravelTourId,
} = require('../controllers/booking.controller');
const db = require('../models');
const { Booking, TravelTour, User, Passenger } = db;

jest.mock('../models'); // Mock models

describe('Unit Test: Booking Controller', () => {
  let req, res, booking, user, travelTour;

  beforeEach(() => {
    req = {
      body: {
        user_id: 1,
        travel_tour_id: 1,
        number_adult: 2,
        number_children: 1,
        number_toddler: 0,
        total_cost: 500000,
        name: "John Doe",
        phone: "0901234567",
        email: "johndoe@example.com",
        address: "123 Street",
        note: "Special request",
        passengers: [],
      },
      params: {
        id: 1,
        booking_code: "BOOK123",
      },
      query: {
        keyword: "John",
        travel_tour_id: 1,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    user = { id: 1, email: "johndoe@example.com", avatar: "avatar.jpg" };
    travelTour = { id: 1, tour_id: 1, price_tour: 250000, max_people: 10, current_people: 2, active: true };
    booking = { 
      id: 1, 
      user_id: user.id, 
      travel_tour_id: travelTour.id, 
      number_adult: 2, 
      number_children: 1, 
      total_cost: 500000, 
      booking_code: "BOOK123", 
      name: "John Doe",
      status: 0,
      save: jest.fn().mockResolvedValue(true),
      destroy: jest.fn().mockResolvedValue(true),
    };

    db.User.findByPk = jest.fn().mockResolvedValue(user);
    db.TravelTour.findByPk = jest.fn().mockResolvedValue(travelTour);
    db.Booking.findAll = jest.fn().mockResolvedValue([booking]);
    db.Booking.findByPk = jest.fn().mockResolvedValue(booking);
    db.Booking.create = jest.fn().mockResolvedValue(booking);
    db.Passenger.create = jest.fn().mockResolvedValue(true);
    db.Passenger.findAll = jest.fn().mockResolvedValue([]);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset mock functions after each test
  });

  // Test: Lấy danh sách tất cả booking
  it('should return all bookings successfully', async () => {
    await getAllBookings(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tất cả booking đã được lấy thành công!",
      data: [booking],
    });
  });

  // Test: Lấy booking theo ID
  it('should return booking by ID successfully', async () => {
    await getBookingById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tất cả booking đã được lấy thành công!",
      data: booking,
    });
  });

  // Test: Tạo mới một booking
  it('should create a new booking successfully', async () => {
    await createBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Đặt tour thành công!",
      data: booking,
    });
  });

  // Test: Cập nhật booking
  it('should update a booking successfully', async () => {
    req.body.name = "Jane Doe"; // Changing name to test update

    await updateBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cập nhật booking thành công!",
      data: booking,
    });
  });

  // Test: Xóa booking
  it('should delete a booking successfully', async () => {
    await deleteBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Đã hủy booking thành công!",
    });
  });

  // Test: Lấy booking mới nhất
  it('should return the latest booking successfully', async () => {
    db.Booking.findOne = jest.fn().mockResolvedValue(booking);

    await getLatestBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Lấy booking mới nhất thành công!",
      data: booking,
    });
  });

  // Test: Lấy booking theo mã booking
  it('should return booking by booking code', async () => {
    req.body.booking_code = "BOOK123"; // Providing booking code

    await getBookingByBookingCode(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Lấy booking thành công!",
      data: booking,
    });
  });

  // Test: Tìm kiếm booking
  it('should search bookings by keyword successfully', async () => {
    await searchBooking(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tìm kiếm booking thành công!",
      data: [booking],
    });
  });

  // Test: Lấy booking theo travel tour ID
  it('should return bookings by travel tour ID', async () => {
    req.params.id = 1; // Providing travel tour ID

    await getBookingByTravelTourId(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Lấy booking thành công!",
      data: [booking],
    });
  });
});
