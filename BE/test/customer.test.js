console.error = jest.fn();

const {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  getCustomerProfile,
  updateCustomerProfile,
} = require('../controllers/customer.controller');
const db = require('../models');
const bcrypt = require('bcryptjs');
jest.mock('../models'); // Mock models
jest.mock('bcryptjs'); // Mock bcrypt

describe('Unit Test: Customer Controller', () => {
  let req, res, customer, user;

  beforeEach(() => {
    req = {
      body: {
        user_id: 1,
        first_name: "John",
        last_name: "Doe",
        email: "johndoe@example.com",
        password: "password",
      },
      params: {
        id: 1,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    user = { id: 1, email: "johndoe@example.com", password: "hashedpassword" };
    customer = {
      id: 1,
      user_id: user.id,
      first_name: "John",
      last_name: "Doe",
      email: "johndoe@example.com",
      save: jest.fn().mockResolvedValue(true),
    };

    db.User.findByPk = jest.fn().mockResolvedValue(user);
    db.Customer.findByPk = jest.fn().mockResolvedValue(customer);
    db.Customer.create = jest.fn().mockResolvedValue(customer);
    db.Customer.findAll = jest.fn().mockResolvedValue([customer]);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset mock functions after each test
  });

  // Test: Lấy danh sách tất cả khách hàng
  it('should return all customers successfully', async () => {
    await getAllCustomers(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Lấy danh sách tất cả khách hàng thành công!",
      data: [customer],
    });
  });

  // Test: Lấy khách hàng theo ID
  it('should return customer by ID successfully', async () => {
    await getCustomerById(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Lấy thông tin khách hàng thành công!",
      data: customer,
    });
  });

  // Test: Tạo khách hàng mới
  it('should create a new customer successfully', async () => {
    await createCustomer(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tạo người dùng thành công!",
      data: customer,
    });
  });

  // Test: Cập nhật thông tin khách hàng
  it('should update customer successfully', async () => {
    req.body.first_name = "Jane"; // Changing first name to test update

    await updateCustomer(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cập nhật thông tin người dùng thành công!",
      data: customer,
    });
  });

  // Test: Lấy thông tin profile khách hàng
  it('should return customer profile successfully', async () => {
    req.user = { id: 1 }; // Mock user from JWT token

    const profile = {
      id: 1,
      email: "johndoe@example.com",
      displayName: "John Doe",
      avatar: "avatar.jpg",
      Customer: customer,
    };
    db.User.findOne = jest.fn().mockResolvedValue(profile);

    await getCustomerProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(profile);
  });

  // Test: Cập nhật thông tin profile khách hàng
  it('should update customer profile successfully', async () => {
    req.user = { id: 1 }; // Mock user from JWT token
    req.body.number_phone = "0909876543"; // Changing phone number to test update

    const updatedUser = { ...user, Customer: { ...customer, number_phone: req.body.number_phone } };

    db.User.findOne = jest.fn().mockResolvedValue(updatedUser);
    db.Customer.save = jest.fn().mockResolvedValue(updatedUser.Customer);

    await updateCustomerProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cập nhật thông tin người dùng thành công",
      user: updatedUser,
    });
  });

  // Test: Lỗi khi tạo khách hàng mới (user không tồn tại)
  it('should return 404 if user does not exist when creating customer', async () => {
    db.User.findByPk = jest.fn().mockResolvedValue(null); // Mock user not found

    await createCustomer(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Người dùng không tồn tại!",
    });
  });

  // Test: Lỗi khi cập nhật thông tin khách hàng (customer không tồn tại)
  it('should return 404 if customer does not exist when updating customer', async () => {
    db.Customer.findByPk = jest.fn().mockResolvedValue(null); // Mock customer not found

    await updateCustomer(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Người dùng không tồn tại!",
    });
  });

  // Test: Lỗi khi không cung cấp đủ thông tin khi tạo khách hàng
  it('should return 400 if required fields are missing when creating customer', async () => {
    req.body = { user_id: 1 }; // Missing first_name, last_name, email

    await createCustomer(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Vui lòng cung cấp đầy đủ thông tin!",
    });
  });

  // Test: Lỗi khi cập nhật thông tin khách hàng với thông tin không hợp lệ
  it('should return 400 if invalid data is provided when updating customer', async () => {
    req.body.email = "invalidEmail"; // Invalid email

    await updateCustomer(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email không hợp lệ!",
    });
  });
});
