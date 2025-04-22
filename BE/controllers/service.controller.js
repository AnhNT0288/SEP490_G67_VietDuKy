const db = require("../models");
const Service = db.Service;

// Lấy tất cả dữ liệu từ bảng Service
module.exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.findAll();
        res.json({
            message: "Lấy tất cả dịch vụ thành công!",
            data: services,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lấy tất cả dịch vụ thất bại!",
            error: error.message,
        });
    }
};

//Lấy dữ liệu từ bảng Service theo id
module.exports.getServiceById = async (req, res) => {
    try {
        const id = req.params.id;
        const service = await Service.findByPk(id);
        if (!service) {
            return res.status(404).json({error: "Dịch vụ không tồn tại"});
        }
        res.json({
            message: "Lấy dịch vụ theo ID thành công!",
            data: service,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lấy dịch vụ theo ID thất bại!",
            error: error.message,
        });
    }
};

//Tạo mới dữ liệu trong bảng Service
module.exports.createService = async (req, res) => {
    try {
        const {name_service, price_service, description_service} = req.body;
        if (!name_service) {
            return res.status(400).json({error: "Vui lòng nhập tên dịch vụ"});
        }
        const existingService = await Service.findOne({
            where: {
                name_service: name_service,
            },
        });
        if (existingService) {
            return res.status(400).json({error: "Dịch vụ đã tồn tại"});
        }
        const newService = await Service.create({
            name_service,
            price_service,
            description_service,
        });
        res.status(201).json({
            message: "Tạo dịch vụ mới thành công!",
            data: newService,
        });
    } catch (error) {
        res.status(500).json({
            message: "Tạo dịch vụ mới thất bại!",
            error: error.message,
        });
    }
};

//Xóa dữ liệu trong bảng Service theo id
module.exports.deleteService = async (req, res) => {
    try {
        const id = req.params.id;
        const service = await Service.findByPk(id);
        if (!service) {
            return res.status(404).json({error: "Dịch vụ không tồn tại"});
        }
        await service.destroy();
        res.json({
            message: "Xóa dịch vụ thành công!",
            data: service,
        });
    } catch (error) {
        res.status(500).json({
            message: "Xóa dịch vụ thất bại!",
            error: error.message,
        });
    }
};

//Cập nhật dữ liệu trong bảng Service theo id
module.exports.updateService = async (req, res) => {
    try {
        const id = req.params.id;
        const {name_service, price_service, description_service} = req.body;
        const service = await Service.findByPk(id);
        if (!service) {
            return res.status(404).json({error: "Dịch vụ không tồn tại"});
        }

        if (name_service !== undefined) service.name_service = name_service;
        if (price_service !== undefined) service.price_service = price_service;
        if (description_service !== undefined)
            service.description_service = description_service;

        await service.save();
        res.json({
            message: "Cập nhật dịch vụ thành công!",
            data: service,
        });
    } catch (error) {
        res.status(500).json({
            message: "Cập nhật dịch vụ thất bại!",
            error: error.message,
        });
    }
};
