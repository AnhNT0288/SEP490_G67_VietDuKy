const db = require("../models");
const RestaurantBooking = db.RestaurantBooking;
const Restaurant = db.Restaurant;
const Booking = db.Booking;

exports.createRestaurant = async (req, res) => {
  try {
    const { name_restaurant, address_restaurant, phone_number, location_id } = req.body;
    const restaurant = await Restaurant.create({
      name_restaurant,
      address_restaurant,
      phone_number,
      location_id,
    });
    const location = await db.Location.findByPk(location_id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.status(201).json({ message: "Tạo nhà hàng thành công", data: restaurant, location: location });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRestaurant = async (req, res) => {
  try { 
    const restaurant = await Restaurant.findAll({
      include: [
        {
          model: db.Location,
          attributes: ["id", "name_location"],
        },
      ],
    });
    res.status(200).json({ message: "Lấy danh sách nhà hàng thành công", data: restaurant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByPk(id, {
      include: [
        {
          model: db.Location,
          as: "location",
          attributes: ["id", "name_location"],
        },
      ],
    });
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.status(200).json({ message: "Lấy danh sách nhà hàng thành công", data: restaurant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRestaurantByLocation = async (req, res) => {
  try {
    const { location_id } = req.params;
    const restaurant = await Restaurant.findAll({ where: { location_id } });
    res.status(200).json({ message: "Lấy danh sách nhà hàng thành công", data: restaurant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name_restaurant, address_restaurant, phone_number, location_id } = req.body;
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Nhà hàng không tồn tại" });
    }
    await Restaurant.update(
      { name_restaurant, address_restaurant, phone_number, location_id },
      { where: { id } }
    );
    const location = await db.Location.findByPk(location_id);
    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }
    res.status(200).json({ message: "Cập nhật nhà hàng thành công", data: restaurant, location: location });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Nhà hàng không tồn tại" });
    }
    await Restaurant.destroy({ where: { id } });
    res.status(200).json({ message: "Xóa nhà hàng thành công", data: restaurant });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



