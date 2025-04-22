const db = require("../models");
const bcrypt = require("bcryptjs");
const Customer = db.Customer;
const User = db.User;

//Lấy danh sách tất cả Customer
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.json({
      message: "Lấy danh sách tất cả khách hàng thành công!",
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy danh sách khách hàng!",
      error: error.message,
    });
  }
};

//Lấy một Customer theo ID
exports.getCustomerById = async (req, res) => {
  try {
    const id = req.params.id;
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({
        message: "Khách hàng không tồn tại!",
      });
    }
    res.json({
      message: "Lấy thông tin khách hàng thành công!",
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy thông tin khách hàng!",
      error: error.message,
    });
  }
};

//Tạo một Customer mới (id, user_id, first_name, last_name, email, gender, birth_date, number_phone)
exports.createCustomer = async (req, res) => {
  try {
    const { user_id, first_name, last_name, email } = req.body;
    if (!user_id || !first_name || !last_name || !email) {
      return res.status(400).json({
        message: "Vui lòng cung cấp đầy đủ thông tin!",
      });
    }

    //Kiểm tra xem user_id có tồn tại trong bảng User không
    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({
        message: "Người dùng không tồn tại!",
      });
    }

    const data = { user_id, first_name, last_name, email };
    const customer = await Customer.create(data);
    res.json({
      message: "Tạo người dùng thành công!",
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi tạo người dùng!",
      error: error.message,
    });
  }
};

//Cập nhật thông tin một Customer theo ID
exports.updateCustomer = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      user_id,
      first_name,
      last_name,
      email,
      gender,
      birth_date,
      number_phone,
    } = req.body;
    const customer = await Customer.findByPk(id);
    if (!customer) {
      return res.status(404).json({
        message: "Người dùng không tồn tại!",
      });
    }

    if (user_id != undefined && user_id != customer.user_id) {
      customer.user_id = user_id;
    }
    if (first_name != undefined) {
      customer.first_name = first_name;
    }
    if (last_name != undefined) {
      customer.last_name = last_name;
    }
    if (email != undefined) {
      customer.email = email;
    }
    if (gender != undefined) {
      customer.gender = gender;
    }
    if (birth_date != undefined) {
      customer.birth_date = birth_date;
    }
    if (number_phone != undefined) {
      customer.number_phone = number_phone;
    }
    await customer.save();
    res.json({
      message: "Cập nhật thông tin người dùng thành công!",
      data: customer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật thông tin người dùng!",
      error: error.message,
    });
  }
};

// Lấy thông tin Customer theo User ID
exports.getCustomerProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy user_id từ token

    // Tìm user và bao gồm thông tin Customer (nếu có)
    const user = await User.findOne({
      where: { id: userId },
      attributes: ["id", "email", "password", "displayName", "avatar"], // Chọn các trường cần thiết từ bảng User
      include: [
        {
          model: Customer,
          attributes: [
            "id",
            "first_name",
            "last_name",
            "number_phone",
            "gender",
            "birth_date",
            "payment_card_id",
          ], // Các trường của Customer
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    return res.json(user); // Trả về toàn bộ thông tin User + Customer
  } catch (error) {
    console.error("Lỗi khi lấy profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Chỉnh sửa thông tin Customer theo User ID
exports.updateCustomerProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Lấy user_id từ token
    const { password, number_phone, gender, birth_date } = req.body; // Dữ liệu từ client

    // Kiểm tra user tồn tại
    const user = await User.findOne({
      where: { id: userId },
      include: Customer,
    });
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    // Cập nhật mật khẩu (nếu có)
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Cập nhật số điện thoại (nếu có customer)
    if (user.Customer) {
      user.Customer.number_phone = number_phone || user.Customer.number_phone;
      await user.Customer.save();
    }

    // Cập nhật giới tính (nếu có customer)
    if (user.Customer) {
      user.Customer.birth_date = birth_date || user.Customer.birth_date;
      await user.Customer.save();
    }

    // Cập nhật ngày sinh (nếu có customer)
    if (user.Customer) {
      user.Customer.gender = gender || user.Customer.gender;
      await user.Customer.save();
    }

    // Cập nhật thông tin user
    user.displayName = req.body.displayName || user.displayName;
    user.avatar = req.body.avatar || user.avatar;
    user.email = req.body.email || user.email;

    // Lưu thông tin user
    await user.save();

    return res.json({
      message: "Cập nhật thông tin người dùng thành công",
      user,
    });
  } catch (error) {
    console.error("Lỗi khi cập nhật profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
