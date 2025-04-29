const db = require("../models");
const VehicleBooking = db.VehicleBooking;
const Vehicle = db.Vehicle;
const Booking = db.Booking;
const TravelTour = db.TravelTour;
const Tour = db.Tour;
const Location = db.Location;

exports.createVehicle = async (req, res) => {
    try {
        const { name_vehicle, plate_number, phone_number, location_id } = req.body;
        const location = await Location.findByPk(location_id);
        if (!location) {
            return res.status(404).json({ message: "Không tìm thấy vị trí" });
        }
        const vehicle = await Vehicle.create({ name_vehicle, plate_number, phone_number, location_id });
        res.status(201).json({ message: "Phương tiện đã được tạo thành công", data: vehicle });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.findAll({ include: [{ model: Location, attributes: ['name_location'] }] });
        res.status(200).json({ message: "Phương tiện đã được lấy thành công", data: vehicles });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getVehicleById = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findByPk(id, { include: [{ model: Location}] });
        if (!vehicle) {
            return res.status(404).json({ message: "Không tìm thấy phương tiện" });
        }
        res.status(200).json({ message: "Phương tiện đã được lấy thành công", data: vehicle });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const { name_vehicle, plate_number, phone_number, location_id } = req.body;
        const vehicle = await Vehicle.findByPk(id);
        if (!vehicle) {
            return res.status(404).json({ message: "Không tìm thấy phương tiện" });
        }
        const location = await Location.findByPk(location_id);
        if (!location) {
            return res.status(404).json({ message: "Không tìm thấy vị trí" });
        }
        await Vehicle.update({ name_vehicle, plate_number, phone_number, location_id }, { where: { id } });
        res.status(200).json({ message: "Phương tiện đã được cập nhật thành công", data: vehicle });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.deleteVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findByPk(id);
        if (!vehicle) {
            return res.status(404).json({ message: "Không tìm thấy phương tiện" });
        }
        await Vehicle.destroy({ where: { id } });
        res.status(200).json({ message: "Phương tiện đã được xóa thành công", data: vehicle });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.getVehicleByLocation = async (req, res) => {
    try {
        const { location_id } = req.params;
        const location = await Location.findByPk(location_id);
        if (!location) {
            return res.status(404).json({ message: "Không tìm thấy vị trí" });
        }
        const vehicle = await Vehicle.findAll({ where: { location_id }, include: [{ model: Location, attributes: ['name_location'] }] });
        res.status(200).json({ message: "Phương tiện đã được lấy thành công", data: vehicle });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getVehicleByTravelTour = async (req, res) => {
    try {
        const { travel_tour_id } = req.params;
        const travelTour = await TravelTour.findByPk(travel_tour_id);
        if (!travelTour) {
            return res.status(404).json({ message: "Không tìm thấy tour" });
        }
        const tour = await Tour.findByPk(travelTour.tour_id);
        if (!tour) {
            return res.status(404).json({ message: "Không tìm thấy tour" });
        }
        const vehicle = await Vehicle.findAll({ where: { location_id: tour.start_location }, include: [{ model: Location, attributes: ['name_location'] }] });
        res.status(200).json({ message: "Phương tiện đã được lấy thành công", data: vehicle });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}