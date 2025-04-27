const db = require("../models");
const HotelBooking = db.HotelBooking;
const Hotel = db.Hotel;
const Booking = db.Booking;
const Location = db.Location;

exports.createHotel = async (req, res) => {
    try {
        const { name_hotel, address_hotel, phone_number, location_id } = req.body;
        const location = await Location.findByPk(location_id);
        if (!location) {
            return res.status(404).json({ message: "Không tìm thấy vị trí" });
        }
        const hotel = await Hotel.create({ name_hotel, address_hotel, phone_number, location_id });
        res.status(201).json({ message: "Khách sạn đã được tạo thành công", data: hotel });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.findAll({ include: [{ model: Location, attributes: ['name_location'] }] });
        res.status(200).json({ message: "Khách sạn đã được lấy thành công", data: hotels });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getHotelById = async (req, res) => {
    try {
        const { id } = req.params;
        const hotel = await Hotel.findByPk(id, { include: [{ model: Location}] });
        if (!hotel) {
            return res.status(404).json({ message: "Không tìm thấy khách sạn" });
        }
        res.status(200).json({ message: "Khách sạn đã được lấy thành công", data: hotel });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const { name_hotel, address_hotel, phone_number, location_id } = req.body;
        const hotel = await Hotel.findByPk(id);
        if (!hotel) {
            return res.status(404).json({ message: "Không tìm thấy khách sạn" });
        }
        const location = await Location.findByPk(location_id);
        if (!location) {
            return res.status(404).json({ message: "Không tìm thấy vị trí" });
        }
        await Hotel.update({ name_hotel, address_hotel, phone_number, location_id }, { where: { id } });
        res.status(200).json({ message: "Khách sạn đã được cập nhật thành công", data: hotel });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteHotel = async (req, res) => {
    try {
        const { id } = req.params;
        const hotel = await Hotel.findByPk(id);
        if (!hotel) {
            return res.status(404).json({ message: "Không tìm thấy khách sạn" });
        }
        await Hotel.destroy({ where: { id } });
        res.status(200).json({ message: "Khách sạn đã được xóa thành công", data: hotel });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

