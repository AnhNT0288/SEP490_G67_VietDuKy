const db = require("../models");
const HotelBooking = db.HotelBooking;
const Hotel = db.Hotel;
const Booking = db.Booking;

exports.createHotel = async (req, res) => {
    try {
        const { name_hotel, address_hotel, phone_number } = req.body;
        const hotel = await Hotel.create({ name_hotel, address_hotel, phone_number });
        res.status(201).json({ message: "Khách sạn đã được tạo thành công", data: hotel });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.findAll();
        res.status(200).json({ message: "Khách sạn đã được lấy thành công", data: hotels });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getHotelById = async (req, res) => {
    try {
        const { id } = req.params;
        const hotel = await Hotel.findByPk(id);
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
        const { name_hotel, address_hotel, phone_number } = req.body;
        const hotel = await Hotel.findByPk(id);
        if (!hotel) {
            return res.status(404).json({ message: "Không tìm thấy khách sạn" });
        }
        await Hotel.update({ name_hotel, address_hotel, phone_number }, { where: { id } });
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

