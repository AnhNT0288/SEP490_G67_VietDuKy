console.error = jest.fn();

const { register, login, refreshToken, sendResetCode, resetPassword, verifyResetCode } = require('../controllers/auth.controller');
const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
jest.mock('../models'); // Mock models
jest.mock('jsonwebtoken'); // Mock jwt
jest.mock('bcryptjs'); // Mock bcrypt

describe('Unit Test: Auth Controller', () => {
  let req, res, user;

  beforeEach(() => {
    req = {
      body: {
        email: "testuser@example.com",
        password: "password",
        newPassword: "newpassword",
        resetCode: "123456",
      }
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    user = {
      id: 1,
      email: "testuser@example.com",
      password: "hashedpassword",
      reset_code: "123456",
      reset_code_expiry: new Date(Date.now() + 10 * 60 * 1000),
      save: jest.fn().mockResolvedValue(true),
      comparePassword: jest.fn().mockResolvedValue(true),
    };

    db.User.findOne = jest.fn().mockResolvedValue(user);
    bcrypt.hash = jest.fn().mockResolvedValue("hashedpassword");
    jwt.sign = jest.fn().mockReturnValue("accessToken");
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test: Đăng ký người dùng
  it('should register a user successfully', async () => {
    db.User.create = jest.fn().mockResolvedValue(user);

    await register(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tạo tài khoản thành công!",
      user: expect.objectContaining({
        email: user.email,
      }),
    });
  });

  // Test: Đăng nhập người dùng
  it('should login user successfully and return tokens', async () => {
    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: user.id,
      email: user.email,
      access_token: "accessToken",
      refresh_token: "accessToken", // Use mock return value from jwt.sign
    });
  });

  // Test: Refresh Token
  it('should return new access token with valid refresh token', async () => {
    req.body.token = "validRefreshToken";
    jwt.verify = jest.fn().mockReturnValue({ id: user.id });

    await refreshToken(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ access_token: "accessToken" });
  });

  // Test: Gửi mã xác thực quên mật khẩu
  it('should send reset code successfully', async () => {
    db.User.findOne = jest.fn().mockResolvedValue(user);

    await sendResetCode(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Mã xác thực đã được gửi đến email của bạn!",
    });
  });

  // Test: Đổi mật khẩu thành công
  it('should reset password successfully', async () => {
    const newPassword = "newpassword";
    const confirmPassword = "newpassword";

    req.body.newPassword = newPassword;
    req.body.confirmPassword = confirmPassword;

    await resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Đổi mật khẩu thành công!",
    });
  });

  // Test: Mã xác thực hợp lệ
  it('should verify reset code successfully', async () => {
    await verifyResetCode(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Mã xác thực hợp lệ" });
  });

  // Test: Lỗi khi mã xác thực không hợp lệ
  it('should return 400 if reset code is invalid', async () => {
    user.reset_code = "wrongCode"; // Mock invalid reset code

    await verifyResetCode(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Mã xác thực không hợp lệ!",
    });
  });

  // Test: Lỗi khi đổi mật khẩu không khớp
  it('should return 400 if new passwords do not match', async () => {
    req.body.confirmPassword = "wrongpassword";

    await resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Mật khẩu không khớp!",
    });
  });

  // Test: Lỗi khi người dùng không tồn tại
  it('should return 404 if user not found', async () => {
    db.User.findOne = jest.fn().mockResolvedValue(null); // Mock user not found

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tài khoản hoặc mật khẩu không đúng!",
    });
  });
});
