console.error = jest.fn();

const { getAllDirectories, createDirectory, updateDirectory, deleteDirectory } = require('../controllers/directory.controller');
const db = require('../models');
const { Directory } = db;

jest.mock('../models'); // Mock models

describe('Unit Test: Directory Controller', () => {
  let req, res, directory;

  beforeEach(() => {
    req = {
      body: {
        name_directory: "New Directory",
        alias: "new-directory",
      },
      params: {
        id: 1,
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    directory = {
      id: 1,
      name_directory: "Test Directory",
      alias: "test-directory",
      save: jest.fn().mockResolvedValue(true),
      destroy: jest.fn().mockResolvedValue(true),
    };

    db.Directory.findAll = jest.fn().mockResolvedValue([directory]);
    db.Directory.findByPk = jest.fn().mockResolvedValue(directory);
    db.Directory.create = jest.fn().mockResolvedValue(directory);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Reset mock functions after each test
  });

  // Test: Lấy tất cả danh mục
  it('should return all directories successfully', async () => {
    await getAllDirectories(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Lấy tất cả danh mục thành công!",
      data: [directory],
    });
  });

  // Test: Thêm một danh mục mới
  it('should create a new directory successfully', async () => {
    await createDirectory(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tạo danh mục thành công!",
      data: directory,
    });
  });

  // Test: Cập nhật một danh mục
  it('should update a directory successfully', async () => {
    req.body.name_directory = "Updated Directory"; // Changing name to test update

    await updateDirectory(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Cập nhật danh mục thành công!",
      data: directory,
    });
  });

  // Test: Lỗi khi không tìm thấy danh mục khi cập nhật
  it('should return 404 if directory not found when updating', async () => {
    db.Directory.findByPk = jest.fn().mockResolvedValue(null); // Mock directory not found

    await updateDirectory(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Không tìm thấy danh mục!",
    });
  });

  // Test: Xóa một danh mục
  it('should delete a directory successfully', async () => {
    await deleteDirectory(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Xóa danh mục thành công!",
    });
  });

  // Test: Lỗi khi không tìm thấy danh mục khi xóa
  it('should return 404 if directory not found when deleting', async () => {
    db.Directory.findByPk = jest.fn().mockResolvedValue(null); // Mock directory not found

    await deleteDirectory(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      message: "Không tìm thấy danh mục!",
    });
  });

  // Test: Lỗi khi tạo danh mục với dữ liệu thiếu
  it('should return 400 if required fields are missing when creating directory', async () => {
    req.body = {}; // Missing required fields

    await createDirectory(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Vui lòng cung cấp đầy đủ thông tin!",
    });
  });
});
